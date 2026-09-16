import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  MapPin,
  IndianRupee,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Navbar from "../components/Navbar";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isApplied, setIsApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/jobs/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to fetch job"
          );
        }

        setJob(data);
      } catch (error) {
        console.error("Fetch job error:", error);
        setError(
          error.message || "Unable to load job details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  useEffect(() => {
    const fetchApplication = async () => {
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

        const applications = await response.json();

        const alreadyApplied = applications.some(
          (application) =>
            application.job?._id === id
        );

        setIsApplied(alreadyApplied);
      } catch (error) {
        console.error(
          "Fetch application error:",
          error
        );
      }
    };

    fetchApplication();
  }, [id]);

  const handleApply = async () => {
    setMessage("");

    const userData = localStorage.getItem("user");

    if (!userData) {
      setMessage("Please login before applying.");
      return;
    }

    let user;

    try {
      user = JSON.parse(userData);
    } catch (error) {
      setMessage(
        "Invalid login session. Please login again."
      );
      return;
    }

    const userId = user._id || user.id;

    if (!userId) {
      setMessage(
        "User information not found. Please login again."
      );
      return;
    }

    if (isApplied) {
      setMessage(
        "You have already applied for this job."
      );

      if (job?.applyLink) {
        window.open(
          job.applyLink,
          "_blank",
          "noopener,noreferrer"
        );
      }

      return;
    }

    try {
      setApplying(true);

      const response = await fetch(
        "http://localhost:5000/api/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            jobId: id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to save application."
        );
        return;
      }

      setIsApplied(true);
      setMessage(
        "Application saved successfully!"
      );

      if (job?.applyLink) {
        window.open(
          job.applyLink,
          "_blank",
          "noopener,noreferrer"
        );
      }
    } catch (error) {
      console.error("Apply error:", error);

      setMessage(
        "Unable to save application. Please try again."
      );
    } finally {
      setApplying(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2
              className="animate-spin text-[#d4af37]"
              size={34}
            />

            <p className="mt-3 text-sm text-gray-600">
              Loading job details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <Navbar />

        <main className="mx-auto max-w-5xl px-5 py-12 sm:px-6">
          <div className="rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#d4af37]/20 bg-[#d4af37]/[0.08] text-[#d4af37]">
              !
            </div>

            <h1 className="mt-5 text-2xl font-semibold">
              Job Not Found
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              {error || "This job is unavailable."}
            </p>

            <Link
              to="/jobs"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#d4af37] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#e6c35c] hover:shadow-[0_8px_25px_rgba(212,175,55,0.16)]"
            >
              <ArrowLeft size={17} />
              Back to Jobs
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-9 sm:px-6 lg:px-8">

        {/* Back */}
        <button
          onClick={() => navigate("/jobs")}
          className="mb-7 flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#e6c35c]"
        >
          <ArrowLeft size={17} />
          Back to Jobs
        </button>

        {/* Hero / Job Header */}
        <section className="rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-5 shadow-[0_15px_50px_rgba(0,0,0,0.25)] sm:p-7">

          <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">

            {/* Job info */}
            <div className="min-w-0">

              <div className="flex items-start gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/[0.08]">
                  <BriefcaseBusiness
                    size={25}
                    className="text-[#d4af37]"
                  />
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">
                    {job.title}
                  </h1>

                  <p className="mt-1.5 text-sm font-medium text-[#e6c35c]">
                    {job.company}
                  </p>
                </div>

              </div>

              {/* Job metadata */}
              <div className="mt-6 flex flex-wrap gap-2">

                <span className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-xs text-gray-400">
                  <MapPin size={14} />
                  {job.location}
                </span>

                <span className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-xs text-gray-400">
                  <Clock size={14} />
                  {job.jobType}
                </span>

                <span className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-xs text-gray-400">
                  <BriefcaseBusiness size={14} />
                  {job.experience}
                </span>

                <span className="flex items-center gap-1.5 rounded-lg border border-[#d4af37]/15 bg-[#d4af37]/[0.05] px-3 py-2 text-xs text-[#e6c35c]">
                  <IndianRupee size={14} />
                  {job.salary}
                </span>

              </div>
            </div>

            {/* Apply box */}
            <div className="w-full shrink-0 lg:w-auto">

              <button
                onClick={handleApply}
                disabled={applying}
                className={`flex w-full items-center justify-center gap-2 rounded-lg px-7 py-3 text-sm font-semibold transition lg:w-auto ${
                  isApplied
                    ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15"
                    : "bg-[#d4af37] text-black hover:bg-[#e6c35c] hover:shadow-[0_8px_25px_rgba(212,175,55,0.18)]"
                } ${
                  applying
                    ? "cursor-not-allowed opacity-60"
                    : ""
                }`}
              >
                {applying ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : isApplied ? (
                  <>
                    <CheckCircle size={17} />
                    Applied ✓
                  </>
                ) : (
                  "Apply Now"
                )}
              </button>

              {message && (
                <p className="mt-2 max-w-xs text-xs leading-5 text-gray-500 lg:text-right">
                  {message}
                </p>
              )}

            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_300px]">

          {/* Description */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-5 sm:p-7">

            <div className="flex items-center gap-3">
              <div className="h-5 w-1 rounded-full bg-[#d4af37]" />

              <h2 className="text-lg font-semibold text-gray-100">
                Job Description
              </h2>
            </div>

            <div className="mt-5 border-t border-white/[0.06] pt-5">
              <p className="whitespace-pre-line text-sm leading-7 text-gray-500">
                {job.description}
              </p>
            </div>

          </section>

          {/* Skills */}
          {job.skills?.length > 0 && (
            <section className="h-fit rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-5 sm:p-6">

              <div className="flex items-center gap-3">
                <div className="h-5 w-1 rounded-full bg-[#d4af37]" />

                <h2 className="text-lg font-semibold text-gray-100">
                  Required Skills
                </h2>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">

                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-[#d4af37]/15 bg-[#d4af37]/[0.05] px-3 py-1.5 text-xs font-medium text-[#d9b94f] transition hover:border-[#d4af37]/30 hover:bg-[#d4af37]/[0.09]"
                  >
                    {skill}
                  </span>
                ))}

              </div>
            </section>
          )}

        </div>

        {/* Bottom CTA */}
        <section className="mt-5 overflow-hidden rounded-2xl border border-[#d4af37]/15 bg-gradient-to-r from-[#110e06] to-[#0a0a0a] p-6 sm:p-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4af37]">
                Ready to apply?
              </p>

              <h2 className="mt-1.5 text-xl font-semibold text-gray-100">
                Interested in this opportunity?
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Apply now and track your application
                from your dashboard.
              </p>
            </div>

            <button
              onClick={handleApply}
              disabled={applying}
              className={`shrink-0 rounded-lg px-6 py-3 text-sm font-semibold transition ${
                isApplied
                  ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15"
                  : "bg-[#d4af37] text-black hover:bg-[#e6c35c] hover:shadow-[0_8px_25px_rgba(212,175,55,0.16)]"
              }`}
            >
              {applying
                ? "Saving..."
                : isApplied
                ? "Applied ✓"
                : "Apply Now"}
            </button>

          </div>
        </section>

      </main>
    </div>
  );
}

export default JobDetails;