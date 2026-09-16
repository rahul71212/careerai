import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  MapPin,
  IndianRupee,
  CheckCircle,
  ExternalLink,
  Search,
  AlertCircle,
  Trophy,
} from "lucide-react";
import Navbar from "../components/Navbar";

function JobMatches() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [minMatch, setMinMatch] = useState("0");

  useEffect(() => {
    const resumeId = localStorage.getItem("resumeId");

    if (!resumeId) {
      setMessage("Please upload and analyze your resume first.");
      setLoading(false);
      return;
    }

    const fetchJobs = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/matches/${resumeId}`
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Unable to fetch jobs.");
          return;
        }

        setJobs(data);
      } catch (error) {
        console.error("Fetch jobs error:", error);
        setMessage("Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    const searchText = search.toLowerCase().trim();
    const minimum = Number(minMatch);

    return jobs.filter((job) => {
      const matchesSearch =
        !searchText ||
        job.title?.toLowerCase().includes(searchText) ||
        job.company?.toLowerCase().includes(searchText) ||
        job.location?.toLowerCase().includes(searchText) ||
        job.skills?.some((skill) =>
          skill.toLowerCase().includes(searchText)
        );

      const matchesPercentage =
        Number(job.matchPercentage || 0) >= minimum;

      return matchesSearch && matchesPercentage;
    });
  }, [jobs, search, minMatch]);

  const getMatchLabel = (percentage) => {
    if (percentage >= 80) {
      return {
        label: "Strong Match",
        text: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
      };
    }

    if (percentage >= 50) {
      return {
        label: "Good Match",
        text: "text-[#e6c35c]",
        bg: "bg-[#d4af37]/10",
        border: "border-[#d4af37]/20",
      };
    }

    return {
      label: "Low Match",
      text: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    };
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6">

        {/* Header */}
        <div className="text-center">

          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
              AI Powered
            </span>

            <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Job{" "}
            <span className="text-[#e6c35c]">
              Matches
            </span>
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
            Jobs ranked according to your resume skills.
          </p>
        </div>

        {/* Search & Filter */}
        {!loading && !message && jobs.length > 0 && (
          <div className="mt-8 grid gap-3 md:grid-cols-[1fr_220px]">

            {/* Search */}
            <div className="relative">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
              />

              <input
                type="text"
                placeholder="Search job, company, location or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] py-3 pl-11 pr-5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#d4af37]/40 focus:ring-1 focus:ring-[#d4af37]/10"
              />
            </div>

            {/* Minimum Match */}
            <select
              value={minMatch}
              onChange={(e) => setMinMatch(e.target.value)}
              className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] px-5 py-3 text-sm text-gray-300 outline-none transition focus:border-[#d4af37]/40 focus:ring-1 focus:ring-[#d4af37]/10"
            >
              <option value="0">All Matches</option>
              <option value="50">50%+ Match</option>
              <option value="70">70%+ Match</option>
              <option value="80">80%+ Match</option>
              <option value="90">90%+ Match</option>
            </select>

          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-10 rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-10 text-center">

            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-[#d4af37]" />

            <p className="mt-4 text-sm text-gray-600">
              Loading job matches...
            </p>

          </div>
        )}

        {/* Error */}
        {message && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-6 text-center">
            <AlertCircle
              size={22}
              className="mx-auto text-red-400"
            />

            <p className="mt-3 text-sm text-red-400">
              {message}
            </p>
          </div>
        )}

        {/* Job Count */}
        {!loading && !message && jobs.length > 0 && (
          <div className="mt-7 flex items-center justify-between">

            <p className="text-xs text-gray-600">
              Showing{" "}
              <span className="text-gray-400">
                {filteredJobs.length}
              </span>{" "}
              of{" "}
              <span className="text-gray-400">
                {jobs.length}
              </span>{" "}
              jobs
            </p>

            <p className="hidden text-xs text-gray-600 sm:block">
              Ranked by skill match
            </p>

          </div>
        )}

        {/* Jobs */}
        {!loading &&
          !message &&
          filteredJobs.length > 0 && (
            <div className="mt-4 grid gap-5 md:grid-cols-2">

              {filteredJobs.map((job, index) => {
                const match = Number(
                  job.matchPercentage || 0
                );

                const matchInfo =
                  getMatchLabel(match);

                const missingSkills =
                  job.skills?.filter(
                    (skill) =>
                      !job.matchedSkills?.includes(skill)
                  ) || [];

                return (
                  <div
                    key={job._id}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-5 transition duration-200 hover:-translate-y-1 hover:border-[#d4af37]/25 hover:bg-[#0c0c0c] sm:p-6"
                  >

                    {/* Subtle Gold Glow */}
                    <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[#d4af37]/[0.035] blur-3xl transition group-hover:bg-[#d4af37]/[0.06]" />

                    {/* Best Match */}
                    {index === 0 &&
                      !search &&
                      minMatch === "0" && (
                        <div className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/[0.07] px-3 py-1.5 text-[11px] font-semibold text-[#e6c35c]">
                          <Trophy size={13} />
                          Best Match
                        </div>
                      )}

                    {/* Job Header */}
                    <div className="relative flex items-start gap-3 pr-20">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d4af37]/15 bg-[#d4af37]/[0.07]">
                        <Briefcase
                          className="text-[#d4af37]"
                          size={22}
                        />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold text-gray-100">
                          {job.title}
                        </h2>

                        <p className="mt-1 text-sm font-medium text-[#e6c35c]">
                          {job.company}
                        </p>
                      </div>

                    </div>

                    {/* Job Details */}
                    <div className="relative mt-5 flex flex-wrap gap-2">

                      <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs text-gray-500">
                        <MapPin size={14} />
                        {job.location}
                      </div>

                      <div className="flex items-center gap-1.5 rounded-lg border border-[#d4af37]/10 bg-[#d4af37]/[0.03] px-3 py-2 text-xs text-[#c9aa45]">
                        <IndianRupee size={14} />
                        {job.salary}
                      </div>

                      <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs text-gray-500">
                        <Briefcase size={14} />
                        {job.jobType} • {job.experience}
                      </div>

                    </div>

                    {/* Description */}
                    <p className="relative mt-5 line-clamp-3 text-sm leading-6 text-gray-500">
                      {job.description}
                    </p>

                    {/* Required Skills */}
                    <div className="relative mt-5">

                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Required Skills
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {job.skills?.map(
                          (skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-2.5 py-1.5 text-xs text-gray-400 transition group-hover:border-[#d4af37]/10"
                            >
                              {skill}
                            </span>
                          )
                        )}

                      </div>
                    </div>

                    {/* Match Section */}
                    <div className="relative mt-6 rounded-xl border border-white/[0.06] bg-[#070707] p-4">

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-2.5">

                          <div
                            className={`rounded-lg border p-2 ${matchInfo.bg} ${matchInfo.border}`}
                          >
                            <CheckCircle
                              className={matchInfo.text}
                              size={18}
                            />
                          </div>

                          <div>
                            <p className="text-xs font-medium text-gray-400">
                              AI Skill Match
                            </p>

                            <span
                              className={`text-[11px] ${matchInfo.text}`}
                            >
                              {matchInfo.label}
                            </span>
                          </div>

                        </div>

                        <span
                          className={`text-2xl font-bold ${matchInfo.text}`}
                        >
                          {match}%
                        </span>

                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">

                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            match >= 80
                              ? "bg-emerald-500"
                              : match >= 50
                              ? "bg-[#d4af37]"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${match}%`,
                          }}
                        />

                      </div>

                      {/* Matched Skills */}
                      {job.matchedSkills?.length > 0 && (
                        <div className="mt-4">

                          <p className="text-[11px] font-semibold text-gray-500">
                            ✓ Your Matching Skills
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2">

                            {job.matchedSkills.map(
                              (skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className="rounded-lg border border-emerald-500/15 bg-emerald-500/[0.06] px-2.5 py-1 text-[11px] text-emerald-400"
                                >
                                  {skill}
                                </span>
                              )
                            )}

                          </div>
                        </div>
                      )}

                      {/* Missing Skills */}
                      {missingSkills.length > 0 && (
                        <div className="mt-4">

                          <p className="flex items-center gap-1 text-[11px] font-semibold text-gray-500">
                            <AlertCircle size={13} />
                            Skills to Improve
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2">

                            {missingSkills.map(
                              (skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className="rounded-lg border border-red-500/15 bg-red-500/[0.05] px-2.5 py-1 text-[11px] text-red-400"
                                >
                                  {skill}
                                </span>
                              )
                            )}

                          </div>
                        </div>
                      )}

                    </div>

                    {/* Apply */}
                    <button
                      onClick={() => {
                        if (job.applyLink) {
                          window.open(
                            job.applyLink,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        } else {
                          alert(
                            "Application link is not available yet."
                          );
                        }
                      }}
                      className="relative mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#d4af37] py-3 text-sm font-semibold text-black transition hover:bg-[#e6c35c] hover:shadow-[0_8px_24px_rgba(212,175,55,0.14)]"
                    >
                      Apply Now
                      <ExternalLink size={16} />
                    </button>

                  </div>
                );
              })}

            </div>
          )}

        {/* No Search Results */}
        {!loading &&
          !message &&
          jobs.length > 0 &&
          filteredJobs.length === 0 && (
            <div className="mt-8 rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-10 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#d4af37]/15 bg-[#d4af37]/[0.06]">
                <Search
                  size={22}
                  className="text-[#d4af37]"
                />
              </div>

              <p className="mt-4 text-sm font-medium text-gray-300">
                No matching jobs found.
              </p>

              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-gray-600">
                Try another keyword or lower the minimum match percentage.
              </p>

            </div>
          )}

        {/* No Jobs */}
        {!loading &&
          !message &&
          jobs.length === 0 && (
            <div className="mt-8 rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-10 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#d4af37]/15 bg-[#d4af37]/[0.06]">
                <Briefcase
                  size={22}
                  className="text-[#d4af37]"
                />
              </div>

              <p className="mt-4 text-sm text-gray-500">
                No jobs available right now.
              </p>

            </div>
          )}

      </main>
    </div>
  );
}

export default JobMatches;