import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Google GenAI
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
  });
});

function deepSanitize<T>(data: T): T {
  if (typeof data === "string") {
    return data
      .replace(/\\n/g, " ")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim() as unknown as T;
  }
  if (Array.isArray(data)) {
    return data.map((item) => deepSanitize(item)) as unknown as T;
  }
  if (data !== null && typeof data === "object") {
    const result: any = {};
    for (const key of Object.keys(data)) {
      result[key] = deepSanitize((data as any)[key]);
    }
    return result as T;
  }
  return data;
}

// Career Analysis Endpoint
app.post("/api/analyze-career", async (req: Request, res: Response) => {
  try {
    const profile = req.body;
    const ai = getGenAI();

    if (!profile || !profile.education || !profile.degreeBranch) {
      res.status(400).json({ error: "Missing required profile fields: education and degree/branch are required" });
      return;
    }

    if (!ai) {
      console.log("No GEMINI_API_KEY configured in environment, computing dynamic career analysis fallback");
      const fallbackAnalysis = generateFallbackCareerAnalysis(profile);
      res.json(deepSanitize(fallbackAnalysis));
      return;
    }

    const techSkillsStr = Array.isArray(profile.technicalSkills) ? profile.technicalSkills.join(", ") : (profile.technicalSkills || "Not specified");
    const progLangsStr = Array.isArray(profile.programmingLanguages) ? profile.programmingLanguages.join(", ") : (profile.programmingLanguages || "Not specified");
    const areasOfInterestStr = Array.isArray(profile.areasOfInterest) ? profile.areasOfInterest.join(", ") : (profile.areasOfInterest || "Software Engineering");
    const careerGoalStr = profile.careerGoal || "Software Engineer";
    const expLevelStr = profile.experienceLevel || "Intermediate";
    const gradYearStr = profile.graduationYear || "2026";

    const prompt = `You are CareerPilot AI, an elite AI career advisor, technical recruiter, and senior engineering hiring strategist.
Analyze this student and early-career candidate profile thoroughly:
- Education: ${profile.education}
- Degree / Branch / Major: ${profile.degreeBranch}
- Graduation Year: ${gradYearStr}
- Technical Skills: ${techSkillsStr}
- Programming Languages: ${progLangsStr}
- Areas of Interest: ${areasOfInterestStr}
- Career Goal: ${careerGoalStr}
- Experience Level: ${expLevelStr}

Evaluate the profile with realistic industry benchmarks:
1. Calculate a realistic Job Readiness Score from 0 to 100 based on their actual background, skills, and current market requirements.
2. Explain the major factors affecting the score (technical proficiency, market alignment, portfolio readiness, domain breadth, industry demand).
3. Identify existing verified user skills vs clear skill gaps that they must learn, with priority (Critical, High Priority, Recommended) and the best recommended way to learn each skill.
4. Provide top career recommendations matching their trajectory, with career title, match percentage (0-100), detailed reason/why fit, and list of required skills.
5. Provide recommended technologies, current level, and actionable personalized recommendations (actionable advice, flagship portfolio projects, certifications, resume tips, interview prep).

Return strictly JSON adhering to the schema without any markdown formatting or escaped newlines.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are CareerPilot AI, a career advisor and technical mentor. Always output strictly valid JSON matching the exact schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            jobReadinessScore: {
              type: Type.INTEGER,
              description: "Overall career readiness score from 0 to 100",
            },
            currentLevel: {
              type: Type.STRING,
              description: "Candidate level: Beginner, Developing, Intermediate, or Career Ready",
            },
            readinessLevel: {
              type: Type.STRING,
              description: "One of: Starting Out, Developing, Career Ready, Industry Leader",
            },
            readinessSummary: {
              type: Type.STRING,
              description: "Comprehensive 2-3 sentence assessment of their strengths and growth trajectory",
            },
            scoreExplanation: {
              type: Type.OBJECT,
              properties: {
                technicalProficiency: { type: Type.INTEGER, description: "0-100" },
                marketAlignment: { type: Type.INTEGER, description: "0-100" },
                portfolioReadiness: { type: Type.INTEGER, description: "0-100" },
                domainBreadth: { type: Type.INTEGER, description: "0-100" },
                industryDemandIndex: { type: Type.INTEGER, description: "0-100" },
                majorFactorsSummary: { type: Type.STRING, description: "Detailed explanation of key factors driving this score" },
                keyStrengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                keyImprovementsNeeded: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                "technicalProficiency",
                "marketAlignment",
                "portfolioReadiness",
                "domainBreadth",
                "industryDemandIndex",
                "majorFactorsSummary",
                "keyStrengths",
                "keyImprovementsNeeded",
              ],
            },
            readinessBreakdown: {
              type: Type.OBJECT,
              properties: {
                technicalProficiency: { type: Type.INTEGER },
                marketAlignment: { type: Type.INTEGER },
                portfolioReadiness: { type: Type.INTEGER },
                domainBreadth: { type: Type.INTEGER },
                industryDemandIndex: { type: Type.INTEGER },
              },
              required: [
                "technicalProficiency",
                "marketAlignment",
                "portfolioReadiness",
                "domainBreadth",
                "industryDemandIndex",
              ],
            },
            userExistingSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of skills the user already has based on their input",
            },
            skillGaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  priority: { type: Type.STRING, description: "Critical, High Priority, or Recommended" },
                  category: { type: Type.STRING },
                  whyNeeded: { type: Type.STRING },
                  recommendedWayToLearn: { type: Type.STRING, description: "Best recommended tutorials, documentation, and projects to learn this" },
                  estimatedTimeToLearn: { type: Type.STRING },
                },
                required: ["skill", "priority", "whyNeeded", "recommendedWayToLearn", "estimatedTimeToLearn"],
              },
            },
            recommendedTechnologies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Recommended libraries, tools, and platforms to adopt",
            },
            careerRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  career: { type: Type.STRING },
                  roleTitle: { type: Type.STRING },
                  matchPercentage: { type: Type.INTEGER },
                  reason: { type: Type.STRING },
                  whyFit: { type: Type.STRING },
                  description: { type: Type.STRING },
                  averageSalary: { type: Type.STRING },
                  growthOutlook: { type: Type.STRING },
                  keyResponsibilities: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  requiredSkills: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  entryBarrier: { type: Type.STRING, description: "Low, Moderate, or High" },
                },
                required: [
                  "career",
                  "matchPercentage",
                  "reason",
                  "requiredSkills",
                ],
              },
            },
            topCareerRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  career: { type: Type.STRING },
                  roleTitle: { type: Type.STRING },
                  matchPercentage: { type: Type.INTEGER },
                  reason: { type: Type.STRING },
                  whyFit: { type: Type.STRING },
                  description: { type: Type.STRING },
                  averageSalary: { type: Type.STRING },
                  growthOutlook: { type: Type.STRING },
                  keyResponsibilities: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  requiredSkills: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  entryBarrier: { type: Type.STRING },
                },
                required: ["career", "matchPercentage", "reason", "requiredSkills"],
              },
            },
            requiredSkills: {
              type: Type.OBJECT,
              properties: {
                coreTechnical: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                toolsAndFrameworks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                softAndDomainSkills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["coreTechnical", "toolsAndFrameworks", "softAndDomainSkills"],
            },
            personalizedRecommendations: {
              type: Type.OBJECT,
              properties: {
                actionableAdvice: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                recommendedProjects: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      techStack: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      difficulty: { type: Type.STRING },
                      outcome: { type: Type.STRING },
                    },
                    required: ["title", "description", "techStack", "difficulty", "outcome"],
                  },
                },
                certifications: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                resumeTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                interviewPrepFocus: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                "actionableAdvice",
                "recommendedProjects",
                "certifications",
                "resumeTips",
                "interviewPrepFocus",
              ],
            },
          },
          required: [
            "jobReadinessScore",
            "currentLevel",
            "readinessSummary",
            "scoreExplanation",
            "userExistingSkills",
            "skillGaps",
            "recommendedTechnologies",
            "careerRecommendations",
            "requiredSkills",
            "personalizedRecommendations",
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response received from Gemini model");
    }

    const parsed = JSON.parse(text);

    // Normalize topCareerRecommendations vs careerRecommendations
    const careerRecs = (parsed.careerRecommendations || parsed.topCareerRecommendations || []).map((c: any) => ({
      ...c,
      career: c.career || c.roleTitle || "Software Engineer",
      roleTitle: c.roleTitle || c.career || "Software Engineer",
      reason: c.reason || c.whyFit || "High skill synergy with your background.",
      whyFit: c.whyFit || c.reason || "High skill synergy with your background.",
      description: c.description || `Deliver end-to-end applications in ${c.career || c.roleTitle}.`,
      averageSalary: c.averageSalary || "$105,000 - $140,000 / yr",
      growthOutlook: c.growthOutlook || "+25% steady demand",
      keyResponsibilities: c.keyResponsibilities || ["Build and maintain reliable code", "Participate in agile sprints", "Collaborate on architecture"],
      entryBarrier: c.entryBarrier || "Moderate",
    }));

    const result = {
      id: "analysis-" + Date.now(),
      timestamp: new Date().toISOString(),
      inputProfile: profile,
      ...parsed,
      careerRecommendations: careerRecs,
      topCareerRecommendations: careerRecs,
      readinessLevel: parsed.readinessLevel || (parsed.jobReadinessScore >= 80 ? "Career Ready" : parsed.jobReadinessScore >= 65 ? "Developing" : "Starting Out"),
      readinessBreakdown: parsed.readinessBreakdown || parsed.scoreExplanation || {
        technicalProficiency: Math.min(95, parsed.jobReadinessScore + 3),
        marketAlignment: Math.min(95, parsed.jobReadinessScore + 5),
        portfolioReadiness: Math.max(40, parsed.jobReadinessScore - 10),
        domainBreadth: Math.min(90, parsed.jobReadinessScore - 2),
        industryDemandIndex: 88,
      },
    };

    res.json(deepSanitize(result));
  } catch (error: any) {
    console.error("Gemini Career Analysis Error:", error);
    const fallback = generateFallbackCareerAnalysis(req.body);
    res.json(deepSanitize(fallback));
  }
});

// 30-Day Personalized Roadmap Endpoint
app.post("/api/generate-roadmap", async (req: Request, res: Response) => {
  try {
    const { profile, targetRole } = req.body;
    const ai = getGenAI();

    if (!profile) {
      res.status(400).json({ error: "Profile information is required to generate a roadmap" });
      return;
    }

    const selectedRole = targetRole || profile.careerGoal || "Full-Stack AI Application Engineer";

    if (!ai) {
      console.log("No GEMINI_API_KEY found, generating fallback 30-day curriculum");
      const fallbackRoadmap = generateFallbackRoadmap(profile, selectedRole);
      res.json(deepSanitize(fallbackRoadmap));
      return;
    }

    const techSkillsStr = Array.isArray(profile.technicalSkills) ? profile.technicalSkills.join(", ") : (profile.technicalSkills || "Web Development");
    const progLangsStr = Array.isArray(profile.programmingLanguages) ? profile.programmingLanguages.join(", ") : (profile.programmingLanguages || "JavaScript");

    const prompt = `You are CareerPilot AI, an elite technical mentor.
Generate an intensive, practical, day-by-day 30-day curriculum for a candidate targeting the role: "${selectedRole}".

Candidate Profile:
- Education: ${profile.education} (${profile.degreeBranch})
- Current Skills: ${techSkillsStr}
- Languages: ${progLangsStr}
- Experience Level: ${profile.experienceLevel}
- Areas of Interest: ${Array.isArray(profile.areasOfInterest) ? profile.areasOfInterest.join(", ") : profile.areasOfInterest}

REQUIREMENTS:
1. Generate EXACTLY 30 days (Day 1 through Day 30).
2. For each day, provide:
   - day (1 to 30)
   - topic (short, punchy title)
   - objective (clear learning outcome)
   - activity (hands-on coding or study task)
   - estimatedMinutes (e.g. 60, 90, 120, or 180)
   - checkpoint (a verifiable action proving completion)
   - resources (list of articles, docs, or tutorials)
3. Also group these 30 days into 4 weekly phases:
   - Week 1 (Days 1-7): Core Foundations & Strict Architecture
   - Week 2 (Days 8-14): Advanced Implementation & Full-Stack Integration
   - Week 3 (Days 15-21): Cloud Deployment, AI SDK & Flagship Project
   - Week 4 (Days 22-30): Portfolio Polish, System Design & Interview Mastery
   Each week must have a milestone project with a tangible deliverable.

Return strictly valid JSON conforming to the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are CareerPilot AI. Generate a rigorous 30-day engineering learning curriculum with exactly 30 days and 4 weekly milestone phases in valid JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetRole: { type: Type.STRING },
            summary: { type: Type.STRING },
            totalHours: { type: Type.INTEGER },
            roadmap: {
              type: Type.ARRAY,
              description: "Array of exactly 30 days",
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  topic: { type: Type.STRING },
                  objective: { type: Type.STRING },
                  activity: { type: Type.STRING },
                  estimatedMinutes: { type: Type.INTEGER },
                  checkpoint: { type: Type.STRING },
                  resources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        type: { type: Type.STRING },
                        urlOrQuery: { type: Type.STRING },
                      },
                      required: ["name", "type", "urlOrQuery"],
                    },
                  },
                },
                required: ["day", "topic", "objective", "activity", "estimatedMinutes", "checkpoint"],
              },
            },
            weeklyPhases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  week: { type: Type.INTEGER },
                  phaseTitle: { type: Type.STRING },
                  phaseGoal: { type: Type.STRING },
                  focusArea: { type: Type.STRING },
                  milestoneProject: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      deliverable: { type: Type.STRING },
                    },
                    required: ["title", "description", "deliverable"],
                  },
                  days: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        day: { type: Type.INTEGER },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        hoursEstimated: { type: Type.INTEGER },
                        keyTopics: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                        resources: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              name: { type: Type.STRING },
                              type: { type: Type.STRING },
                              urlOrQuery: { type: Type.STRING },
                            },
                            required: ["name", "type", "urlOrQuery"],
                          },
                        },
                        checkpoint: { type: Type.STRING },
                      },
                      required: ["day", "title", "description", "hoursEstimated", "keyTopics", "resources", "checkpoint"],
                    },
                  },
                },
                required: ["week", "phaseTitle", "phaseGoal", "focusArea", "milestoneProject", "days"],
              },
            },
          },
          required: ["targetRole", "summary", "totalHours", "roadmap", "weeklyPhases"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty roadmap response from Gemini model");
    }

    const parsed = JSON.parse(text);

    // Normalize days across roadmap and weeklyPhases
    const flatRoadmap = parsed.roadmap || [];
    const weeklyPhases = (parsed.weeklyPhases || []).map((phase: any) => ({
      ...phase,
      days: (phase.days || []).map((d: any) => {
        const flatMatch = flatRoadmap.find((item: any) => item.day === d.day);
        return {
          ...d,
          day: d.day,
          topic: d.title || flatMatch?.topic || `Day ${d.day}`,
          title: d.title || flatMatch?.topic || `Day ${d.day}`,
          objective: flatMatch?.objective || d.description || "Master the daily technical objective",
          description: d.description || flatMatch?.activity || "Complete the assigned hands-on exercises",
          activity: flatMatch?.activity || d.description || "Hands-on implementation",
          estimatedMinutes: flatMatch?.estimatedMinutes || (d.hoursEstimated ? d.hoursEstimated * 60 : 120),
          hoursEstimated: d.hoursEstimated || (flatMatch?.estimatedMinutes ? Math.round(flatMatch.estimatedMinutes / 60) : 2),
          keyTopics: d.keyTopics || [d.title || "Core Concepts"],
          resources: d.resources || flatMatch?.resources || [],
          checkpoint: d.checkpoint || flatMatch?.checkpoint || "Complete code review and commit to git.",
          completed: false,
        };
      }),
    }));

    const finalRoadmap = {
      id: "roadmap-" + Date.now(),
      targetRole: parsed.targetRole || selectedRole,
      createdAt: new Date().toISOString(),
      summary: parsed.summary || `A 30-day intensive learning roadmap tailored for ${selectedRole}.`,
      totalHours: parsed.totalHours || 90,
      roadmap: flatRoadmap,
      weeklyPhases: weeklyPhases,
      completedDayNumbers: [],
      progressPercent: 0,
    };

    res.json(deepSanitize(finalRoadmap));
  } catch (error: any) {
    console.error("Gemini Roadmap Generation Error:", error);
    const fallback = generateFallbackRoadmap(req.body.profile, req.body.targetRole || "Full-Stack Software Engineer");
    res.json(deepSanitize(fallback));
  }
});

