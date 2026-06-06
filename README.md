# SmartHRMS
A next-generation AI-powered HRMS that automates resume screening, interview analysis, onboarding, team allocation, and HR policy Q&A.

## Features
## AI-Powered Modules
FeatureWhat it doesBulk Resume ScreeningUpload up to 10 PDFs → AI ranks candidates by technical score, communication score, skill match, and hire recommendation in under 30 secondsAI Interview AnalysisPaste interview transcript → AI scores clarity, confidence, relevance, communication → verdict: Strong Hire / Hire / Maybe / No HireAI Onboarding GeneratorSelect employee → AI generates personalised 4-week onboarding plan with tasks, resources, and milestonesHR Policy Chatbot (RAG)Employees ask HR questions in plain English → AI retrieves relevant company policies and answers accurately
## HR & Admin Modules
FeatureWhat it doesMulti-Role AuthenticationAdmin, Senior Manager, HR Recruiter, Employee — each with protected routes and personalised dashboardsRole ManagementAdmins assign/change employee roles with a single click — promoted employees instantly see the Manager dashboardTeam AllocationAdmins create teams, assign a manager, and allocate employees — managers see their exact team on their dashboardEmployee ManagementFull CRUD — add, edit, soft-delete employees with auto-generated IDs (EMP001, EMP002...)Attendance TrackingOne-click check-in/check-out, monthly calendar view, admin attendance reportsPayroll GenerationAuto-generate monthly payroll for all active employees, downloadable payslipsPerformance ReviewsQuarterly ratings across 5 dimensions with radar charts and team comparisonPersonalised DashboardsEach role sees only their relevant data — no information leakage across roles

## System Architecture
┌─────────────────────────────────────────────────────────────┐
│                     React 18 Frontend                        │
│         Role-based routing · Axios · Recharts · Tailwind     │
└──────────────────────────┬──────────────────────────────────┘
                           │  JWT-authenticated REST API
┌──────────────────────────▼──────────────────────────────────┐
│                   Node.js + Express                          │
│                                                              │
│   /auth  /employees  /attendance  /payroll  /performance     │
│   /resume  /interview  /onboarding  /analytics               │
│   /roles  /teams  /policies  /chatbot                        │
│                                                              │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│   │JWT Auth  │  │  Multer  │  │pdf-parse │  │  OpenAI   │  │
│   │Middleware│  │ Uploads  │  │ Extract  │  │  gpt-4o   │  │
│   └──────────┘  └──────────┘  └──────────┘  └─────┬─────┘  │
└────────────────────────────────────────────────────┼────────┘
                           │                         │
          ┌────────────────▼──────┐     ┌────────────▼──────────┐
          │     MongoDB Atlas     │     │     OpenAI API         │
          │                       │     │                        │
          │  Users · Employees    │     │  Resume screening      │
          │  Attendance · Payroll │     │  Interview analysis    │
          │  Candidates           │     │  Onboarding plans      │
          │  Interviews           │     │  Policy Q&A (RAG)      │
          │  Onboarding           │     │  Question generation   │
          │  Performance          │     └────────────────────────┘
          │  Teams · Policies     │
          └───────────────────────┘
## Getting Started
Prerequisites

Node.js 18+
MongoDB Atlas free account → cloud.mongodb.com
OpenAI API key → platform.openai.com

1. Clone & Install
bashgit clone https://github.com/Vandana1603/smarthr.git
cd smarthr

# Server
cd server && npm install

# Client
cd ../client && npm install

2. Configure Environment
server/.env
envPORT=5000
MONGODB_URI=mongodb+srv://your_user:your_pass@cluster.mongodb.net/smarthr
JWT_SECRET=your_minimum_32_character_secret_key_here
OPENAI_API_KEY=sk-your-openai-api-key
FRONTEND_URL=http://localhost:5173

client/.env
envVITE_API_URL=http://localhost:5000

4. Seed & Run
# Terminal 1 — seed database and start backend
cd server
node seedUsers.js      # creates 4 demo users
node server.js         # starts on port 5000

# Terminal 2 — start frontend
cd client
npm run dev            # starts on port 5173




-[VANDANA K]
