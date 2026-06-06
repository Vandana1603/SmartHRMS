const Onboarding = require('../models/Onboarding');
const Employee = require('../models/Employee');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateOnboardingPlanOffline = (department, designation, skills) => {
  const dept = (department || 'Engineering').toLowerCase();
  
  const engineeringPlan = [
    {
      week: 1,
      title: "Introduction & Local Dev Setup",
      tasks: [
        "Complete HR paperwork and orientation",
        "Set up local development environment and IDE configuration",
        "Clone the primary repositories and run backend/frontend services locally",
        "Read codebase architecture documentation and design patterns wiki",
        "Introduce to engineering team members and attend first daily standup"
      ],
      resources: [
        "Engineering Wiki Guide",
        "Local Setup README",
        "Design System Docs"
      ],
      milestone: "Local development environment successfully running."
    },
    {
      week: 2,
      title: "Core Architecture & Minor Bug Fixes",
      tasks: [
        "Shadow a senior engineer on codebase walkthroughs",
        "Identify and fix a minor starter bug in the frontend or backend",
        "Learn core database schemas, Mongoose models, and API routing schemas",
        "Read internal guidelines for Git branches, PR code reviews, and releases",
        "Participate in sprint planning and grooming sessions"
      ],
      resources: [
        "Git Flow Guidelines",
        "API Specs Swagger",
        "Database Architecture Map"
      ],
      milestone: "First pull request successfully reviewed and merged."
    },
    {
      week: 3,
      title: "First Major Task & Feature Development",
      tasks: [
        "Take ownership of a standard feature task in the sprint backlog",
        "Design the technical implementation and review with the tech lead",
        "Write clean React components or Express API handlers for the feature",
        "Add unit and integration tests to cover new code paths",
        "Engage in pair programming sessions with team members"
      ],
      resources: [
        "Testing Best Practices",
        "Component Library Reference",
        "API Security Checklist"
      ],
      milestone: "Completed first full feature and sent to QA."
    },
    {
      week: 4,
      title: "Independence & Production Deployment",
      tasks: [
        "Deploy the completed feature to the staging environment",
        "Collaborate with QA to verify functionality and resolve edge-cases",
        "Participate in the deployment process to the production cluster",
        "Lead a standup session or demo the feature in the sprint review",
        "Collect onboarding experience feedback and set goals for next month"
      ],
      resources: [
        "Deployment Pipeline Docs",
        "Monitoring/Logging Dashboards",
        "Performance Tuning Guide"
      ],
      milestone: "Independent task execution and successful production release."
    }
  ];

  const hrPlan = [
    {
      week: 1,
      title: "HR Orientation & Company Overview",
      tasks: [
        "Complete company onboarding paperwork and profile setup",
        "Receive systems access (HRMS, Email, Slack, Applicant Tracking System)",
        "Review company handbook, core values, and HR organizational structure",
        "Meet with HR Director to align on immediate recruitment objectives",
        "Shadow a recruiter on introductory candidate calls"
      ],
      resources: [
        "Company Handbook",
        "HR Team Directory",
        "HRMS Training Video"
      ],
      milestone: "Orientation complete and systems fully configured."
    },
    {
      week: 2,
      title: "Recruitment Systems & Active Sourcing",
      tasks: [
        "Undergo training on the applicant tracking system (ATS) workflow",
        "Review current active open job requisitions and candidates",
        "Sourcing and shortlisting candidates for current technical openings",
        "Conduct first phone screening interview with candidate",
        "Attend weekly HR recruitment sync and report status"
      ],
      resources: [
        "ATS User Guide",
        "Candidate Sourcing Manual",
        "Phone Screen Templates"
      ],
      milestone: "Successfully conducted first candidate screening."
    },
    {
      week: 3,
      title: "Interview Scheduling & Talent Pool Management",
      tasks: [
        "Schedule panel interviews coordinating managers and candidates",
        "Update candidates' status in ATS and handle correspondence",
        "Draft and send initial job offers following hiring managers' approval",
        "Populate and organize candidate database pipelines for future roles",
        "Review and update standard interviewer scoring rubrics"
      ],
      resources: [
        "Scheduling Guidelines",
        "Job Offer Templates",
        "Scoring Rubric Sheets"
      ],
      milestone: "Managed panel interview scheduling end-to-end."
    },
    {
      week: 4,
      title: "Onboarding Coordination & Process Improvement",
      tasks: [
        "Coordinate onboarding schedule for newly hired candidates",
        "Draft and distribute onboarding materials and instructions",
        "Review current recruiting processes and identify efficiency gaps",
        "Collate candidate feedback about interview experiences",
        "Set recruit performance goals for the next quarter"
      ],
      resources: [
        "Onboarding Playbook",
        "Feedback Survey Docs",
        "Performance Planning Sheet"
      ],
      milestone: "Coordinated first new hire onboarding journey."
    }
  ];

  const generalPlan = [
    {
      week: 1,
      title: "Company Induction & System Setup",
      tasks: [
        "Complete HR paperwork and onboarding profiles",
        "Set up work machine, emails, calendars, and communications",
        "Attend HR orientation session and review culture documentation",
        "Schedule introductory 1-on-1s with cross-functional team members",
        "Familiarize with the team structure, weekly cadence, and responsibilities"
      ],
      resources: [
        "New Hire Toolkit",
        "Team Cadence Guide",
        "Systems Guidebook"
      ],
      milestone: "Induction completed and equipment configured."
    },
    {
      week: 2,
      title: "Systems Operations & Process Walkthrough",
      tasks: [
        "Review tool documentation and complete introductory tasks",
        "Observe team members executing standard operational procedures",
        "Engage in a practical shadow session for basic departmental workflows",
        "Understand target deliverables, metrics, and key performance indicators",
        "Participate in active team standups and project syncs"
      ],
      resources: [
        "Process Documentation",
        "KPI Dashboard Specs",
        "Tool Integration Guide"
      ],
      milestone: "Basic operational procedures fully understood."
    },
    {
      week: 3,
      title: "Initial Tasks & Supervised Projects",
      tasks: [
        "Execute first independent task under mentor supervision",
        "Identify process improvement opportunities in daily routines",
        "Document step-by-step resolution steps for task completion",
        "Collect constructive feedback from supervisor on initial output",
        "Contribute to weekly project reporting spreadsheets"
      ],
      resources: [
        "Best Practices Checklist",
        "Standard Templates",
        "Reporting Procedures"
      ],
      milestone: "Completed first assignment with minor supervision."
    },
    {
      week: 4,
      title: "Independence & Goal Alignment",
      tasks: [
        "Coordinate and complete full standard operational workflow independently",
        "Present project progress in departmental review meetings",
        "Set professional growth milestones and performance metrics",
        "Participate in the onboarding satisfaction feedback survey",
        "Establish key focus areas for the upcoming review cycles"
      ],
      resources: [
        "Performance Alignment Docs",
        "Department Roadmap",
        "Onboarding Feedback Link"
      ],
      milestone: "Full independent task execution and alignment."
    }
  ];

  if (dept.includes('eng') || dept.includes('dev') || dept.includes('tech') || dept.includes('soft')) {
    return engineeringPlan;
  } else if (dept.includes('hr') || dept.includes('recruit') || dept.includes('people')) {
    return hrPlan;
  } else {
    return generalPlan;
  }
};