// Dynamic Fallback generator functions
function generateFallbackCareerAnalysis(profile: any) {
  const skills: string[] = Array.isArray(profile.technicalSkills) && profile.technicalSkills.length > 0
    ? profile.technicalSkills
    : ["JavaScript", "Python", "React", "REST APIs", "Git"];
  const progLangs: string[] = Array.isArray(profile.programmingLanguages) && profile.programmingLanguages.length > 0
    ? profile.programmingLanguages
    : ["JavaScript", "Python", "TypeScript"];
  const goal: string = profile.careerGoal || "Full-Stack AI Engineer";
  const exp: string = profile.experienceLevel || "Intermediate";

  let baseScore = 68;
  if (skills.length >= 4) baseScore += 8;
  if (progLangs.length >= 3) baseScore += 6;
  if (exp === "Intermediate") baseScore += 6;
  if (exp === "Advanced") baseScore += 12;
  if (baseScore > 94) baseScore = 94;

  const targetTitle = goal.includes("AI") || goal.includes("Machine")
    ? "AI Application Engineer"
    : goal.includes("Cloud") || goal.includes("DevOps")
    ? "Cloud Infrastructure & DevOps Engineer"
    : goal.includes("Data")
    ? "Data Engineer & Analytics Specialist"
    : "Full-Stack Software Engineer";

  const existingSkills = Array.from(new Set([...skills, ...progLangs]));

  const careerRecs = [
    {
      career: targetTitle,
      roleTitle: targetTitle,
      matchPercentage: Math.min(96, baseScore + 10),
      reason: `Direct synergy with your target goal of ${goal} and your foundation in ${existingSkills.slice(0, 3).join(", ")}.`,
      whyFit: `Direct synergy with your target goal of ${goal} and your foundation in ${existingSkills.slice(0, 3).join(", ")}.`,
      description: "Design and deliver end-to-end applications, connecting scalable server microservices with responsive web apps and modern AI APIs.",
      averageSalary: "$105,000 - $145,000 / yr",
      growthOutlook: "+28% over next 5 years (High Demand)",
      keyResponsibilities: [
        "Build scalable backend services and responsive client web applications",
        "Design relational database schemas, migrations, and cache layers",
        "Automate CI/CD test and container deployment workflows",
        "Integrate Gemini AI APIs and third-party cloud services",
      ],
      requiredSkills: ["TypeScript", "React", "Node.js / Express", "PostgreSQL", "Docker", "Gemini API", "Git & CI/CD"],
      entryBarrier: "Moderate" as const,
    },
    {
      career: "Cloud & Distributed Systems Engineer",
      roleTitle: "Cloud & Distributed Systems Engineer",
      matchPercentage: Math.max(70, baseScore - 4),
      reason: "Excellent match for backend infrastructure, containerization, and cloud scalability.",
      whyFit: "Strong analytical upside and natural complement to modern web development skills.",
      description: "Focus on cloud microservices, containerization with Docker, API gateways, and system observability.",
      averageSalary: "$100,000 - $135,000 / yr",
      growthOutlook: "+24% steady demand",
      keyResponsibilities: [
        "Containerize services and deploy to Google Cloud Run / Kubernetes",
        "Implement monitoring, logging, and automated health checks",
        "Collaborate on distributed system architectures and load testing",
      ],
      requiredSkills: ["Docker", "Google Cloud Platform", "Kubernetes", "Linux Shell", "PostgreSQL", "Networking"],
      entryBarrier: "Moderate" as const,
    },
    {
      career: "Frontend & Web Platform Engineer",
      roleTitle: "Frontend & Web Platform Engineer",
      matchPercentage: Math.max(68, baseScore - 7),
      reason: "Immediate applicability with quick interview loop readiness and strong visual UX polish.",
      whyFit: "Immediate applicability with quick interview loop readiness and strong visual UX polish.",
      description: "Create accessible, high-performance web applications, interactive visualizers, and stateful client workflows.",
      averageSalary: "$95,000 - $125,000 / yr",
      growthOutlook: "+19% steady demand",
      keyResponsibilities: [
        "Develop reusable component libraries with TypeScript & Tailwind",
        "Optimize client-side rendering, bundle size, and Core Web Vitals",
        "Connect RESTful and WebSocket real-time APIs",
      ],
      requiredSkills: ["React", "TypeScript", "Tailwind CSS", "State Management", "Web Performance", "Accessibility"],
      entryBarrier: "Low" as const,
    },
  ];

  return {
    id: "analysis-" + Date.now(),
    timestamp: new Date().toISOString(),
    inputProfile: profile,
    jobReadinessScore: baseScore,
    currentLevel: baseScore >= 80 ? "Career Ready" : baseScore >= 65 ? "Developing" : "Starting Out",
    readinessLevel: baseScore >= 80 ? "Career Ready" : baseScore >= 65 ? "Developing" : "Starting Out",
    readinessSummary: `Based on your ${profile.education} in ${profile.degreeBranch} and foundation in ${existingSkills.slice(0, 3).join(", ")}, you have strong core potential for ${targetTitle} roles. Expanding your portfolio with deployed full-stack cloud projects and mastering system design will significantly boost your interview conversion rate.`,
    scoreExplanation: {
      technicalProficiency: Math.min(95, baseScore + 3),
      marketAlignment: Math.min(95, baseScore + 5),
      portfolioReadiness: Math.max(45, baseScore - 12),
      domainBreadth: Math.min(90, baseScore - 2),
      industryDemandIndex: 88,
      majorFactorsSummary: `Your strong programming foundation in ${progLangs.join(", ")} drives high technical potential. The primary growth opportunity lies in building deployed flagship projects with Docker and demonstrating database indexing proficiency.`,
      keyStrengths: [
        `Solid grasp of core programming in ${progLangs.slice(0, 2).join(" & ")}`,
        `Clear focus on modern ${goal} career path`,
        `Strong educational foundation in ${profile.degreeBranch}`,
      ],
      keyImprovementsNeeded: [
        "Deploying live containerized applications to Google Cloud Run",
        "Deepening relational database schema design with PostgreSQL",
        "Algorithmic problem-solving practice for technical coding rounds",
      ],
    },
    readinessBreakdown: {
      technicalProficiency: Math.min(95, baseScore + 3),
      marketAlignment: Math.min(95, baseScore + 5),
      portfolioReadiness: Math.max(45, baseScore - 12),
      domainBreadth: Math.min(90, baseScore - 2),
      industryDemandIndex: 88,
    },
    userExistingSkills: existingSkills,
    skillGaps: [
      {
        skill: "Cloud Container Deployment (Docker & Cloud Run)",
        priority: "Critical" as const,
        category: "Critical",
        whyNeeded: "Hiring managers prioritize candidates whose code is live, containerized, and accessible via public HTTPS links.",
        recommendedWayToLearn: "Build multi-stage Dockerfiles and deploy sample Express/React applications to Google Cloud Run.",
        estimatedTimeToLearn: "1 - 2 weeks",
      },
      {
        skill: "Production Database Indexing & Migrations",
        priority: "High Priority" as const,
        category: "High Priority",
        whyNeeded: "Essential for building applications that handle multi-user state without data corruption or slow query latency.",
        recommendedWayToLearn: "Practice PostgreSQL schema design, foreign key constraints, and query analysis with EXPLAIN ANALYZE.",
        estimatedTimeToLearn: "1 week",
      },
      {
        skill: "Generative AI SDK & Structured Outputs",
        priority: "High Priority" as const,
        category: "High Priority",
        whyNeeded: "Modern software roles increasingly require developers to integrate AI agents, function calling, and structured JSON parsing.",
        recommendedWayToLearn: "Build full-stack applications using the @google/genai SDK with gemini-3.7-flash and responseSchema.",
        estimatedTimeToLearn: "1 - 2 weeks",
      },
      {
        skill: "Automated Integration Testing (Vitest / Supertest)",
        priority: "Recommended" as const,
        category: "Recommended",
        whyNeeded: "Demonstrates software craftsmanship and readiness for production engineering teams.",
        recommendedWayToLearn: "Write unit and integration tests for API routes, achieving >80% code coverage.",
        estimatedTimeToLearn: "4 - 5 days",
      },
    ],
    recommendedTechnologies: [
      "TypeScript", "React 19", "Tailwind CSS", "Docker", "PostgreSQL", "Google Cloud Run", "Gemini API (@google/genai)", "Vitest"
    ],
    careerRecommendations: careerRecs,
    topCareerRecommendations: careerRecs,
    requiredSkills: {
      coreTechnical: [
        "Strict TypeScript & Asynchronous Node.js",
        "Relational Database Design (PostgreSQL / SQL)",
        "RESTful API & WebSocket Architecture",
        "Data Structures & Algorithmic Problem Solving",
      ],
      toolsAndFrameworks: [
        "React & Vite / Next.js",
        "Tailwind CSS",
        "Docker & Containerization",
        "Git & GitHub Actions CI/CD",
        "Google Cloud Run / Cloud Functions",
      ],
      softAndDomainSkills: [
        "System Architecture & Tradeoff Analysis",
        "Technical Case Study Documentation",
        "Agile Sprint Execution & Git PR Reviews",
        "Effective Technical Communication in Interviews",
      ],
    },
    personalizedRecommendations: {
      actionableAdvice: [
        `Publish a flagship full-stack project on GitHub with a comprehensive README, live demo link, and architecture diagram.`,
        `Transition all personal JavaScript projects to strict TypeScript with zero 'any' types to reflect industry standards.`,
        `Practice solving 3 LeetCode pattern problems per week (Two Pointers, Hash Maps, Binary Trees).`,
        `Network proactively on LinkedIn with university alumni currently working in ${goal} roles.`,
      ],
      recommendedProjects: [
        {
          title: `AI-Powered Student Career & Roadmap Navigator`,
          description: `A responsive web app with user authentication, database persistence, interactive learning roadmaps, and server-side Gemini API integration.`,
          techStack: ["React", "TypeScript", "Express", "PostgreSQL", "Gemini API", "Tailwind CSS"],
          difficulty: "Intermediate" as const,
          outcome: "Demonstrates full-stack proficiency, AI SDK mastery, and clean product design.",
        },
        {
          title: `Real-Time Cloud Task & Collaboration Hub`,
          description: `A multiplayer workspace featuring WebSocket synchronization, role-based permissions, and Docker container deployment.`,
          techStack: ["Node.js", "TypeScript", "WebSockets", "Docker", "Google Cloud Run"],
          difficulty: "Intermediate" as const,
          outcome: "Proves systems engineering, containerization, and networking competency.",
        },
      ],
      certifications: [
        "Google Cloud Associate Cloud Engineer",
        "Meta Professional Frontend / Backend Developer",
        "AWS Certified Developer – Associate",
      ],
      resumeTips: [
        "Format resume using the XYZ formula: 'Accomplished [X], as measured by [Y], by doing [Z]'.",
        "Include live working links to your deployed Cloud Run applications and GitHub repositories.",
        "Add a distinct 'Technical Skills' section categorized into Languages, Frameworks, Cloud & Databases, and Developer Tools.",
      ],
      interviewPrepFocus: [
        "Core JavaScript / TypeScript asynchronous event loop and closures.",
        "React state management, performance optimization, and custom hooks.",
        "System design basics: Load balancing, caching strategies, and SQL vs NoSQL tradeoffs.",
      ],
    },
  };
}

