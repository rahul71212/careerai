
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";

const roadmapData = {
  "Full Stack Developer": [
    {
      level: "Beginner",
      topics: [
        {
          name: "HTML & CSS",
          learn:
            "Learn page structure, semantic HTML, CSS selectors, box model, Flexbox and responsive design.",
          practice: "Build a responsive personal portfolio page.",
          time: "3-4 days",
        },
        {
          name: "JavaScript Fundamentals",
          learn:
            "Learn variables, functions, arrays, objects, loops, DOM, events and modern JavaScript.",
          practice: "Build a Todo List and Calculator using JavaScript.",
          time: "5-7 days",
        },
        {
          name: "Git & GitHub",
          learn:
            "Learn repositories, commits, branches, pull requests and basic Git workflow.",
          practice:
            "Create a GitHub repository and push one complete project.",
          time: "1-2 days",
        },
      ],
    },
    {
      level: "Intermediate",
      topics: [
        {
          name: "React.js",
          learn:
            "Learn components, props, state, hooks, events, forms and React application structure.",
          practice: "Build a job portal dashboard using React.",
          time: "5-7 days",
        },
        {
          name: "Node.js",
          learn:
            "Learn server-side JavaScript, modules, npm and backend application structure.",
          practice: "Create a basic Node.js REST server.",
          time: "2-3 days",
        },
        {
          name: "Express.js",
          learn:
            "Learn routes, middleware, controllers and REST API development.",
          practice: "Build CRUD APIs for a job application system.",
          time: "2-3 days",
        },
        {
          name: "MongoDB",
          learn:
            "Learn databases, collections, documents, queries and MongoDB with Mongoose.",
          practice:
            "Create a database for users, jobs and applications.",
          time: "2-3 days",
        },
        {
          name: "REST APIs",
          learn:
            "Learn HTTP methods, status codes, JSON and API architecture.",
          practice: "Build and consume a complete CRUD REST API.",
          time: "2-3 days",
        },
      ],
    },
    {
      level: "Advanced",
      topics: [
        {
          name: "Authentication & JWT",
          learn:
            "Learn login, signup, password security, JWT tokens and protected routes.",
          practice: "Add authentication to your job platform.",
          time: "2-3 days",
        },
        {
          name: "Deployment",
          learn:
            "Learn how to deploy frontend and backend applications.",
          practice: "Deploy a full-stack project online.",
          time: "1-2 days",
        },
        {
          name: "System Design Basics",
          learn:
            "Learn scalability, APIs, databases, caching and basic architecture.",
          practice: "Design the architecture of a job platform.",
          time: "3-4 days",
        },
        {
          name: "Testing",
          learn:
            "Learn unit testing, integration testing and testing APIs.",
          practice: "Write tests for your backend APIs.",
          time: "2-3 days",
        },
        {
          name: "Performance Optimization",
          learn:
            "Learn frontend performance, API optimization and efficient database queries.",
          practice:
            "Optimize loading speed and API response time.",
          time: "2-3 days",
        },
      ],
    },
  ],

  "Frontend Developer": [
    {
      level: "Beginner",
      topics: [
        {
          name: "HTML",
          learn:
            "Learn semantic HTML, forms, links, tables and accessibility basics.",
          practice: "Build a multi-page portfolio website.",
          time: "2-3 days",
        },
        {
          name: "CSS",
          learn:
            "Learn selectors, box model, Flexbox, Grid, animations and responsive design.",
          practice: "Create a responsive landing page.",
          time: "3-4 days",
        },
        {
          name: "JavaScript",
          learn:
            "Learn variables, functions, arrays, objects, DOM, events and ES6+.",
          practice: "Build an interactive Todo application.",
          time: "5-7 days",
        },
        {
          name: "Git & GitHub",
          learn: "Learn version control and GitHub workflow.",
          practice: "Push your frontend projects to GitHub.",
          time: "1-2 days",
        },
      ],
    },
    {
      level: "Intermediate",
      topics: [
        {
          name: "React.js",
          learn:
            "Learn components, props, state, hooks and reusable UI architecture.",
          practice: "Build a React dashboard.",
          time: "5-7 days",
        },
        {
          name: "Tailwind CSS",
          learn:
            "Learn utility classes, responsive design and component styling.",
          practice: "Convert an existing CSS project to Tailwind.",
          time: "2-3 days",
        },
        {
          name: "API Integration",
          learn:
            "Learn fetch, async/await, API requests and handling responses.",
          practice:
            "Connect a React application to a REST API.",
          time: "2-3 days",
        },
        {
          name: "State Management",
          learn:
            "Learn local state, global state and efficient state updates.",
          practice: "Build a shopping cart with shared state.",
          time: "2-3 days",
        },
      ],
    },
    {
      level: "Advanced",
      topics: [
        {
          name: "Performance Optimization",
          learn:
            "Learn lazy loading, memoization, code splitting and rendering optimization.",
          practice: "Optimize a slow React application.",
          time: "2-3 days",
        },
        {
          name: "Testing",
          learn:
            "Learn component and frontend testing concepts.",
          practice: "Write tests for React components.",
          time: "2-3 days",
        },
        {
          name: "Accessibility",
          learn:
            "Learn semantic markup, keyboard navigation and accessible UI.",
          practice: "Make your portfolio accessible.",
          time: "1-2 days",
        },
        {
          name: "Frontend Architecture",
          learn:
            "Learn component structure, folder organization and scalable React architecture.",
          practice:
            "Refactor a project into reusable components.",
          time: "2-3 days",
        },
      ],
    },
  ],

  "Backend Developer": [
    {
      level: "Beginner",
      topics: [
        {
          name: "Programming Fundamentals",
          learn:
            "Learn variables, conditions, loops, functions, arrays and problem solving.",
          practice: "Solve 20 beginner programming problems.",
          time: "4-5 days",
        },
        {
          name: "JavaScript / Java",
          learn:
            "Learn core programming concepts and object-oriented programming.",
          practice:
            "Build small console-based applications.",
          time: "5-7 days",
        },
        {
          name: "Git & GitHub",
          learn: "Learn version control and GitHub.",
          practice: "Push backend projects to GitHub.",
          time: "1-2 days",
        },
        {
          name: "SQL Basics",
          learn:
            "Learn tables, SELECT, INSERT, UPDATE, DELETE, JOIN and relationships.",
          practice: "Create a small employee database.",
          time: "2-3 days",
        },
      ],
    },
    {
      level: "Intermediate",
      topics: [
        {
          name: "Node.js",
          learn:
            "Learn Node.js runtime, modules, npm and backend development.",
          practice: "Create a Node.js backend.",
          time: "2-3 days",
        },
        {
          name: "Express.js",
          learn: "Learn routing, middleware and REST APIs.",
          practice: "Build CRUD APIs.",
          time: "2-3 days",
        },
        {
          name: "MongoDB",
          learn:
            "Learn NoSQL database concepts and Mongoose.",
          practice: "Build a user and job database.",
          time: "2-3 days",
        },
        {
          name: "REST APIs",
          learn:
            "Learn HTTP methods, status codes and API design.",
          practice: "Build a complete REST API.",
          time: "2-3 days",
        },
        {
          name: "Authentication",
          learn:
            "Learn login, signup, password hashing and JWT authentication.",
          practice: "Create protected user routes.",
          time: "2-3 days",
        },
      ],
    },
    {
      level: "Advanced",
      topics: [
        {
          name: "System Design",
          learn:
            "Learn scalability, architecture, databases, APIs and distributed systems basics.",
          practice: "Design a scalable job platform.",
          time: "4-5 days",
        },
        {
          name: "Caching",
          learn:
            "Learn caching concepts and when caching improves performance.",
          practice:
            "Add caching to frequently requested data.",
          time: "1-2 days",
        },
        {
          name: "Security",
          learn:
            "Learn authentication security, validation, CORS and common web vulnerabilities.",
          practice: "Secure a backend API.",
          time: "2-3 days",
        },
        {
          name: "Testing",
          learn:
            "Learn backend unit and integration testing.",
          practice: "Test your API endpoints.",
          time: "2-3 days",
        },
        {
          name: "Deployment",
          learn:
            "Learn production deployment and environment variables.",
          practice: "Deploy a backend application.",
          time: "1-2 days",
        },
      ],
    },
  ],
};