exports.generatePlan = async (req, res) => {
  try {
    const { employeeId, department, designation, skills } = req.body;
    
    let planData;
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Create a 4-week onboarding plan. Return ONLY a valid JSON array:\n  [{\"week\":1,\"title\":\"string\",\"tasks\":[5 strings],\"resources\":[3 strings],\"milestone\":\"string\"}]\n  Exactly 4 objects."
          },
          {
            role: "user",
            content: `Department: ${department}\nDesignation: ${designation}\nBackground Skills: ${skills?.join(', ') || 'None'}\nGenerate a specific 4-week onboarding plan.`
          }
        ]
      });

      const aiResponse = completion.choices[0].message.content;
      planData = JSON.parse(aiResponse);
    } catch (err) {
      console.warn("OpenAI API error, falling back to local onboarding plan generation:", err.message);
      planData = generateOnboardingPlanOffline(department, designation, skills);
    }

    const plan = planData.map((week, idx) => ({
      taskId: `task_wk_${idx + 1}`,
      ...week
    }));

    const progress = plan.map(p => ({
      taskId: p.taskId,
      completed: false
    }));

    const onboarding = await Onboarding.create({
      employeeId,
      department,
      designation,
      plan,
      progress,
      status: 'in-progress'
    });

    res.status(201).json(onboarding);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const { id, taskId } = req.params;
    const onboarding = await Onboarding.findById(id);
    if (!onboarding) return res.status(404).json({ message: 'Onboarding not found' });

    let completedTasks = 0;
    onboarding.progress.forEach(p => {
      if (p.taskId === taskId) {
        p.completed = true;
        p.completedAt = new Date();
      }
      if (p.completed) completedTasks++;
    });

    onboarding.overallProgress = Math.round((completedTasks / onboarding.progress.length) * 100);
    if (onboarding.overallProgress === 100) {
      onboarding.status = 'completed';
    }

    await onboarding.save();
    res.json(onboarding);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeeOnboarding = async (req, res) => {
  try {
    const onboarding = await Onboarding.findOne({ employeeId: req.params.employeeId }).sort({ createdAt: -1 });
    if (!onboarding) return res.status(404).json({ message: 'Onboarding not found' });
    res.json(onboarding);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOnboarding = async (req, res) => {
  try {
    const onboardings = await Onboarding.find().populate('employeeId', 'name designation');
    res.json(onboardings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