function generateFallbackRoadmap(profile: any, targetRole: string) {
  const roadmap30 = [
    { day: 1, topic: "Advanced TypeScript & Generics", objective: "Master generics, utility types, and strict type safety", activity: "Refactor legacy JavaScript code to strict TypeScript", estimatedMinutes: 120, checkpoint: "Zero TypeScript errors on strict config", resources: [{ name: "TypeScript Handbook", type: "documentation", urlOrQuery: "https://www.typescriptlang.org/docs" }] },
    { day: 2, topic: "Node.js Runtime & Express Architecture", objective: "Understand event loop, middleware pipelines, and error handling", activity: "Build Express API scaffolding with structured logging", estimatedMinutes: 120, checkpoint: "Centralized error middleware functioning", resources: [{ name: "Express Best Practices", type: "article", urlOrQuery: "https://expressjs.com" }] },
    { day: 3, topic: "Relational Modeling with PostgreSQL", objective: "Design normalized schemas (3NF) and foreign keys", activity: "Create relational tables with indexes and migrations", estimatedMinutes: 150, checkpoint: "Schema migration runs successfully", resources: [{ name: "PostgreSQL Tutorial", type: "documentation", urlOrQuery: "https://www.postgresqltutorial.com" }] },
    { day: 4, topic: "Authentication & Security Protocols", objective: "Implement secure password hashing and token management", activity: "Create register/login endpoints with JWT and bcrypt", estimatedMinutes: 150, checkpoint: "Protected routes reject unauthenticated requests", resources: [{ name: "OWASP Auth Guidelines", type: "article", urlOrQuery: "https://owasp.org" }] },
    { day: 5, topic: "RESTful API CRUD & Zod Validation", objective: "Sanitize and validate incoming HTTP request payloads", activity: "Build CRUD endpoints with strict Zod schema validation", estimatedMinutes: 120, checkpoint: "Invalid payloads return clean 400 errors", resources: [{ name: "Zod Schema Docs", type: "documentation", urlOrQuery: "https://zod.dev" }] },
    { day: 6, topic: "Automated API Testing with Vitest", objective: "Write unit and integration tests for server endpoints", activity: "Implement automated test suite for auth and CRUD routes", estimatedMinutes: 120, checkpoint: "Achieve >80% test coverage", resources: [{ name: "Vitest Quickstart", type: "documentation", urlOrQuery: "https://vitest.dev" }] },
    { day: 7, topic: "Week 1 Review & Milestone Project Delivery", objective: "Publish backend API service to GitHub with docs", activity: "Create README with OpenAPI documentation and push to GitHub", estimatedMinutes: 150, checkpoint: "GitHub repo live with passing CI action", resources: [{ name: "Awesome README Guide", type: "article", urlOrQuery: "https://github.com" }] },
    { day: 8, topic: "Modern React Hooks & Custom Hook Design", objective: "Master useReducer, useMemo, and custom reusable hooks", activity: "Build custom hooks for debouncing, local state, and API fetching", estimatedMinutes: 120, checkpoint: "Reusable hooks tested in client components", resources: [{ name: "React 19 Official Docs", type: "documentation", urlOrQuery: "https://react.dev" }] },
    { day: 9, topic: "Client-Side Data Fetching & Caching", objective: "Manage optimistic UI updates and cache invalidation", activity: "Implement optimistic item creation with rollback on error", estimatedMinutes: 120, checkpoint: "Instant UI update with rollback verified", resources: [{ name: "Practical React Patterns", type: "article", urlOrQuery: "https://tkdodo.eu" }] },
    { day: 10, topic: "Tailwind CSS & Micro-Interactions", objective: "Build responsive, accessible modern layouts", activity: "Design interactive component library with smooth transitions", estimatedMinutes: 120, checkpoint: "Fully responsive on mobile and desktop", resources: [{ name: "Tailwind CSS Docs", type: "documentation", urlOrQuery: "https://tailwindcss.com" }] },
    { day: 11, topic: "Complex Multi-Step Form Management", objective: "Handle multi-stage validation and file drag-and-drop", activity: "Build accessible onboarding wizard with client validation", estimatedMinutes: 120, checkpoint: "Form validates step-by-step with state persistence", resources: [{ name: "Accessible Forms Guide", type: "article", urlOrQuery: "https://web.dev" }] },
    { day: 12, topic: "Real-Time WebSockets & Server Events", objective: "Connect live event streams and notification channels", activity: "Create live notification feed updating via WebSockets/SSE", estimatedMinutes: 150, checkpoint: "Live updates render without page reload", resources: [{ name: "MDN Server-Sent Events", type: "documentation", urlOrQuery: "https://developer.mozilla.org" }] },
    { day: 13, topic: "Web Performance & Core Web Vitals", objective: "Optimize bundle size, asset loading, and render speed", activity: "Perform Lighthouse audit and optimize code-splitting", estimatedMinutes: 120, checkpoint: "Score 95+ on Lighthouse Performance", resources: [{ name: "Web.dev Vitals Guide", type: "documentation", urlOrQuery: "https://web.dev/vitals" }] },
    { day: 14, topic: "Week 2 Review & Full-Stack Integration", objective: "Unify frontend React application with Week 1 API", activity: "Integrate end-to-end authentication and interactive dashboard", estimatedMinutes: 180, checkpoint: "Full login-to-dashboard workflow operating smoothly", resources: [{ name: "Full-Stack Architecture", type: "article", urlOrQuery: "https://martinfowler.com" }] },
    { day: 15, topic: "Google GenAI SDK Integration", objective: "Integrate @google/genai with gemini-3.7-flash server-side", activity: "Build secure server API route to proxy AI generation requests", estimatedMinutes: 120, checkpoint: "AI route returns responses without exposing API keys", resources: [{ name: "Google GenAI SDK Guide", type: "documentation", urlOrQuery: "https://ai.google.dev" }] },
    { day: 16, topic: "Structured JSON Schemas with Type System", objective: "Enforce strict JSON schema validation in Gemini models", activity: "Create structured AI endpoints returning typed JSON objects", estimatedMinutes: 120, checkpoint: "Guaranteed typed JSON responses from model", resources: [{ name: "Prompting Guide - Structured", type: "article", urlOrQuery: "https://promptingguide.ai" }] },
    { day: 17, topic: "Streaming AI Responses & Markdown Rendering", objective: "Deliver token-by-token streaming UX for AI outputs", activity: "Implement generateContentStream with frontend typewriter render", estimatedMinutes: 150, checkpoint: "Zero-wait streaming UI response working", resources: [{ name: "ReadableStream API", type: "documentation", urlOrQuery: "https://developer.mozilla.org" }] },
    { day: 18, topic: "Vector Embeddings & Semantic Search", objective: "Generate text embeddings and compute cosine similarity", activity: "Build semantic search endpoint matching user queries to career roles", estimatedMinutes: 150, checkpoint: "Semantic search returns top 3 nearest matches", resources: [{ name: "Vertex AI Embeddings", type: "documentation", urlOrQuery: "https://cloud.google.com" }] },
    { day: 19, topic: "Docker Containerization & Optimization", objective: "Write multi-stage Dockerfile for production full-stack apps", activity: "Containerize the entire application and test locally", estimatedMinutes: 150, checkpoint: "Docker container boots and serves traffic on port 3000", resources: [{ name: "Docker Best Practices", type: "documentation", urlOrQuery: "https://docs.docker.com" }] },
    { day: 20, topic: "Google Cloud Run Deployment", objective: "Deploy container image to Google Cloud Run with HTTPS", activity: "Deploy application and configure environment secrets", estimatedMinutes: 150, checkpoint: "Application accessible at live public HTTPS URL", resources: [{ name: "Cloud Run Quickstart", type: "documentation", urlOrQuery: "https://cloud.google.com/run" }] },
    { day: 21, topic: "Week 3 Flagship Launch & Smoke Tests", objective: "Perform end-to-end testing on live Cloud Run deployment", activity: "Verify health checks, latency, and responsive UI live", estimatedMinutes: 120, checkpoint: "Live working link shareable with recruiters", resources: [{ name: "Launch Checklist", type: "article", urlOrQuery: "https://web.dev" }] },
    { day: 22, topic: "System Design: Architecture & Tradeoffs", objective: "Design scalable client-server systems with caching", activity: "Diagram high-traffic web application architecture with Redis & CDN", estimatedMinutes: 150, checkpoint: "System design diagram completed with explanations", resources: [{ name: "System Design Primer", type: "article", urlOrQuery: "https://github.com/donnemartin/system-design-primer" }] },
    { day: 23, topic: "Algorithms: Two Pointers & Sliding Window", objective: "Master array manipulation and window tracking patterns", activity: "Solve 4 LeetCode Easy/Medium problems with Big-O analysis", estimatedMinutes: 120, checkpoint: "4 clean solutions coded and documented", resources: [{ name: "NeetCode Roadmap", type: "practice", urlOrQuery: "https://neetcode.io" }] },
    { day: 24, topic: "Algorithms: Trees, Graphs & BFS/DFS", objective: "Master tree traversals and graph connectivity", activity: "Solve 3 Binary Tree and Graph problems explaining edge cases", estimatedMinutes: 120, checkpoint: "All tree/graph test cases passing cleanly", resources: [{ name: "Tree Algorithms Guide", type: "practice", urlOrQuery: "https://neetcode.io" }] },
    { day: 25, topic: "ATS-Optimized Tech Resume Crafting", objective: "Format resume using the Google XYZ bullet formula", activity: "Audit and rewrite resume bullets: Accomplished X, measured by Y, doing Z", estimatedMinutes: 120, checkpoint: "1-page polished PDF resume ready for submission", resources: [{ name: "CareerCup Resume Guide", type: "article", urlOrQuery: "https://careercup.com" }] },
    { day: 26, topic: "GitHub Profile & Showcase Presentation", objective: "Turn GitHub into an interactive developer portfolio", activity: "Pin top repositories, add architecture diagrams, and create video demos", estimatedMinutes: 120, checkpoint: "Top 3 repositories showcase live links and GIFs", resources: [{ name: "Awesome GitHub Profile READMEs", type: "article", urlOrQuery: "https://github.com" }] },
    { day: 27, topic: "Behavioral Interviews & STAR Stories", objective: "Structure compelling answers using the STAR method", activity: "Draft and rehearse 4 STAR stories for leadership and technical challenges", estimatedMinutes: 120, checkpoint: "Recorded self-practice video answering 3 prompts", resources: [{ name: "STAR Method Guide", type: "article", urlOrQuery: "https://pramp.com" }] },
    { day: 28, topic: "Technical Mock Interview Simulation", objective: "Practice live coding communication and problem breakdown", activity: "Simulate a live 45-minute technical coding interview out loud", estimatedMinutes: 120, checkpoint: "Completed peer or timed mock interview", resources: [{ name: "Pramp Mock Interviews", type: "practice", urlOrQuery: "https://pramp.com" }] },
    { day: 29, topic: "Targeted Networking & Cold Outreach", objective: "Connect with engineering managers and university alumni", activity: "Send 5 personalized outreach messages on LinkedIn", estimatedMinutes: 90, checkpoint: "5 high-quality connection requests sent", resources: [{ name: "Tech Networking Guide", type: "article", urlOrQuery: "https://hired.com" }] },
    { day: 30, topic: "Graduation & First Application Wave", objective: "Submit top 5 tailored job applications and track progress", activity: "Submit applications with customized resumes and celebrate completion!", estimatedMinutes: 120, checkpoint: "5 applications submitted with follow-up calendar alerts set", resources: [{ name: "Continuous Learning Guide", type: "article", urlOrQuery: "https://martinfowler.com" }] },
  ];

  const weeklyPhases = [
    {
      week: 1,
      phaseTitle: "Week 1: Core Foundations & Strict Architecture",
      phaseGoal: "Solidify TypeScript mastery, asynchronous backend services, and relational schema modeling.",
      focusArea: "Backend & Type Safety",
      milestoneProject: {
        title: "Secure Authenticated REST API & Schema",
        description: "Build a production-grade backend API with authentication, validation middleware, and relational migrations.",
        deliverable: "GitHub repository with documented API endpoints and automated unit tests.",
      },
      days: roadmap30.slice(0, 7).map((d) => ({
        day: d.day,
        title: d.topic,
        topic: d.topic,
        objective: d.objective,
        description: d.activity,
        activity: d.activity,
        hoursEstimated: Math.round(d.estimatedMinutes / 60),
        estimatedMinutes: d.estimatedMinutes,
        keyTopics: [d.topic, "Core Implementation", "Best Practices"],
        resources: d.resources,
        checkpoint: d.checkpoint,
        completed: false,
      })),
    },
    {
      week: 2,
      phaseTitle: "Week 2: Responsive Frontend & Full-Stack Integration",
      phaseGoal: "Connect modern React UI with backend services, manage state, and optimize performance.",
      focusArea: "Full-Stack Web Engineering",
      milestoneProject: {
        title: "Interactive Client Web Application",
        description: "A reactive web application with live state updates, optimistic UI, and theme switching.",
        deliverable: "Responsive web frontend fully integrated with your backend API.",
      },
      days: roadmap30.slice(7, 14).map((d) => ({
        day: d.day,
        title: d.topic,
        topic: d.topic,
        objective: d.objective,
        description: d.activity,
        activity: d.activity,
        hoursEstimated: Math.round(d.estimatedMinutes / 60),
        estimatedMinutes: d.estimatedMinutes,
        keyTopics: [d.topic, "State Management", "Performance"],
        resources: d.resources,
        checkpoint: d.checkpoint,
        completed: false,
      })),
    },
    {
      week: 3,
      phaseTitle: "Week 3: Generative AI, Cloud Run & Containerization",
      phaseGoal: "Incorporate Gemini AI SDK features, build containerized Docker images, and deploy to Google Cloud Run.",
      focusArea: "AI Engineering & Cloud Infrastructure",
      milestoneProject: {
        title: "Live Containerized Flagship AI Platform",
        description: "Deploy your full-stack AI web application to a live Google Cloud Run URL with automated builds.",
        deliverable: "Live hosted web application URL accessible to recruiters.",
      },
      days: roadmap30.slice(14, 21).map((d) => ({
        day: d.day,
        title: d.topic,
        topic: d.topic,
        objective: d.objective,
        description: d.activity,
        activity: d.activity,
        hoursEstimated: Math.round(d.estimatedMinutes / 60),
        estimatedMinutes: d.estimatedMinutes,
        keyTopics: [d.topic, "Cloud Deployment", "Gemini API"],
        resources: d.resources,
        checkpoint: d.checkpoint,
        completed: false,
      })),
    },
    {
      week: 4,
      phaseTitle: "Week 4: Portfolio Polish, System Design & Interview Mastery",
      phaseGoal: "Package your GitHub portfolio, master high-frequency coding patterns, and prepare technical interviews.",
      focusArea: "Career Strategy & Technical Interviews",
      milestoneProject: {
        title: "Developer Portfolio & Tech Interview Dossier",
        description: "A polished portfolio site featuring case study breakdowns, system diagrams, and resume.",
        deliverable: "Completed resume, GitHub portfolio, and 5 submitted tailored job applications.",
      },
      days: roadmap30.slice(21, 30).map((d) => ({
        day: d.day,
        title: d.topic,
        topic: d.topic,
        objective: d.objective,
        description: d.activity,
        activity: d.activity,
        hoursEstimated: Math.round(d.estimatedMinutes / 60),
        estimatedMinutes: d.estimatedMinutes,
        keyTopics: [d.topic, "Algorithms & System Design", "Interview Ready"],
        resources: d.resources,
        checkpoint: d.checkpoint,
        completed: false,
      })),
    },
  ];

  return {
    id: "roadmap-" + Date.now(),
    targetRole: targetRole,
    createdAt: new Date().toISOString(),
    summary: `A structured 30-day intensive curriculum designed to elevate you from student fundamentals to an industry-ready ${targetRole} with a live containerized flagship project and interview mastery.`,
    totalHours: 90,
    roadmap: roadmap30,
    weeklyPhases: weeklyPhases,
    completedDayNumbers: [],
    progressPercent: 0,
  };
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CareerPilot AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
