import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [jobType, setJobType] = useState("All");
  const [experience, setExperience] = useState("All");
  const [salary, setSalary] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  // Applications
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [applyingJob, setApplyingJob] = useState("");
  const [applicationMessage, setApplicationMessage] = useState("");

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/jobs"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();
        setJobs(data);
      } catch (err) {
        console.error("Fetch jobs error:", err);
        setError("Unable to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch user's existing applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const userData = localStorage.getItem("user");

        if (!userData) return;

        const user = JSON.parse(userData);
        const userId = user._id || user.id;

        if (!userId) return;

        const response = await fetch(
          `http://localhost:5000/api/applications/${userId}`
        );

        if (!response.ok) return;

        const data = await response.json();

        setAppliedJobs(
          data
            .map((application) => application.job?._id)
            .filter(Boolean)
        );
      } catch (error) {
        console.error("Fetch applications error:", error);
      }
    };

    fetchApplications();
  }, []);

  // Apply for job
  const handleApply = async (job) => {
    setApplicationMessage("");

    const userData = localStorage.getItem("user");

    if (!userData) {
      setApplicationMessage("Please login before applying.");
      return;
    }

    let user;

    try {
      user = JSON.parse(userData);
    } catch (error) {
      setApplicationMessage(
        "Invalid login session. Please login again."
      );
      return;
    }

    const userId = user._id || user.id;

    if (!userId) {
      setApplicationMessage(
        "User information not found. Please login again."
      );
      return;
    }

    // Already applied
    if (appliedJobs.includes(job._id)) {
      if (job.applyLink) {
        window.open(
          job.applyLink,
          "_blank",
          "noopener,noreferrer"
        );
      }

      setApplicationMessage(
        "You have already applied for this job."
      );

      return;
    }

    try {
      setApplyingJob(job._id);

      const response = await fetch(
        "http://localhost:5000/api/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            jobId: job._id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setApplicationMessage(
          data.message || "Unable to apply for this job."
        );
        return;
      }

      setAppliedJobs((previous) => [
        ...previous,
        job._id,
      ]);

      setApplicationMessage(
        "Application saved successfully!"
      );

      if (job.applyLink) {
        window.open(
          job.applyLink,
          "_blank",
          "noopener,noreferrer"
        );
      }
    } catch (error) {
      console.error("Apply job error:", error);

      setApplicationMessage(
        "Unable to save application. Please try again."
      );
    } finally {
      setApplyingJob("");
    }
  };

  // Dynamic filter options
  const locations = useMemo(() => {
    const values = jobs.flatMap((job) =>
      job.location
        ? job.location
            .split("/")
            .map((item) => item.trim())
        : []
    );

    return ["All", ...new Set(values)];
  }, [jobs]);

  const jobTypes = useMemo(() => {
    const values = jobs
      .map((job) => job.jobType)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [jobs]);

  const experiences = useMemo(() => {
    const values = jobs
      .map((job) => job.experience)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [jobs]);

  // Convert salary text into number
  const getSalaryNumber = (salaryText) => {
    if (!salaryText) return 0;

    const text = salaryText
      .toString()
      .toLowerCase()
      .replace(/,/g, "");

    const numbers = text.match(/\d+(?:\.\d+)?/g);

    if (!numbers || numbers.length === 0) {
      return 0;
    }

    let value = Number(numbers[0]);

    if (text.includes("lpa")) {
      value = value * 100000;
    }

    if (text.includes("k")) {
      value = value * 1000;
    }

    return value;
  };

  // Filter + Sort
  const filteredJobs = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    const result = jobs.filter((job) => {
      const matchesSearch =
        !searchText ||
        job.title
          ?.toLowerCase()
          .includes(searchText) ||
        job.company
          ?.toLowerCase()
          .includes(searchText) ||
        job.skills?.some((skill) =>
          skill.toLowerCase().includes(searchText)
        );

      const matchesLocation =
        location === "All" ||
        job.location
          ?.toLowerCase()
          .includes(location.toLowerCase());

      const matchesJobType =
        jobType === "All" ||
        job.jobType === jobType;

      const matchesExperience =
        experience === "All" ||
        job.experience === experience;

      const salaryValue = getSalaryNumber(job.salary);

      let matchesSalary = true;

      if (salary === "0-3") {
        matchesSalary =
          salaryValue > 0 &&
          salaryValue <= 300000;
      } else if (salary === "3-6") {
        matchesSalary =
          salaryValue > 300000 &&
          salaryValue <= 600000;
      } else if (salary === "6-10") {
        matchesSalary =
          salaryValue > 600000 &&
          salaryValue <= 1000000;
      } else if (salary === "10+") {
        matchesSalary =
          salaryValue > 1000000;
      }

      return (
        matchesSearch &&
        matchesLocation &&
        matchesJobType &&
        matchesExperience &&
        matchesSalary
      );
    });

    if (sortBy === "latest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    if (sortBy === "salary-high") {
      result.sort(
        (a, b) =>
          getSalaryNumber(b.salary) -
          getSalaryNumber(a.salary)
      );
    }

    if (sortBy === "salary-low") {
      result.sort(
        (a, b) =>
          getSalaryNumber(a.salary) -
          getSalaryNumber(b.salary)
      );
    }

    if (sortBy === "company") {
      result.sort((a, b) =>
        (a.company || "").localeCompare(
          b.company || ""
        )
      );
    }

    return result;
  }, [
    jobs,
    search,
    location,
    jobType,
    experience,
    salary,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearch("");
    setLocation("All");
    setJobType("All");
    setExperience("All");
    setSalary("All");
    setSortBy("latest");
  };

  const hasActiveFilters =
    search ||
    location !== "All" ||
    jobType !== "All" ||
    experience !== "All" ||
    salary !== "All" ||
    sortBy !== "latest";

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <section className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
              Career Opportunities
            </span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Find your next{" "}
            <span className="text-[#e6c35c]">
              opportunity.
            </span>
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Discover jobs that match your skills,
            experience and career goals.
          </p>
        </section>

        {/* Search + Filters */}
        <section className="rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-4 shadow-[0_15px_50px_rgba(0,0,0,0.35)]">

          {/* Search */}
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37]">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search by job title, company or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/[0.07] bg-[#070707] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#d4af37]/60 focus:ring-1 focus:ring-[#d4af37]/20"
            />
          </div>

          {/* Filters */}
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-xl border border-white/[0.07] bg-[#070707] px-3.5 py-3 text-sm text-gray-300 outline-none transition focus:border-[#d4af37]/60"
            >
              {locations.map((item) => (
                <option key={item} value={item}>
                  {item === "All"
                    ? "All Locations"
                    : item}
                </option>
              ))}
            </select>

            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="rounded-xl border border-white/[0.07] bg-[#070707] px-3.5 py-3 text-sm text-gray-300 outline-none transition focus:border-[#d4af37]/60"
            >
              {jobTypes.map((item) => (
                <option key={item} value={item}>
                  {item === "All"
                    ? "All Job Types"
                    : item}
                </option>
              ))}
            </select>

            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="rounded-xl border border-white/[0.07] bg-[#070707] px-3.5 py-3 text-sm text-gray-300 outline-none transition focus:border-[#d4af37]/60"
            >
              {experiences.map((item) => (
                <option key={item} value={item}>
                  {item === "All"
                    ? "All Experience"
                    : item}
                </option>
              ))}
            </select>

            <select
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="rounded-xl border border-white/[0.07] bg-[#070707] px-3.5 py-3 text-sm text-gray-300 outline-none transition focus:border-[#d4af37]/60"
            >
              <option value="All">All Salaries</option>
              <option value="0-3">Up to ₹3 LPA</option>
              <option value="3-6">₹3 - ₹6 LPA</option>
              <option value="6-10">₹6 - ₹10 LPA</option>
              <option value="10+">₹10+ LPA</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-white/[0.07] bg-[#070707] px-3.5 py-3 text-sm text-gray-300 outline-none transition focus:border-[#d4af37]/60"
            >
              <option value="latest">Latest Jobs</option>
              <option value="salary-high">
                Salary: High to Low
              </option>
              <option value="salary-low">
                Salary: Low to High
              </option>
              <option value="company">
                Company: A-Z
              </option>
            </select>

          </div>
        </section>

        {/* Result Bar */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-200">
              {filteredJobs.length}
            </span>{" "}
            {filteredJobs.length === 1
              ? "job"
              : "jobs"}{" "}
            found
          </p>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="rounded-lg border border-white/[0.08] px-3.5 py-2 text-xs font-medium text-gray-400 transition hover:border-[#d4af37]/40 hover:text-[#e6c35c]"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Application Message */}
        {applicationMessage && (
          <div className="mt-4 rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/[0.06] px-4 py-3 text-sm text-[#e6c35c]">
            {applicationMessage}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-12 text-center">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-[#d4af37]" />

            <p className="mt-3 text-sm text-gray-500">
              Loading jobs...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/[0.05] p-5 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* No Jobs */}
        {!loading &&
          !error &&
          filteredJobs.length === 0 && (
            <div className="mt-10 rounded-2xl border border-white/[0.07] bg-[#0a0a0a] px-6 py-14 text-center">

              <div className="text-3xl text-[#d4af37]/60">
                ⌕
              </div>

              <p className="mt-4 text-base font-semibold text-gray-200">
                No jobs found
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Try changing your search or filters.
              </p>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-5 rounded-lg bg-[#d4af37] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#e6c35c] hover:shadow-[0_5px_20px_rgba(212,175,55,0.18)]"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

        {/* Job Cards */}
        {!loading &&
          !error &&
          filteredJobs.length > 0 && (
            <div className="mt-7 grid gap-4 lg:grid-cols-2">

              {filteredJobs.map((job) => {
                const isApplied =
                  appliedJobs.includes(job._id);

                const isApplying =
                  applyingJob === job._id;

                return (
                  <article
                    key={job._id}
                    className="group rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#d4af37]/30 hover:bg-[#0d0d0d] hover:shadow-[0_10px_35px_rgba(0,0,0,0.45)]"
                  >

                    {/* Top */}
                    <div className="flex items-start justify-between gap-4">

                      <div className="flex min-w-0 gap-3">

                        {/* Company Logo */}
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/[0.08] text-sm font-bold text-[#e6c35c]">
                          {job.company
                            ?.charAt(0)
                            ?.toUpperCase() || "J"}
                        </div>

                        <div className="min-w-0">
                          <Link
                            to={`/jobs/${job._id}`}
                            className="block truncate text-lg font-semibold text-gray-100 transition group-hover:text-[#e6c35c]"
                          >
                            {job.title}
                          </Link>

                          <p className="mt-1 truncate text-sm text-gray-500">
                            {job.company}
                          </p>
                        </div>

                      </div>

                      <span className="shrink-0 rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-gray-400">
                        {job.jobType}
                      </span>

                    </div>

                    {/* Info */}
                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">

                      <span>
                        📍 {job.location}
                      </span>

                      <span>
                        💼 {job.experience}
                      </span>

                      <span className="font-medium text-[#d4af37]">
                        ₹ {job.salary}
                      </span>

                    </div>

                    {/* Description */}
                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-500">
                      {job.description}
                    </p>

                    {/* Skills */}
                    {job.skills?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">

                        {job.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md border border-white/[0.06] bg-white/[0.025] px-2.5 py-1 text-[11px] text-gray-400 transition group-hover:border-[#d4af37]/15"
                          >
                            {skill}
                          </span>
                        ))}

                      </div>
                    )}

                    {/* Bottom */}
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">

                      <Link
                        to={`/jobs/${job._id}`}
                        className="text-xs font-medium text-gray-400 transition hover:text-white"
                      >
                        View details →
                      </Link>

                      {job.applyLink && (
                        <button
                          onClick={() => handleApply(job)}
                          disabled={isApplying}
                          className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                            isApplied
                              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15"
                              : "bg-[#d4af37] text-black hover:bg-[#e6c35c] hover:shadow-[0_5px_20px_rgba(212,175,55,0.20)]"
                          } ${
                            isApplying
                              ? "cursor-not-allowed opacity-60"
                              : ""
                          }`}
                        >
                          {isApplying
                            ? "Saving..."
                            : isApplied
                            ? "Applied ✓"
                            : "Apply Now"}
                        </button>
                      )}

                    </div>

                  </article>
                );
              })}

            </div>
          )}

      </main>
    </div>
  );
}

export default Jobs;