function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[.\-**\s**/&]/g, "");
}

function detectRole(targetRole) {
  const role = normalizeText(targetRole);

  if (role.includes("frontend") || role.includes("react")) {
    return "Frontend Developer";
  }

  if (role.includes("backend") || role.includes("node")) {
    return "Backend Developer";
  }

  return "Full Stack Developer";
}

function skillMatchesTopic(topic, skill) {
  const topicText = normalizeText(topic);
  const skillText = normalizeText(skill);

  if (!topicText || !skillText) {
    return false;
  }

  const aliases = {
    html: ["html", "html5"],
    css: ["css", "css3"],
    javascript: ["javascript", "js"],
    reactjs: ["react", "reactjs"],
    nodejs: ["node", "nodejs"],
    expressjs: ["express", "expressjs"],
    mongodb: ["mongodb", "mongo"],
    gitgithub: ["git", "github"],
    tailwindcss: ["tailwind", "tailwindcss"],
    restapis: ["restapi", "restapis", "api"],
    authenticationjwt: ["authentication", "jwt"],
    authentication: ["authentication", "jwt"],
    sqlbasics: ["sql", "mysql", "postgresql"],
    javascriptjava: ["java", "javascript"],
  };

  if (
    topicText.includes(skillText) ||
    skillText.includes(topicText)
  ) {
    return true;
  }

  for (const values of Object.values(aliases)) {
    if (
      values.includes(topicText) &&
      values.includes(skillText)
    ) {
      return true;
    }
  }

  return false;
}

