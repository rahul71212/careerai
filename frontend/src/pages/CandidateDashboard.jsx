import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Video,
  BriefcaseBusiness,
  Map,
  User,
  LogOut,
  LayoutDashboard,
  Target,
  Trophy,
  Code2,
  ArrowRight,
  Loader2,
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

function CandidateDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // =========================
        // 1. Fetch Profile
        // =========================

        const profileResponse = await fetch(
          "http://localhost:5000/api/auth/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const profileData = await profileResponse.json();

        if (!profileResponse.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        setUser(profileData.user);

        localStorage.setItem(
          "user",
          JSON.stringify(profileData.user)
        );

        const userId =
          profileData.user._id || profileData.user.id;

        // =========================
        // 2. Fetch Resume Analysis
        // =========================

        const resumeId = localStorage.getItem("resumeId");

        if (resumeId) {
          const resumeResponse = await fetch(
            `http://localhost:5000/api/resume/${resumeId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (resumeResponse.ok) {
            const resumeData =
              await resumeResponse.json();

            if (resumeData.analysis) {
              setAnalysis(resumeData.analysis);
            }
          }

          // =========================
          // 3. Fetch Job Matches
          // =========================

          const jobsResponse = await fetch(
            `http://localhost:5000/api/matches/${resumeId}`
          );

          if (jobsResponse.ok) {
            const jobsData = await jobsResponse.json();

            if (Array.isArray(jobsData)) {
              setJobs(jobsData);
            }
          }
        }

        // =========================
        // 4. Fetch Applications
        // =========================

        if (userId) {
          const applicationsResponse = await fetch(
            `http://localhost:5000/api/applications/${userId}`
          );

          if (applicationsResponse.ok) {
            const applicationsData =
              await applicationsResponse.json();

            if (Array.isArray(applicationsData)) {
              setApplications(applicationsData);
            }
          }
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("resumeId");

    navigate("/login");
  };

  // =========================
  // Loading Screen
  // =========================

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <Loader2
          className="animate-spin text-[#d4af37]"
          size={32}
        />
      </div>
    );
  }

  // =========================
  // Best Job Match
  // =========================

  const bestMatch =
    jobs.length > 0 ? jobs[0] : null;

  // =========================
  // Application Stats
  // =========================

  const totalApplications = applications.length;

  const appliedCount = applications.filter(
    (application) =>
      application.status === "Applied"
  ).length;

  const interviewCount = applications.filter(
    (application) =>
      application.status === "Interview"
  ).length;

  const selectedCount = applications.filter(
    (application) =>
      application.status === "Selected"
  ).length;

  const rejectedCount = applications.filter(
    (application) =>
      application.status === "Rejected"
  ).length;

  const recentApplications =
    applications.slice(0, 5);

  // =========================
  // Status Style
  // =========================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Selected":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";

      case "Interview":
        return "bg-blue-500/10 text-blue-400 border-blue-500/25";

      case "Rejected":
        return "bg-red-500/10 text-red-400 border-red-500/25";

      default:
        return "bg-[#d4af37]/10 text-[#e6c35c] border-[#d4af37]/25";
    }
  };

  // =========================
  // Career Tools
  // =========================

  const features = [
    {
      title: "Resume Analyzer",
      description:
        "Analyze your resume and improve your ATS score.",
      icon: FileText,
      link: "/resume-analyzer",
    },
    {
      title: "AI Mock Interview",
      description:
        "Practice interviews and get AI-powered feedback.",
      icon: Video,
      link: "/ai-interview",
    },
    {
      title: "Find Jobs",
      description:
        "Explore jobs that match your skills and profile.",
      icon: BriefcaseBusiness,
      link: "/jobs",
    },
    {
      title: "Career Roadmap",
      description:
        "Build a personalized roadmap for your career.",
      icon: Map,
      link: "/career-roadmap",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* =========================
          Header
      ========================= */}

      <header className="border-b border-white/[0.06] bg-[#080808]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">

          <Link
            to="/"
            className="group flex items-center gap-2"
          >
            <LayoutDashboard
              className="text-[#d4af37] transition group-hover:text-[#e6c35c]"
              size={25}
            />

            <span className="text-xl font-semibold tracking-tight">
              Career<span className="text-[#d4af37]">AI</span>
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-white/[0.08] px-4 py-2 text-sm text-gray-400 transition hover:border-red-500/30 hover:bg-red-500/[0.04] hover:text-red-400"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>
      </header>

      {/* =========================
          Main
      ========================= */}

      <main className="mx-auto max-w-7xl px-5 py-9 sm:px-6">

        {/* =========================
            Welcome
        ========================= */}

        <div className="rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-6 sm:p-8">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#d4af37]/20 bg-[#d4af37]/[0.08]">
              <User
                size={27}
                className="text-[#d4af37]"
              />
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Welcome back
              </p>

              <h1 className="mt-0.5 text-2xl font-semibold sm:text-3xl">
                {user.name}
              </h1>

              <p className="mt-0.5 text-sm text-gray-500">
                {user.email}
              </p>
            </div>

          </div>
        </div>

        {/* =========================
            Main Stats
        ========================= */}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* ATS Score */}

          <div className="group rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-5 transition hover:border-[#d4af37]/20">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-600">
                  ATS Score
                </p>

                <p className="mt-2 text-3xl font-semibold">
                  {loadingData
                    ? "..."
                    : analysis?.atsScore !== undefined
                    ? `${analysis.atsScore}%`
                    : "--"}
                </p>
              </div>

              <div className="rounded-xl border border-[#d4af37]/15 bg-[#d4af37]/[0.07] p-3">
                <Target
                  className="text-[#d4af37]"
                  size={22}
                />
              </div>

            </div>
          </div>

          {/* Job Matches */}

          <div className="group rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-5 transition hover:border-[#d4af37]/20">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-600">
                  Job Matches
                </p>

                <p className="mt-2 text-3xl font-semibold">
                  {loadingData ? "..." : jobs.length}
                </p>
              </div>

              <div className="rounded-xl border border-[#d4af37]/15 bg-[#d4af37]/[0.07] p-3">
                <BriefcaseBusiness
                  className="text-[#d4af37]"
                  size={22}
                />
              </div>

            </div>
          </div>

          {/* Best Match */}

          <div className="group rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-5 transition hover:border-[#d4af37]/20">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-600">
                  Best Match
                </p>

                <p className="mt-2 text-3xl font-semibold">
                  {loadingData
                    ? "..."
                    : bestMatch
                    ? `${bestMatch.matchPercentage}%`
                    : "--"}
                </p>
              </div>

              <div className="rounded-xl border border-[#d4af37]/15 bg-[#d4af37]/[0.07] p-3">
                <Trophy
                  className="text-[#d4af37]"
                  size={22}
                />
              </div>

            </div>
          </div>

          {/* Total Applications */}

          <div className="group rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-5 transition hover:border-[#d4af37]/20">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-600">
                  Applications
                </p>

                <p className="mt-2 text-3xl font-semibold">
                  {loadingData
                    ? "..."
                    : totalApplications}
                </p>
              </div>

              <div className="rounded-xl border border-[#d4af37]/15 bg-[#d4af37]/[0.07] p-3">
                <ClipboardList
                  className="text-[#d4af37]"
                  size={22}
                />
              </div>

            </div>
          </div>

        </div>

        {/* =========================
            Application Overview
        ========================= */}

        <div className="mt-6 rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-5 sm:p-6">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

            <div>
              <h2 className="text-lg font-semibold">
                Application Overview
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Track your job application progress.
              </p>
            </div>

            <Link
              to="/my-applications"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#d4af37] transition hover:text-[#e6c35c]"
            >
              View Applications
              <ArrowRight size={15} />
            </Link>

          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {/* Applied */}

            <div className="rounded-xl border border-white/[0.06] bg-[#070707] p-4 transition hover:border-[#d4af37]/15">

              <div className="flex items-center gap-3">

                <div className="rounded-lg border border-[#d4af37]/15 bg-[#d4af37]/[0.07] p-2">
                  <Clock
                    className="text-[#d4af37]"
                    size={19}
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-600">
                    Applied
                  </p>

                  <p className="text-xl font-semibold">
                    {loadingData
                      ? "..."
                      : appliedCount}
                  </p>
                </div>

              </div>
            </div>

            {/* Interview */}

            <div className="rounded-xl border border-white/[0.06] bg-[#070707] p-4 transition hover:border-blue-500/20">

              <div className="flex items-center gap-3">

                <div className="rounded-lg bg-blue-500/[0.08] p-2">
                  <Video
                    className="text-blue-400"
                    size={19}
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-600">
                    Interviews
                  </p>

                  <p className="text-xl font-semibold">
                    {loadingData
                      ? "..."
                      : interviewCount}
                  </p>
                </div>

              </div>
            </div>

            {/* Selected */}

            <div className="rounded-xl border border-white/[0.06] bg-[#070707] p-4 transition hover:border-emerald-500/20">

              <div className="flex items-center gap-3">

                <div className="rounded-lg bg-emerald-500/[0.08] p-2">
                  <CheckCircle
                    className="text-emerald-400"
                    size={19}
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-600">
                    Selected
                  </p>

                  <p className="text-xl font-semibold">
                    {loadingData
                      ? "..."
                      : selectedCount}
                  </p>
                </div>

              </div>
            </div>

            {/* Rejected */}

            <div className="rounded-xl border border-white/[0.06] bg-[#070707] p-4 transition hover:border-red-500/20">

              <div className="flex items-center gap-3">

                <div className="rounded-lg bg-red-500/[0.08] p-2">
                  <XCircle
                    className="text-red-400"
                    size={19}
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-600">
                    Rejected
                  </p>

                  <p className="text-xl font-semibold">
                    {loadingData
                      ? "..."
                      : rejectedCount}
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* =========================
            Recent Applications
        ========================= */}

        {recentApplications.length > 0 && (
          <div className="mt-6 rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-5 sm:p-6">

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

              <div>
                <h2 className="text-lg font-semibold">
                  Recent Applications
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Your latest job applications.
                </p>
              </div>

              <Link
                to="/my-applications"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#d4af37] transition hover:text-[#e6c35c]"
              >
                View All
                <ArrowRight size={15} />
              </Link>

            </div>

            <div className="mt-5 space-y-2">

              {recentApplications.map(
                (application) => {
                  const job = application.job;

                  return (
                    <div
                      key={application._id}
                      className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-[#070707] p-4 transition hover:border-[#d4af37]/15 md:flex-row md:items-center md:justify-between"
                    >

                      <div>
                        <h3 className="font-medium text-gray-200">
                          {job?.title ||
                            "Job unavailable"}
                        </h3>

                        <p className="mt-1 text-sm text-[#c9aa45]">
                          {job?.company ||
                            "Company unavailable"}
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                          {job?.location ||
                            "Location not specified"}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full border px-3.5 py-1.5 text-xs font-medium ${getStatusStyle(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>

                    </div>
                  );
                }
              )}

            </div>
          </div>
        )}

        {/* =========================
            Resume Summary
        ========================= */}

        {analysis?.summary && (
          <div className="mt-6 rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-5 sm:p-6">

            <div className="flex items-center gap-2">

              <FileText
                className="text-[#d4af37]"
                size={19}
              />

              <h2 className="text-lg font-semibold">
                Resume Summary
              </h2>

            </div>

            <p className="mt-4 text-sm leading-7 text-gray-500">
              {analysis.summary}
            </p>

          </div>
        )}

        {/* =========================
            Best Job Recommendation
        ========================= */}

        {bestMatch && (
          <div className="relative mt-6 overflow-hidden rounded-2xl border border-[#d4af37]/20 bg-gradient-to-br from-[#120f06] via-[#0b0b0b] to-[#070707] p-5 sm:p-6">

            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#d4af37]/[0.06] blur-3xl" />

            <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">

              <div>

                <div className="flex items-center gap-2">

                  <Trophy
                    className="text-[#d4af37]"
                    size={20}
                  />

                  <span className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                    Best Job Recommendation
                  </span>

                </div>

                <h2 className="mt-2 text-2xl font-semibold">
                  {bestMatch.title}
                </h2>

                <p className="mt-1 text-sm font-medium text-[#e6c35c]">
                  {bestMatch.company}
                </p>

                <p className="mt-3 text-sm text-gray-500">
                  📍 {bestMatch.location}
                </p>

                {bestMatch.salary && (
                  <p className="mt-1 text-sm text-gray-500">
                    💰 {bestMatch.salary}
                  </p>
                )}

              </div>

              <div className="text-left md:text-right">

                <p className="text-xs uppercase tracking-wider text-gray-600">
                  Skill Match
                </p>

                <p className="mt-1 text-4xl font-bold text-[#e6c35c]">
                  {bestMatch.matchPercentage}%
                </p>

                <Link
                  to="/job-matches"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#d4af37] transition hover:text-[#e6c35c]"
                >
                  View all matches
                  <ArrowRight size={15} />
                </Link>

              </div>

            </div>
          </div>
        )}

        {/* =========================
            Skills
        ========================= */}

        {analysis?.skills?.length > 0 && (
          <div className="mt-6 rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-5 sm:p-6">

            <div className="flex items-center gap-2">

              <Code2
                className="text-[#d4af37]"
                size={19}
              />

              <h2 className="text-lg font-semibold">
                Your Skills
              </h2>

            </div>

            <div className="mt-4 flex flex-wrap gap-2">

              {analysis.skills.map(
                (skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-lg border border-[#d4af37]/15 bg-[#d4af37]/[0.05] px-3 py-1.5 text-xs text-[#c9aa45] transition hover:border-[#d4af37]/30 hover:text-[#e6c35c]"
                  >
                    {skill}
                  </span>
                )
              )}

            </div>
          </div>
        )}

        {/* =========================
            Career Tools
        ========================= */}

        <div className="mt-9">

          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
                Tools
              </span>
            </div>

            <h2 className="mt-1 text-2xl font-semibold">
              Career Tools
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Link
                  key={feature.title}
                  to={feature.link}
                  className="group rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-5 transition duration-200 hover:-translate-y-1 hover:border-[#d4af37]/25 hover:bg-[#0c0c0c]"
                >

                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#d4af37]/15 bg-[#d4af37]/[0.07] text-[#d4af37]">
                    <Icon size={22} />
                  </div>

                  <h2 className="text-base font-semibold">
                    {feature.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {feature.description}
                  </p>

                  <p className="mt-5 flex items-center gap-1 text-sm font-semibold text-[#d4af37]">
                    Explore
                    <ArrowRight
                      size={15}
                      className="transition group-hover:translate-x-1"
                    />
                  </p>

                </Link>
              );
            })}

          </div>
        </div>

      </main>
    </div>
  );
}

export default CandidateDashboard;