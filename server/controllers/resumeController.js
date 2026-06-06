const Candidate = require('../models/Candidate');
const pdfParse = require('pdf-parse');
const OpenAI = require('openai');
const sendEmail = require('../utils/email');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const screenOffline = (resumeText, jobRole, jobDescription) => {
  // 1. Extract email
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  const emails = resumeText.match(emailRegex);
  const email = emails ? emails[0] : "candidate@example.com";

  // 2. Extract phone
  const phoneRegex = /(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const phones = resumeText.match(phoneRegex);
  const phone = phones ? phones[0] : "N/A";

  // 3. Extract Name
  const lines = resumeText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let name = "Candidate Profile";
  if (lines.length > 0) {
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      if (!lines[i].includes('@') && !lines[i].match(/\d{4,}/) && lines[i].length > 2 && lines[i].length < 40) {
        name = lines[i];
        break;
      }
    }
  }

  // 4. Keyword matches for skills
  const commonSkills = [
    "javascript", "typescript", "react", "node", "express", "mongodb", "python", "java", "c++", 
    "sql", "aws", "docker", "git", "kubernetes", "html", "css", "vue", "angular", "rust", "go",
    "management", "communication", "leadership", "agile", "scrum", "hr", "recruitment", "finance"
  ];
  
  const resumeTextLower = resumeText.toLowerCase();
  const jdLower = (jobDescription || "").toLowerCase() + " " + (jobRole || "").toLowerCase();

  const matchedSkills = [];
  const missingSkills = [];

  commonSkills.forEach(skill => {
    const inJD = jdLower.includes(skill);
    if (inJD) {
      if (resumeTextLower.includes(skill)) {
        matchedSkills.push(skill.toUpperCase());
      } else {
        missingSkills.push(skill.toUpperCase());
      }
    }
  });

  if (matchedSkills.length === 0) {
    commonSkills.forEach(skill => {
      if (resumeTextLower.includes(skill)) {
        matchedSkills.push(skill.toUpperCase());
      }
    });
  }

  let technicalScore = 3;
  let communicationScore = 3;
  
  if (matchedSkills.length > 0) {
    const ratio = matchedSkills.length / (matchedSkills.length + missingSkills.length || 1);
    technicalScore = Math.min(5, Math.max(1, Math.round(ratio * 5)));
  }

  const commKeywords = ["written", "verbal", "communication", "presentation", "team", "collaborate"];
  let commCount = 0;
  commKeywords.forEach(kw => {
    if (resumeTextLower.includes(kw)) commCount++;
  });
  communicationScore = Math.min(5, Math.max(1, Math.round((commCount / commKeywords.length) * 5)));

  const overallScore = Math.round(((technicalScore + communicationScore) / 2) * 10) / 10;
  
  let rating = "Average";
  let recommendation = "Maybe";
  if (overallScore >= 4.5) {
    rating = "Excellent";
    recommendation = "Strongly Recommended";
  } else if (overallScore >= 3.5) {
    rating = "Good";
    recommendation = "Recommended";
  } else if (overallScore < 2.5) {
    rating = "Poor";
    recommendation = "Not Recommended";
  }

  const keyStrengths = [];
  if (matchedSkills.length > 0) keyStrengths.push(`Proficient in ${matchedSkills.slice(0, 3).join(', ')}`);
  if (commCount > 2) keyStrengths.push("Good communication skills");
  if (keyStrengths.length === 0) keyStrengths.push("General profile match");

  let yearsOfExperience = 2;
  const expMatch = resumeTextLower.match(/(\d+)\+?\s*(year|yr)s?\s*(of)?\s*experience/i);
  if (expMatch && expMatch[1]) {
    yearsOfExperience = parseInt(expMatch[1]);
  } else {
    const dates = resumeTextLower.match(/\b(20\d{2})\b/g);
    if (dates && dates.length >= 2) {
      const uniqueYears = [...new Set(dates.map(Number))].sort((a,b)=>a-b);
      const span = uniqueYears[uniqueYears.length - 1] - uniqueYears[0];
      if (span > 0 && span < 30) yearsOfExperience = span;
    }
  }

  return {
    name,
    email,
    phone,
    technicalScore,
    communicationScore,
    overallScore,
    rating,
    skillsMatched: matchedSkills,
    skillsMissing: missingSkills,
    keyStrengths,
    yearsOfExperience,
    aiFeedback: `[Offline Fallback Analysis] OpenAI API quota exceeded or service unavailable. Matched skills: ${matchedSkills.slice(0, 5).join(', ')}.`,
    recommendation
  };
};

exports.screenBulk = async (req, res) => {
  try {
    const { jobDescription, jobRole } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No resumes uploaded' });
    }

    const results = [];

    for (let file of req.files) {
      const pdfData = await pdfParse(file.buffer);
      const resumeText = pdfData.text;

      let parsedData;
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an expert HR recruiter. Analyse the resume against the job description. Return ONLY valid JSON, no markdown:\n" +
              "  {\"name\":\"string\",\"email\":\"string\",\"phone\":\"string\",\"technicalScore\":number,\"communicationScore\":number,\"overallScore\":number,\"rating\":\"Excellent|Good|Average|Poor\",\"skillsMatched\":[\"string\"],\"skillsMissing\":[\"string\"],\"keyStrengths\":[\"string\"],\"yearsOfExperience\":number,\"aiFeedback\":\"string\",\"recommendation\":\"Strongly Recommended|Recommended|Maybe|Not Recommended\"}"
            },
            {
              role: "user",
              content: `Job Role: ${jobRole}\nJob Description: ${jobDescription}\n\nResume:\n${resumeText}`
            }
          ]
        });

        const aiResponse = completion.choices[0].message.content;
        parsedData = JSON.parse(aiResponse);
      } catch (err) {
        console.warn("OpenAI API error, falling back to offline analysis:", err.message);
        parsedData = screenOffline(resumeText, jobRole, jobDescription);
      }

      const candidate = await Candidate.create({
        ...parsedData,
        resumeFileName: file.originalname,
        resumeText: resumeText,
        jobRole,
        status: 'pending'
      });
      
      results.push(candidate);
    }

    results.sort((a, b) => b.overallScore - a.overallScore);
    res.status(201).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCandidates = async (req, res) => {
  try {
    const { jobRole, status, rating } = req.query;
    let query = {};
    if (jobRole) query.jobRole = jobRole;
    if (status) query.status = status;
    if (rating) query.rating = rating;

    const candidates = await Candidate.find(query).sort({ overallScore: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    
    // Send Notification to candidate
    const msg = status === 'shortlisted' ? 
      `Congratulations ${candidate.name}!\n\nYou have been shortlisted for the ${candidate.jobRole} position. We will contact you shortly with interview details.` :
      `Hello ${candidate.name},\n\nThank you for applying for the ${candidate.jobRole} position. We have decided to move forward with other candidates.`;
    
    if (candidate.email) {
      sendEmail({
        to: candidate.email,
        subject: `Update on your application for ${candidate.jobRole}`,
        text: msg
      });
    }

    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