const learningResources = {
  "HTML & CSS":
    "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",

  HTML:
    "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",

  CSS:
    "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics",

  "JavaScript Fundamentals":
    "https://javascript.info/",

  JavaScript:
    "https://javascript.info/",

  "Git & GitHub":
    "https://git-scm.com/book/en/v2",

  "React.js":
    "https://react.dev/learn",

  "Node.js":
    "https://nodejs.org/en/learn",

  "Express.js":
    "https://expressjs.com/en/starter/installing.html",

  MongoDB:
    "https://www.mongodb.com/docs/manual/tutorial/",

  "REST APIs":
    "https://developer.mozilla.org/en-US/docs/Web/HTTP",

  "Authentication & JWT":
    "https://jwt.io/introduction",

  Authentication:
    "https://jwt.io/introduction",

  Deployment:
    "https://vercel.com/docs",

  "System Design Basics":
    "https://github.com/donnemartin/system-design-primer",

  "System Design":
    "https://github.com/donnemartin/system-design-primer",

  Testing:
    "https://jestjs.io/docs/getting-started",

  "Performance Optimization":
    "https://web.dev/learn/performance/",

  "Tailwind CSS":
    "https://tailwindcss.com/docs",

  "API Integration":
    "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API",

  "State Management":
    "https://react.dev/learn/managing-state",

  "Frontend Architecture":
    "https://react.dev/learn/thinking-in-react",

  Accessibility:
    "https://developer.mozilla.org/en-US/docs/Web/Accessibility",

  "Programming Fundamentals":
    "https://www.geeksforgeeks.org/fundamentals-of-algorithms/",

  "JavaScript / Java":
    "https://dev.java/learn/",

  "SQL Basics":
    "https://www.w3schools.com/sql/",

  Caching:
    "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching",

  Security:
    "https://developer.mozilla.org/en-US/docs/Web/Security",
};

