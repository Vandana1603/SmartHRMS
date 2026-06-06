const OpenAI = require('openai');
const HRPolicy = require('../models/HRPolicy');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Sample HR Policies (can be extended)
const DEFAULT_HR_POLICIES = [
  {
    title: 'Annual Leave Policy',
    content: 'Employees are entitled to 20 days of paid annual leave per year. Leave requests should be submitted at least 2 weeks in advance through the HR portal. Approval is subject to manager\'s confirmation and business requirements.',
    keywords: ['leave', 'vacation', 'annual', 'days', 'holiday']
  },
  {
    title: 'Sick Leave Policy',
    content: 'Employees are entitled to 10 days of paid sick leave per year. For absences exceeding 3 consecutive days, a medical certificate from a registered doctor is required. Unused sick leave does not carry forward to the next year.',
    keywords: ['sick', 'illness', 'medical', 'health', 'absent']
  },
  {
    title: 'Maternity and Paternity Leave',
    content: 'Female employees are entitled to 6 months of paid maternity leave. Male employees are entitled to 15 days of paid paternity leave. Additional unpaid leave may be negotiated with HR on case-by-case basis.',
    keywords: ['maternity', 'paternity', 'pregnancy', 'baby', 'parent']
  },
  {
    title: 'Working Hours and Remote Work',
    content: 'Standard working hours are 9 AM to 6 PM, Monday to Friday. Remote work is permitted on Tuesdays and Thursdays with manager approval. Employees are expected to maintain regular communication and attend all scheduled meetings.',
    keywords: ['work', 'hours', 'remote', 'office', 'time', 'schedule']
  },
  {
    title: 'Health and Life Insurance',
    content: 'All employees and their immediate family members are covered under the company\'s health insurance plan. Coverage includes hospitalization, outpatient treatment, dental care, and vision care. Details are available from the HR department.',
    keywords: ['insurance', 'health', 'medical', 'coverage', 'benefits', 'family']
  },
  {
    title: 'Performance Review and Development',
    content: 'Annual performance reviews are conducted in December. Employees are evaluated on job performance, technical skills, teamwork, and professional development. Performance bonuses and salary increments are awarded based on review outcomes.',
    keywords: ['performance', 'review', 'evaluation', 'rating', 'assessment', 'bonus']
  },
  {
    title: 'Code of Conduct',
    content: 'All employees must adhere to the company code of conduct, which includes professional behavior, punctuality, confidentiality of company information, ethical business practices, and respectful treatment of colleagues and clients.',
    keywords: ['conduct', 'ethics', 'professional', 'behavior', 'policy', 'rules']
  },
  {
    title: 'Training and Professional Development',
    content: 'The company provides an annual training budget of $2,000 per employee for professional development, certifications, and skill enhancement. Employees are encouraged to pursue courses relevant to their job roles and career growth.',
    keywords: ['training', 'development', 'course', 'certificate', 'learning', 'budget']
  },
  {
    title: 'Flexible Working Arrangements',
    content: 'Flexible working hours can be approved by management on a case-by-case basis. Core hours of 10 AM to 4 PM must be maintained. Employees must coordinate with their teams to ensure business continuity and project deadlines are met.',
    keywords: ['flexible', 'arrangement', 'hours', 'timing', 'work']
  },
  {
    title: 'Workplace Safety and Wellness',
    content: 'The company is committed to providing a safe and healthy work environment. Employees should report any safety concerns immediately to HR. The company provides wellness programs including gym memberships, health checkups, and mental health support.',
    keywords: ['safety', 'wellness', 'health', 'gym', 'mental', 'support']
  }
];

// Simple keyword matching for fallback RAG
const findRelevantPolicies = (question, policies) => {
  const questionLower = question.toLowerCase();
  const scored = policies.map(policy => {
    let score = 0;
    const titleWords = (policy.title || '').toLowerCase().split(' ');
    const contentWords = (policy.content || '').toLowerCase().split(' ');
    const keywords = policy.keywords || [];

    // Check for exact title matches
    titleWords.forEach(word => {
      if (word.length > 3 && questionLower.includes(word)) score += 3;
    });

    // Check for keyword matches
    keywords.forEach(keyword => {
      if (questionLower.includes(keyword)) score += 2;
    });

    // Check for content word matches
    contentWords.forEach(word => {
      if (word.length > 4 && questionLower.includes(word)) score += 1;
    });

    return { 
      title: policy.title || 'HR Policy',
      content: policy.content || 'Policy details are being retrieved.',
      score 
    };
  });

  return scored.filter(p => p.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
};

// Fallback RAG without OpenAI
const getAnswerFromPolicies = (question, policies) => {
  const relevant = findRelevantPolicies(question, policies);
  
  if (relevant.length === 0) {
    return "I don't have specific information about that topic. Please contact HR for more details.";
  }

  let answer = `Based on our HR policies:\n\n`;
  relevant.forEach((policy, index) => {
    answer += `**${policy.title}:**\n${policy.content}`;
    if (index < relevant.length - 1) answer += '\n\n';
  });

  return answer;
};

// Ask Policy Question (RAG with fallback)
exports.askPolicy = async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Fetch policies from database or use defaults
    let policies = await HRPolicy.find({}).limit(20).catch(() => []);
    
    if (policies.length === 0) {
      policies = DEFAULT_HR_POLICIES;
    }

    // Try OpenAI if API key is available
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
      try {
        const policyContent = policies.map(p => `${p.title}: ${p.content}`).join('\n\n');
        const systemPrompt = `You are an HR policy assistant. Answer questions based on the following HR policies:\n\n${policyContent}\n\nIf the question is not related to HR policies or if you don't have information about it, politely ask the employee to contact HR. Keep responses concise and helpful (under 150 words).`;

        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: question }
          ],
          temperature: 0.7,
          max_tokens: 300
        });

        const answer = response.choices[0].message.content;
        return res.json({
          answer: answer || 'I could not generate an answer. Please contact HR.',
          source: 'openai'
        });
      } catch (openaiErr) {
        console.error('OpenAI API error:', openaiErr.message);
        // Fall through to fallback RAG
      }
    }

    // Fallback: Use simple RAG without OpenAI
    const answer = getAnswerFromPolicies(question, policies);
    res.json({
      answer: answer,
      source: 'fallback'
    });

  } catch (err) {
    console.error('Chatbot error:', err.message || err);
    res.status(500).json({
      error: 'Failed to process question',
      message: 'Please try again or contact HR for assistance'
    });
  }
};

// Get All Policies
exports.getAllPolicies = async (req, res) => {
  try {
    const policies = await HRPolicy.find({}).sort({ createdAt: -1 });
    
    if (policies.length === 0) {
      // Return default policies if none exist
      return res.json(DEFAULT_HR_POLICIES.map((p, i) => ({
        _id: i,
        title: p.title,
        content: p.content,
        createdAt: new Date()
      })));
    }
    
    res.json(policies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create Policy (Admin only)
exports.createPolicy = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const policy = new HRPolicy({
      title,
      content
    });

    await policy.save();
    res.status(201).json(policy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Policy (Admin only)
exports.updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const policy = await HRPolicy.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );

    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }

    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Policy (Admin only)
exports.deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const policy = await HRPolicy.findByIdAndDelete(id);

    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }

    res.json({ message: 'Policy deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
