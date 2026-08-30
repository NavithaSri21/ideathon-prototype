import { CareerAnalysisResult, CareerProfileInput, LearningRoadmap, UserProfile } from '../types';

export const defaultStudentProfile: CareerProfileInput = {
  education: "Bachelor's Degree",
  degreeBranch: "Computer Science & Engineering",
  graduationYear: "2026",
  technicalSkills: ["React", "JavaScript", "HTML/CSS", "Git", "REST APIs", "Node.js (Basics)"],
  programmingLanguages: ["JavaScript", "Python", "TypeScript", "C++"],
  areasOfInterest: ["Full Stack Web Dev", "Artificial Intelligence", "Cloud Computing"],
  careerGoal: "Become a Full-Stack AI Engineer at a top product tech company",
  experienceLevel: "Intermediate",
  preferredWorkType: "Hybrid"
};

export const sampleAnalysisResult: CareerAnalysisResult = {
  id: "analysis-demo-001",
  timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
  inputProfile: defaultStudentProfile,
  jobReadinessScore: 74,
  currentLevel: "Developing",
  readinessLevel: "Developing",
  readinessSummary: "You have a solid foundational mastery of modern frontend development with React and JavaScript, complemented by Python and algorithmic fundamentals. To bridge the gap toward an industry-ready Full-Stack AI role, prioritize backend cloud architecture, scalable database design, and integrating modern LLM/vector pipelines.",
  scoreExplanation: {
    technicalProficiency: 76,
    marketAlignment: 82,
    portfolioReadiness: 68,
    domainBreadth: 71,
    industryDemandIndex: 88,
    majorFactorsSummary: "Your strong foundation in React and JavaScript gives you an immediate head start in frontend development, while Python equips you to quickly build AI/LLM tooling. Bridging cloud containerization and relational indexing will maximize your readiness.",
    keyStrengths: [
      "Solid grasp of core programming in JavaScript and Python",
      "Clear focus on modern Full-Stack AI career path",
      "Strong educational foundation in Computer Science & Engineering"
    ],
    keyImprovementsNeeded: [
      "Deploying live containerized applications to Google Cloud Run",
      "Deepening relational database schema design with PostgreSQL",
      "Algorithmic problem-solving practice for technical coding rounds"
    ]
  },
  readinessBreakdown: {
    technicalProficiency: 76,
    marketAlignment: 82,
    portfolioReadiness: 68,
    domainBreadth: 71,
    industryDemandIndex: 88
  },
  userExistingSkills: [
    "React", "JavaScript", "HTML/CSS", "Git", "REST APIs", "Node.js (Basics)", "Python", "TypeScript", "C++"
  ],
  skillGaps: [
    {
      skill: "Cloud Deployment & Docker Containerization",
      priority: "Critical",
      category: "Critical",
      whyNeeded: "Modern engineering teams expect candidates to containerize apps and deploy to platforms like Cloud Run or AWS without handholding.",
      recommendedWayToLearn: "Build multi-stage Dockerfiles and deploy sample Express/React applications to Google Cloud Run.",
      estimatedTimeToLearn: "1 - 2 weeks"
    },
    {
      skill: "Relational Database Design & SQL Indexing",
      priority: "Critical",
      category: "Critical",
      whyNeeded: "Moving beyond mock data requires configuring real schemas, foreign keys, migrations, and query optimization in PostgreSQL.",
      recommendedWayToLearn: "Practice PostgreSQL schema design, foreign key constraints, and query analysis with EXPLAIN ANALYZE.",
      estimatedTimeToLearn: "1 week"
    },
    {
      skill: "Production AI / LLM Integrations (RAG & GenAI SDK)",
      priority: "High Priority",
      category: "High Priority",
      whyNeeded: "Differentiates standard junior developers from sought-after AI Application engineers.",
      recommendedWayToLearn: "Build full-stack applications using the @google/genai SDK with gemini-3.7-flash and responseSchema.",
      estimatedTimeToLearn: "1 - 2 weeks"
    },
    {
      skill: "Automated Testing (Unit & Integration Tests)",
      priority: "Recommended",
      category: "Recommended",
      whyNeeded: "Vital for passing senior tech interviews and ensuring production stability.",
      recommendedWayToLearn: "Write unit and integration tests for API routes, achieving >80% code coverage.",
      estimatedTimeToLearn: "4 - 6 days"
    }
  ],
  recommendedTechnologies: [
    "TypeScript", "React 19", "Tailwind CSS", "Docker", "PostgreSQL", "Google Cloud Run", "Gemini API (@google/genai)", "Vitest"
  ],
  careerRecommendations: [
    {
      career: "Full-Stack AI Application Engineer",
      roleTitle: "Full-Stack AI Application Engineer",
      matchPercentage: 92,
      reason: "Your proficiency in React and JavaScript gives you an immediate head start in modern web development, while Python equips you to quickly build AI/LLM tooling.",
      whyFit: "Your proficiency in React and JavaScript gives you an immediate head start in modern web development, while Python equips you to quickly build AI/LLM tooling.",
      description: "Build end-to-end intelligent web applications combining modern React frontends, robust Node/Python microservices, and generative AI APIs with vector retrieval.",
      averageSalary: "$110,000 - $145,000 / yr",
      growthOutlook: "+34% over next 5 years (High Demand)",
      keyResponsibilities: [
        "Architect scalable web clients using React & Next.js",
        "Implement serverless APIs and LangChain/GenAI pipelines",
        "Integrate relational (PostgreSQL) and Vector (Pinecone/pgvector) databases",
        "Deploy containerized microservices to Google Cloud Run / AWS"
      ],
      requiredSkills: ["TypeScript", "React", "Node.js / Express", "PostgreSQL", "Docker", "Gemini API", "Git & CI/CD"],
      entryBarrier: "Moderate"
    },
    {
      career: "Frontend & UI Systems Engineer",
      roleTitle: "Frontend & UI Systems Engineer",
      matchPercentage: 86,
      reason: "Direct alignment with your existing React, TypeScript, and Git toolkit. Minimal barrier to junior entry.",
      whyFit: "Direct alignment with your existing React, TypeScript, and Git toolkit. Minimal barrier to junior entry.",
      description: "Specialize in creating ultra-responsive, accessible, high-performance web applications and design systems for data-dense and AI-driven platforms.",
      averageSalary: "$95,000 - $130,000 / yr",
      growthOutlook: "+21% steady demand",
      keyResponsibilities: [
        "Develop interactive component libraries with TypeScript & Tailwind",
        "Optimize Core Web Vitals and client-side rendering pipelines",
        "Collaborate with product designers to implement pixel-perfect user flows"
      ],
      requiredSkills: ["React", "TypeScript", "Tailwind CSS", "State Management", "Web Performance", "Accessibility"],
      entryBarrier: "Low"
    },
    {
      career: "Cloud Solutions & Backend Associate",
      roleTitle: "Cloud Solutions & Backend Associate",
      matchPercentage: 78,
      reason: "Your programming background in Python and C++ allows fast ramp-up into backend systems and concurrency.",
      whyFit: "Your programming background in Python and C++ allows fast ramp-up into backend systems and concurrency.",
      description: "Design and maintain high-throughput backend APIs, cloud infrastructure, serverless runtimes, and automated CI/CD deployment pipelines.",
      averageSalary: "$105,000 - $138,000 / yr",
      growthOutlook: "+28% high demand",
      keyResponsibilities: [
        "Build secure RESTful and GraphQL endpoints with Node.js/FastAPI",
        "Manage cloud deployments, Docker containers, and IAM policies",
        "Monitor system reliability, latency, and database indexing"
      ],
      requiredSkills: ["Docker", "Google Cloud Platform", "Kubernetes", "Linux Shell", "PostgreSQL", "Networking"],
      entryBarrier: "Moderate"
    }
  ],
  topCareerRecommendations: [
    {
      career: "Full-Stack AI Application Engineer",
      roleTitle: "Full-Stack AI Application Engineer",
      matchPercentage: 92,
      reason: "Your proficiency in React and JavaScript gives you an immediate head start in modern web development, while Python equips you to quickly build AI/LLM tooling.",
      whyFit: "Your proficiency in React and JavaScript gives you an immediate head start in modern web development, while Python equips you to quickly build AI/LLM tooling.",
      description: "Build end-to-end intelligent web applications combining modern React frontends, robust Node/Python microservices, and generative AI APIs with vector retrieval.",
      averageSalary: "$110,000 - $145,000 / yr",
      growthOutlook: "+34% over next 5 years (High Demand)",
      keyResponsibilities: [
        "Architect scalable web clients using React & Next.js",
        "Implement serverless APIs and LangChain/GenAI pipelines",
        "Integrate relational (PostgreSQL) and Vector (Pinecone/pgvector) databases",
        "Deploy containerized microservices to Google Cloud Run / AWS"
      ],
      requiredSkills: ["TypeScript", "React", "Node.js / Express", "PostgreSQL", "Docker", "Gemini API", "Git & CI/CD"],
      entryBarrier: "Moderate"
    },
    {
      career: "Frontend & UI Systems Engineer",
      roleTitle: "Frontend & UI Systems Engineer",
      matchPercentage: 86,
      reason: "Direct alignment with your existing React, TypeScript, and Git toolkit. Minimal barrier to junior entry.",
      whyFit: "Direct alignment with your existing React, TypeScript, and Git toolkit. Minimal barrier to junior entry.",
      description: "Specialize in creating ultra-responsive, accessible, high-performance web applications and design systems for data-dense and AI-driven platforms.",
      averageSalary: "$95,000 - $130,000 / yr",
      growthOutlook: "+21% steady demand",
      keyResponsibilities: [
        "Develop interactive component libraries with TypeScript & Tailwind",
        "Optimize Core Web Vitals and client-side rendering pipelines",
        "Collaborate with product designers to implement pixel-perfect user flows"
      ],
      requiredSkills: ["React", "TypeScript", "Tailwind CSS", "State Management", "Web Performance", "Accessibility"],
      entryBarrier: "Low"
    },
    {
      career: "Cloud Solutions & Backend Associate",
      roleTitle: "Cloud Solutions & Backend Associate",
      matchPercentage: 78,
      reason: "Your programming background in Python and C++ allows fast ramp-up into backend systems and concurrency.",
      whyFit: "Your programming background in Python and C++ allows fast ramp-up into backend systems and concurrency.",
      description: "Design and maintain high-throughput backend APIs, cloud infrastructure, serverless runtimes, and automated CI/CD deployment pipelines.",
      averageSalary: "$105,000 - $138,000 / yr",
      growthOutlook: "+28% high demand",
      keyResponsibilities: [
        "Build secure RESTful and GraphQL endpoints with Node.js/FastAPI",
        "Manage cloud deployments, Docker containers, and IAM policies",
        "Monitor system reliability, latency, and database indexing"
      ],
      requiredSkills: ["Docker", "Google Cloud Platform", "Kubernetes", "Linux Shell", "PostgreSQL", "Networking"],
      entryBarrier: "Moderate"
    }
  ],
  requiredSkills: {
    coreTechnical: [
      "TypeScript (Strict Mode)",
      "Node.js & Express / FastAPI",
      "PostgreSQL & ORM (Prisma/Drizzle)",
      "Docker & Cloud Deployment",
      "RESTful API & WebSocket Architecture"
    ],
    toolsAndFrameworks: [
      "Next.js / Vite",
      "Tailwind CSS",
      "Google Cloud Run / AWS ECS",
      "Git & GitHub Actions CI/CD",
      "Gemini AI SDK / OpenAI API"
    ],
    softAndDomainSkills: [
      "System Design & Decomposition",
      "Technical Documentation",
      "Agile Sprint Planning",
      "Code Review & Testing (Jest/Vitest)"
    ]
  },
  personalizedRecommendations: {
    actionableAdvice: [
      "Build one comprehensive full-stack flagship project that solves a real student or developer problem, deploying it live with a custom domain.",
      "Transition all JavaScript codebases to strict TypeScript to mirror real-world engineering standards.",
      "Contribute to open-source or showcase active Git commit streaks highlighting structured PRs.",
      "Practice 2-3 LeetCode medium algorithmic problems weekly focusing on Hash Tables, Trees, and Dynamic Programming."
    ],
    recommendedProjects: [
      {
        title: "AI-Powered Research Paper & Note Synthesizer",
        description: "A full-stack web application where students upload PDFs to generate interactive semantic flashcards, AI audio summaries, and vector-grounded Q&A.",
        techStack: ["React", "TypeScript", "Node.js", "Gemini API", "PostgreSQL", "Tailwind CSS"],
        difficulty: "Intermediate",
        outcome: "Demonstrates full-stack fluency, GenAI SDK mastery, and database modeling."
      },
      {
        title: "Real-Time Collaborative Code Review Workspace",
        description: "A multiplayer browser workspace where students can paste snippets, conduct AI linting reviews, and discuss improvements via WebSockets.",
        techStack: ["TypeScript", "Express", "WebSocket", "Docker", "Cloud Run"],
        difficulty: "Intermediate",
        outcome: "Proves real-time networking, Docker containerization, and clean architectural design."
      }
    ],
    certifications: [
      "Google Cloud Associate Cloud Engineer (ACE)",
      "Meta Front-End or Back-End Developer Professional Certificate",
      "AWS Certified Solutions Architect – Associate"
    ],
    resumeTips: [
      "Quantify your bullet points: e.g. 'Improved client load time by 38% using Vite lazy-loading' instead of 'Made the site faster'.",
      "Include clickable live demo URLs and clean GitHub repositories with documented READMEs for every project.",
      "Group skills into distinct categories (Languages, Frameworks, Cloud & Databases, Developer Tools)."
    ],
    interviewPrepFocus: [
      "React Hooks lifecycle, state memoization (useMemo/useCallback), and custom hooks.",
      "Database schema normalization, ACID properties, and REST vs GraphQL tradeoffs.",
      "Behavioral STAR method responses highlighting team problem-solving and handling blockers."
    ]
  }
};

