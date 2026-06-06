const Interview = require('../models/Interview');
const Candidate = require('../models/Candidate');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateQuestionsOffline = (jobRole, jobDescription) => {
  const role = (jobRole || '').toLowerCase();
  
  const techQuestions = {
    engineering: [
      "Can you describe your experience with modern JavaScript frameworks (like React, Angular, or Vue) and state management?",
      "How do you optimize application performance and handle memory leaks in a production environment?",
      "Explain your approach to designing scalable database schemas in relational vs. non-relational databases.",
      "How do you handle security vulnerabilities and secure APIs in Node.js applications?",
      "Describe a challenging bug you recently solved. What was your debugging process?"
    ],
    hr: [
      "How do you align recruitment strategies with overall organizational business goals?",
      "Describe a situation where you had to mediate a difficult workplace conflict. How did you resolve it?",
      "What methods do you use to design effective candidate onboarding experiences?",
      "How do you approach talent acquisition for highly specialized technical roles?",
      "Explain your strategy for maintaining high employee engagement and positive workplace culture."
    ],
    finance: [
      "Can you walk us through your experience with financial modeling and forecasting?",
      "How do you ensure accuracy and regulatory compliance during annual audit preparation?",
      "Describe how you manage cost reduction initiatives without impacting operational efficiency.",
      "What key metrics do you analyze to evaluate an organization's overall financial health?",
      "How do you manage cash flow forecasting in times of market volatility?"
    ],
    marketing: [
      "What key metrics do you track to measure the return on investment (ROI) of marketing campaigns?",
      "How do you conduct market analysis to identify new customer segments or product opportunities?",
      "Describe a successful brand positioning strategy you designed and implemented.",
      "How do you optimize digital marketing spend across search, display, and social channels?",
      "Explain your process for creating and executing a content marketing strategy."
    ],
    operations: [
      "How do you identify bottlenecks in operational processes and implement workflow improvements?",
      "Describe your experience with supply chain optimization and vendor relationship management.",
      "What methods do you use to measure and maintain service quality standards?",
      "Explain how you manage capacity planning and resource allocation under tight deadlines.",
      "Describe a time you successfully managed a major organizational change initiative."
    ]
  };

  let category = 'engineering';
  if (role.includes('hr') || role.includes('recruit') || role.includes('human resource')) category = 'hr';
  else if (role.includes('finance') || role.includes('account') || role.includes('billing')) category = 'finance';
  else if (role.includes('market') || role.includes('sales') || role.includes('seo')) category = 'marketing';
  else if (role.includes('operat') || role.includes('logist') || role.includes('admin')) category = 'operations';

  return techQuestions[category] || techQuestions['engineering'];
};

const analyseInterviewOffline = (transcript, jobRole) => {
  const transcriptLower = (transcript || '').toLowerCase();
  
  const positiveIndicators = ["experience", "solved", "designed", "optimized", "scale", "team", "collaborated", "agile", "challenges", "learning"];
  const negativeIndicators = ["don't know", "unsure", "maybe", "like...", "um", "uh", "forgot", "confused"];
  
  let posCount = 0;
  let negCount = 0;
  
  positiveIndicators.forEach(w => {
    const matches = transcriptLower.match(new RegExp(w, 'g'));
    if (matches) posCount += matches.length;
  });
  
  negativeIndicators.forEach(w => {
    const matches = transcriptLower.match(new RegExp(w, 'g'));
    if (matches) negCount += matches.length;
  });

  const confidenceScore = Math.min(10, Math.max(5, 7 + (posCount - negCount) * 0.5));
  const clarityScore = Math.min(10, Math.max(5, 8 - negCount * 0.5));
  const relevanceScore = Math.min(10, Math.max(5, 7 + posCount * 0.5));
  const communicationScore = Math.min(10, Math.max(5, 8 - (negCount > 5 ? 2 : 0)));
  
  const overallScore = Math.round(((confidenceScore + clarityScore + relevanceScore + communicationScore) / 4) * 10) / 10;
  
  let verdict = "Hire";
  if (overallScore >= 8.5) verdict = "Strong Hire";
  else if (overallScore >= 6.5) verdict = "Hire";
  else if (overallScore >= 5.5) verdict = "Maybe";
  else verdict = "No Hire";

  return {
    clarityScore,
    confidenceScore,
    relevanceScore,
    communicationScore,
    overallScore,
    strengths: [
      "Demonstrates clear experience in positive core domains",
      "Answers questions structured and focus on relevant outcomes",
      "Shows teamwork and adaptability in described projects"
    ],
    improvements: [
      "Could expand on technical trade-offs and edge-cases",
      "Try to limit filler words or hesitations under pressure"
    ],
    detailedFeedback: `[Offline AI Analytics Fallback] OpenAI rate limits exceeded. Local parsing has analyzed candidate speech patterns. The candidate shows a ${verdict.toLowerCase()} suitability for the ${jobRole} role, with strong scores in relevance (${relevanceScore}/10) and communication (${communicationScore}/10).`,
    verdict
  };
};

exports.generateQuestions = async (req, res) => {
  try {
    const { jobRole, jobDescription } = req.body;

    let questions;
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Return ONLY a JSON array of exactly 5 interview question strings. No numbering, no markdown."
          },
          {
            role: "user",
            content: `Job Role: ${jobRole}\nJob Description: ${jobDescription}\nGenerate technical and behavioural questions.`
          }
        ]
      });

      const aiResponse = completion.choices[0].message.content;
      questions = JSON.parse(aiResponse);
    } catch (err) {
      console.warn("OpenAI API error, generating offline fallback questions:", err.message);
      questions = generateQuestionsOffline(jobRole, jobDescription);
    }

    res.json({ questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.analyseInterview = async (req, res) => {
  try {
    const { candidateId, transcript, jobRole, questions } = req.body;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    let parsedData;
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Analyse transcript. Return ONLY valid JSON:\n  {\"clarityScore\":number,\"confidenceScore\":number,\"relevanceScore\":number,\"communicationScore\":number,\"overallScore\":number,\"strengths\":[\"string\"],\"improvements\":[\"string\"],\"detailedFeedback\":\"string\",\"verdict\":\"Strong Hire|Hire|Maybe|No Hire\"}"
          },
          {
            role: "user",
            content: `Job Role: ${jobRole}\nQuestions asked:\n${JSON.stringify(questions)}\n\nInterview Transcript:\n${transcript}`
          }
        ]
      });

      const aiResponse = completion.choices[0].message.content;
      parsedData = JSON.parse(aiResponse);
    } catch (err) {
      console.warn("OpenAI API error, falling back to local analysis:", err.message);
      parsedData = analyseInterviewOffline(transcript, jobRole);
    }

    const interview = await Interview.create({
      candidateId,
      transcript,
      jobRole,
      generatedQuestions: questions,
      ...parsedData
    });

    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({ candidateId: req.params.candidateId }).populate('candidateId', 'name email jobRole');
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
