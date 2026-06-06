require('dotenv').config();
const mongoose = require('mongoose');
const HRPolicy = require('./models/HRPolicy');

const policies = [
  {
    title: 'Annual Leave Policy',
    content: 'Employees are entitled to 20 days of paid annual leave per year. Leave requests should be submitted at least 2 weeks in advance through the HR portal. Approval is subject to manager\'s confirmation and business requirements.',
    category: 'leave',
    keywords: ['leave', 'vacation', 'annual', 'days', 'holiday', 'time off', 'paid leave']
  },
  {
    title: 'Sick Leave Policy',
    content: 'Employees are entitled to 10 days of paid sick leave per year. For absences exceeding 3 consecutive days, a medical certificate from a registered doctor is required. Unused sick leave does not carry forward to the next year.',
    category: 'leave',
    keywords: ['sick', 'illness', 'medical', 'health', 'absent', 'doctor', 'certificate']
  },
  {
    title: 'Maternity and Paternity Leave',
    content: 'Female employees are entitled to 6 months of paid maternity leave. Male employees are entitled to 15 days of paid paternity leave. Additional unpaid leave may be negotiated with HR on case-by-case basis.',
    category: 'leave',
    keywords: ['maternity', 'paternity', 'pregnancy', 'baby', 'parent', 'mother', 'father']
  },
  {
    title: 'Working Hours and Remote Work',
    content: 'Standard working hours are 9 AM to 6 PM, Monday to Friday. Remote work is permitted on Tuesdays and Thursdays with manager approval. Employees are expected to maintain regular communication and attend all scheduled meetings.',
    category: 'work-hours',
    keywords: ['work', 'hours', 'remote', 'office', 'time', 'schedule', 'work from home', 'wfh']
  },
  {
    title: 'Health and Life Insurance',
    content: 'All employees and their immediate family members are covered under the company\'s health insurance plan. Coverage includes hospitalization, outpatient treatment, dental care, and vision care. Details are available from the HR department.',
    category: 'health',
    keywords: ['insurance', 'health', 'medical', 'coverage', 'benefits', 'family', 'dental', 'vision']
  },
  {
    title: 'Performance Review and Development',
    content: 'Annual performance reviews are conducted in December. Employees are evaluated on job performance, technical skills, teamwork, and professional development. Performance bonuses and salary increments are awarded based on review outcomes.',
    category: 'other',
    keywords: ['performance', 'review', 'evaluation', 'rating', 'assessment', 'bonus', 'salary', 'increment']
  },
  {
    title: 'Code of Conduct',
    content: 'All employees must adhere to the company code of conduct, which includes professional behavior, punctuality, confidentiality of company information, ethical business practices, and respectful treatment of colleagues and clients.',
    category: 'conduct',
    keywords: ['conduct', 'ethics', 'professional', 'behavior', 'policy', 'rules', 'confidentiality', 'ethical']
  },
  {
    title: 'Training and Professional Development',
    content: 'The company provides an annual training budget of $2,000 per employee for professional development, certifications, and skill enhancement. Employees are encouraged to pursue courses relevant to their job roles and career growth.',
    category: 'benefits',
    keywords: ['training', 'development', 'course', 'certificate', 'learning', 'budget', 'skill', 'professional']
  },
  {
    title: 'Flexible Working Arrangements',
    content: 'Flexible working hours can be approved by management on a case-by-case basis. Core hours of 10 AM to 4 PM must be maintained. Employees must coordinate with their teams to ensure business continuity and project deadlines are met.',
    category: 'work-hours',
    keywords: ['flexible', 'arrangement', 'hours', 'timing', 'work', 'schedule', 'core hours']
  },
  {
    title: 'Workplace Safety and Wellness',
    content: 'The company is committed to providing a safe and healthy work environment. Employees should report any safety concerns immediately to HR. The company provides wellness programs including gym memberships, health checkups, and mental health support.',
    category: 'health',
    keywords: ['safety', 'wellness', 'health', 'gym', 'mental', 'support', 'wellbeing', 'checkup']
  }
];

async function seedPolicies() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing policies
    await HRPolicy.deleteMany({});
    console.log('Cleared existing policies');

    // Insert new policies
    const result = await HRPolicy.insertMany(policies);
    console.log(`✓ Seeded ${result.length} HR policies successfully`);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding policies:', err);
    process.exit(1);
  }
}

seedPolicies();