const default30Days = Array.from({ length: 30 }, (_, idx) => {
  const dayNum = idx + 1;
  return {
    day: dayNum,
    topic: `Day ${dayNum} Core Mastery`,
    objective: `Master Day ${dayNum} technical milestone and best practices`,
    activity: `Hands-on coding exercises and implementation tasks for Day ${dayNum}`,
    estimatedMinutes: 120,
    checkpoint: `Complete Day ${dayNum} code review and test suite.`,
    resources: [{ name: "Official Documentation", type: "documentation" as const, urlOrQuery: "https://developer.mozilla.org" }]
  };
});

export const sampleRoadmap: LearningRoadmap = {
  id: "roadmap-demo-001",
  targetRole: "Full-Stack AI Application Engineer",
  createdAt: new Date().toISOString(),
  summary: "A rigorous 30-day intensive curriculum designed to elevate you from intermediate frontend developer to an industry-ready Full-Stack AI Engineer with a live flagship project.",
  totalHours: 90,
  completedDayNumbers: [1, 2, 3, 4],
  progressPercent: 13,
  roadmap: default30Days,
  weeklyPhases: [
    {
      week: 1,
      phaseTitle: "Week 1: TypeScript & Modern Backend Architecture",
      phaseGoal: "Master strict TypeScript, Express backend REST APIs, and relational database modeling with PostgreSQL.",
      focusArea: "Backend & Type Safety",
      milestoneProject: {
        title: "Secure RESTful Task & Document API",
        description: "A hardened backend server with JWT authentication, validation middleware, and relational schema migrations.",
        deliverable: "GitHub repo with documented Swagger/Postman specs and unit test suite."
      },
      days: default30Days.slice(0, 7).map(d => ({
        ...d,
        title: d.topic,
        description: d.activity,
        hoursEstimated: 2,
        keyTopics: [d.topic, "Core Implementation"],
        checkpoint: d.checkpoint,
        completed: d.day <= 4
      }))
    },
    {
      week: 2,
      phaseTitle: "Week 2: Advanced React, Optimistic UI & WebSockets",
      phaseGoal: "Construct stateful reactive interfaces, manage client caches, and implement real-time event streaming.",
      focusArea: "Frontend & Reactive Architecture",
      milestoneProject: {
        title: "Interactive Collaborative Dashboard",
        description: "Real-time client application with optimistic UI updates, drag-and-drop, and WebSocket synchronization.",
        deliverable: "Tested client application with Lighthouse performance score >95."
      },
      days: default30Days.slice(7, 14).map(d => ({
        ...d,
        title: d.topic,
        description: d.activity,
        hoursEstimated: 2,
        keyTopics: [d.topic, "Core Implementation"],
        checkpoint: d.checkpoint,
        completed: false
      }))
    },
    {
      week: 3,
      phaseTitle: "Week 3: Generative AI, Vector Retrieval & Cloud Run",
      phaseGoal: "Incorporate Gemini AI SDK, build multi-stage Docker containers, and deploy full-stack apps to Google Cloud Run.",
      focusArea: "AI Engineering & Cloud Infrastructure",
      milestoneProject: {
        title: "Live Containerized Flagship AI Platform",
        description: "Deploy your full-stack AI web application to a live Google Cloud Run URL with automated builds.",
        deliverable: "Live hosted web application URL accessible to recruiters."
      },
      days: default30Days.slice(14, 21).map(d => ({
        ...d,
        title: d.topic,
        description: d.activity,
        hoursEstimated: 2,
        keyTopics: [d.topic, "Core Implementation"],
        checkpoint: d.checkpoint,
        completed: false
      }))
    },
    {
      week: 4,
      phaseTitle: "Week 4: Portfolio Polish, System Design & Interview Mastery",
      phaseGoal: "Package your GitHub portfolio, master high-frequency coding patterns, and prepare technical interviews.",
      focusArea: "Career Strategy & Technical Interviews",
      milestoneProject: {
        title: "Developer Portfolio & Tech Interview Dossier",
        description: "A polished portfolio site featuring case study breakdowns, system diagrams, and resume.",
        deliverable: "Completed resume, GitHub portfolio, and 5 submitted tailored job applications."
      },
      days: default30Days.slice(21, 30).map(d => ({
        ...d,
        title: d.topic,
        description: d.activity,
        hoursEstimated: 2,
        keyTopics: [d.topic, "Core Implementation"],
        checkpoint: d.checkpoint,
        completed: false
      }))
    }
  ]
};

export const sampleUser: UserProfile = {
  uid: "usr_student_demo_01",
  name: "Alex Rivera",
  email: "alex.rivera@university.edu",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  institution: "Computer Science Dept., Stanford University",
  isDemoUser: true
};