function CareerRoadmap() {
  const [role, setRole] = useState("Full Stack Developer");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [completed, setCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem("roadmapProgress");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const fetchResumeAnalysis = async () => {
      try {
        setLoading(true);
        setError("");

        const resumeId = localStorage.getItem("resumeId");
        const token = localStorage.getItem("token");

        if (!resumeId) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/resume/${resumeId}`,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Your login session has expired. Please login again."
            );
          }

          throw new Error("Resume analysis not found");
        }

        const data = await response.json();

        if (data.analysis) {
          setAnalysis(data.analysis);

          const detectedRole = detectRole(
            data.analysis.targetRole
          );

          setRole(detectedRole);
        }
      } catch (err) {
        console.error("Career Roadmap Error:", err);

        setError(
          err.message ||
            "Resume analysis could not be loaded. You can select a role manually."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResumeAnalysis();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "roadmapProgress",
      JSON.stringify(completed)
    );
  }, [completed]);

  const roadmap =
    roadmapData[role] ||
    roadmapData["Full Stack Developer"];

  const allTopics = useMemo(() => {
    return roadmap.flatMap((item) => item.topics);
  }, [roadmap]);

  const completedCount = allTopics.filter((topic) =>
    completed.includes(topic.name)
  ).length;

  const progress =
    allTopics.length > 0
      ? Math.round(
          (completedCount / allTopics.length) * 100
        )
      : 0;

  const resumeSkills = analysis?.skills || [];
  const missingSkills = analysis?.missingSkills || [];

  const toggleTopic = (topicName) => {
    setCompleted((previous) => {
      if (previous.includes(topicName)) {
        return previous.filter((item) => item !== topicName);
      }

      return [...previous, topicName];
    });
  };

  const resetProgress = () => {
    setCompleted([]);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">

        {/* Header */}
        <div className="relative">

          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#d4af37]/[0.025] blur-3xl" />

          <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
            AI Career Planner
          </p>

          <h1 className="relative mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Career{" "}
            <span className="text-[#e6c35c]">
              Roadmap
            </span>
          </h1>

          <p className="relative mt-4 max-w-2xl text-sm leading-6 text-gray-500">
            Follow a personalized learning path based on your
            resume skills, target role and missing skills.
          </p>

        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-8 rounded-xl border border-white/[0.07] bg-[#0a0a0a] p-5 text-sm text-gray-500">
            Loading your resume-based roadmap...
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="mt-8 rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/[0.035] p-5 text-sm text-[#d4af37]">
            {error}
          </div>
        )}

        {/* Resume Analysis Summary */}
        {analysis && !loading && (
          <div className="mt-8 grid gap-4 md:grid-cols-3">

            <div className="rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-5">
              <p className="text-xs uppercase tracking-wide text-gray-600">
                Resume Target Role
              </p>

              <p className="mt-2 text-lg font-semibold text-[#e6c35c]">
                {analysis.targetRole || "Not specified"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-5">
              <p className="text-xs uppercase tracking-wide text-gray-600">
                Your Skills
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-400">
                {resumeSkills.length}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-5">
              <p className="text-xs uppercase tracking-wide text-gray-600">
                Skills To Improve
              </p>

              <p className="mt-2 text-2xl font-bold text-[#d4af37]">
                {missingSkills.length}
              </p>
            </div>

          </div>
        )}

        {/* Role Selector */}
        <div className="mt-8 max-w-md">

          <label className="mb-2 block text-sm font-medium text-gray-400">
            Roadmap Role
          </label>

          <select
            value={role}
            onChange={(event) =>
              setRole(event.target.value)
            }
            className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#d4af37]/40 focus:ring-1 focus:ring-[#d4af37]/10"
          >
            <option value="Full Stack Developer">
              Full Stack Developer
            </option>

            <option value="Frontend Developer">
              Frontend Developer
            </option>

            <option value="Backend Developer">
              Backend Developer
            </option>
          </select>

        </div>

        {/* Existing Skills */}
        {resumeSkills.length > 0 && (
          <div className="mt-8 rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-6">

            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-[#d4af37]" />

              <h2 className="text-lg font-semibold">
                Skills You Already Have
              </h2>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">

              {resumeSkills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-full border border-emerald-500/15 bg-emerald-500/[0.05] px-3 py-1.5 text-sm text-emerald-400"
                >
                  ✓ {skill}
                </span>
              ))}

            </div>
          </div>
        )}

        {/* Missing Skills */}
        {missingSkills.length > 0 && (
          <div className="mt-5 rounded-2xl border border-[#d4af37]/15 bg-[#d4af37]/[0.025] p-6">

            <div className="flex items-center gap-3">

              <div className="h-px w-8 bg-[#d4af37]" />

              <h2 className="text-lg font-semibold">
                Priority Skills To Learn
              </h2>

            </div>

            <p className="mt-2 text-sm text-gray-500">
              These skills were identified from your resume
              analysis.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">

              {missingSkills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-full border border-[#d4af37]/15 bg-[#d4af37]/[0.05] px-3 py-1.5 text-sm text-[#d4af37]"
                >
                  + {skill}
                </span>
              ))}

            </div>
          </div>
        )}

        {/* Progress */}
        <div className="mt-10 rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-6">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>

              <h2 className="text-xl font-semibold">
                Your Progress
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {completedCount} of {allTopics.length} topics
                completed
              </p>

            </div>

            <div className="flex items-center gap-4">

              <span className="text-2xl font-bold text-[#e6c35c]">
                {progress}%
              </span>

              <button
                onClick={resetProgress}
                className="rounded-lg border border-white/[0.08] px-3 py-2 text-sm text-gray-500 transition hover:border-[#d4af37]/30 hover:text-[#d4af37]"
              >
                Reset
              </button>

            </div>

          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.07]">

            <div
              className="h-full rounded-full bg-[#d4af37] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />

          </div>

        </div>

        {/* Roadmap */}
        <div className="mt-10 space-y-6">

          {roadmap.map((level) => (
            <section
              key={level.level}
              className="rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-6"
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="h-7 w-1 rounded-full bg-[#d4af37]" />

                  <h2 className="text-xl font-semibold">
                    {level.level}
                  </h2>

                </div>

                <span className="rounded-full border border-white/[0.06] px-3 py-1 text-xs text-gray-600">
                  {level.topics.length} topics
                </span>

              </div>

              <div className="mt-5 space-y-4">

                {level.topics.map((topic) => {

                  const isCompleted =
                    completed.includes(topic.name);

                  const hasSkill = resumeSkills.some(
                    (skill) =>
                      skillMatchesTopic(topic.name, skill)
                  );

                  const missingSkill =
                    missingSkills.find((skill) =>
                      skillMatchesTopic(topic.name, skill)
                    );

                  return (
                    <div
                      key={topic.name}
                      className={`rounded-xl border p-5 transition ${
                        isCompleted
                          ? "border-[#d4af37]/15 bg-[#d4af37]/[0.02]"
                          : "border-white/[0.06] bg-[#060606] hover:border-[#d4af37]/15"
                      }`}
                    >

                      <div className="flex items-start gap-4">

                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() =>
                            toggleTopic(topic.name)
                          }
                          className="mt-1 h-5 w-5 cursor-pointer accent-[#d4af37]"
                        />

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <span
                              className={
                                isCompleted
                                  ? "text-lg font-semibold text-gray-600 line-through"
                                  : "text-lg font-semibold text-gray-200"
                              }
                            >
                              {topic.name}
                            </span>

                            {hasSkill && (
                              <span className="rounded-full border border-emerald-500/15 bg-emerald-500/[0.05] px-2 py-0.5 text-xs text-emerald-400">
                                Already Have
                              </span>
                            )}

                            {missingSkill && (
                              <span className="rounded-full border border-[#d4af37]/15 bg-[#d4af37]/[0.05] px-2 py-0.5 text-xs text-[#d4af37]">
                                Priority
                              </span>
                            )}

                          </div>

                          {missingSkill && (
                            <p className="mt-2 text-xs text-[#c9aa45]">
                              Improve: {missingSkill}
                            </p>
                          )}

                          <div className="mt-4 grid gap-3 md:grid-cols-3">

                            <div className="rounded-lg border border-white/[0.04] bg-[#0a0a0a] p-4">

                              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#d4af37]">
                                Learn
                              </p>

                              <p className="mt-2 text-sm leading-6 text-gray-500">
                                {topic.learn}
                              </p>

                            </div>

                            <div className="rounded-lg border border-white/[0.04] bg-[#0a0a0a] p-4">

                              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#d4af37]">
                                Practice
                              </p>

                              <p className="mt-2 text-sm leading-6 text-gray-500">
                                {topic.practice}
                              </p>

                            </div>

                            <div className="rounded-lg border border-white/[0.04] bg-[#0a0a0a] p-4">

                              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#d4af37]">
                                Estimated Time
                              </p>

                              <p className="mt-2 text-sm leading-6 text-gray-500">
                                {topic.time}
                              </p>

                            </div>

                          </div>

                          {learningResources[topic.name] && (
                            <a
                              href={learningResources[topic.name]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 inline-flex items-center rounded-lg border border-[#d4af37]/20 bg-[#d4af37]/[0.05] px-4 py-2 text-sm font-medium text-[#d4af37] transition hover:border-[#d4af37]/40 hover:bg-[#d4af37]/[0.09]"
                            >
                              Start Learning →
                            </a>
                          )}

                          {isCompleted && (
                            <p className="mt-3 text-xs text-emerald-400">
                              ✓ Completed
                            </p>
                          )}

                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
            </section>
          ))}

        </div>

        {/* Completed */}
        {progress === 100 && (
          <div className="mt-8 rounded-2xl border border-[#d4af37]/25 bg-[#d4af37]/[0.035] p-6 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#d4af37]/20 bg-[#d4af37]/[0.06] text-xl">
              ✓
            </div>

            <h2 className="mt-4 text-2xl font-bold text-[#e6c35c]">
              Roadmap Completed!
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Great work! You have completed all the topics
              in this roadmap.
            </p>

          </div>
        )}

      </main>
    </div>
  );
}

export default CareerRoadmap;

