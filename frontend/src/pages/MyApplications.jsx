import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  MapPin,
  Trash2,
} from "lucide-react";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const userData = localStorage.getItem("user");

        if (!userData) {
          setError("Please login to view your applications.");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userData);
        const userId = user._id || user.id;

        if (!userId) {
          setError("User information not found. Please login again.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/applications/${userId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to fetch applications"
          );
        }

        setApplications(data);
      } catch (err) {
        console.error("Fetch applications error:", err);
        setError(
          err.message || "Unable to load applications."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Selected":
        return "border-emerald-500/25 bg-emerald-500/10 text-emerald-400";

      case "Interview":
        return "border-blue-500/25 bg-blue-500/10 text-blue-400";

      case "Rejected":
        return "border-red-500/25 bg-red-500/10 text-red-400";

      default:
        return "border-[#d4af37]/25 bg-[#d4af37]/10 text-[#e6c35c]";
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Update application status
  const handleStatusChange = async (
    applicationId,
    newStatus
  ) => {
    try {
      setUpdatingId(applicationId);

      const response = await fetch(
        `http://localhost:5000/api/applications/${applicationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update status"
        );
      }

      setApplications((previous) =>
        previous.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                status: newStatus,
              }
            : application
        )
      );
    } catch (err) {
      console.error("Update status error:", err);

      alert(
        err.message || "Unable to update application status."
      );
    } finally {
      setUpdatingId("");
    }
  };

  // Delete application
  const handleDelete = async (applicationId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this application?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/${applicationId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to remove application"
        );
      }

      setApplications((previous) =>
        previous.filter(
          (application) =>
            application._id !== applicationId
        )
      );
    } catch (err) {
      console.error("Delete application error:", err);

      alert(
        err.message || "Unable to remove application."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <section className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
              Career Tracking
            </span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            My{" "}
            <span className="text-[#e6c35c]">
              Applications
            </span>
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Track and manage the jobs you have applied for.
          </p>
        </section>

        {/* Loading */}
        {loading && (
          <div className="mt-8 rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-10 text-center">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-[#d4af37]" />

            <p className="mt-4 text-sm text-gray-500">
              Loading your applications...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-8 text-center">
            <p className="text-sm text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          applications.length === 0 && (
            <div className="mt-8 rounded-2xl border border-white/[0.07] bg-[#0a0a0a] px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/[0.07]">
                <BriefcaseBusiness
                  size={25}
                  className="text-[#d4af37]"
                />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-gray-100">
                No Applications Yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
                Once you apply for a job, it will appear here.
              </p>
            </div>
          )}

        {/* Applications */}
        {!loading &&
          !error &&
          applications.length > 0 && (
            <div className="space-y-5">

              {applications.map((application) => {
                const job = application.job;
                const isUpdating =
                  updatingId === application._id;

                return (
                  <article
                    key={application._id}
                    className="group rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-5 transition duration-200 hover:border-[#d4af37]/20 hover:bg-[#0c0c0c] hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] sm:p-6"
                  >

                    {/* Top */}
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                      {/* Job Info */}
                      <div className="min-w-0">

                        <div className="flex items-start gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/[0.07]">
                            <BriefcaseBusiness
                              size={20}
                              className="text-[#d4af37]"
                            />
                          </div>

                          <div className="min-w-0">
                            <h2 className="truncate text-xl font-semibold text-gray-100">
                              {job?.title ||
                                "Job information unavailable"}
                            </h2>

                            <p className="mt-1 text-sm font-medium text-[#e6c35c]">
                              {job?.company ||
                                "Company unavailable"}
                            </p>
                          </div>

                        </div>

                        {/* Metadata */}
                        <div className="mt-5 flex flex-wrap gap-2">

                          <span className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-xs text-gray-500">
                            <MapPin size={13} />
                            {job?.location ||
                              "Location not specified"}
                          </span>

                          <span className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-xs text-gray-500">
                            <Clock3 size={13} />
                            {job?.jobType || "Full Time"}
                          </span>

                          <span className="flex items-center gap-1.5 rounded-lg border border-[#d4af37]/15 bg-[#d4af37]/[0.04] px-3 py-2 text-xs text-[#c9aa45]">
                            ₹ {job?.salary || "Not specified"}
                          </span>

                          <span className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-xs text-gray-500">
                            <CalendarDays size={13} />
                            Applied {formatDate(application.appliedAt)}
                          </span>

                        </div>
                      </div>

                      {/* Status */}
                      <span
                        className={`inline-flex w-fit shrink-0 rounded-full border px-4 py-2 text-xs font-semibold ${getStatusStyle(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>

                    </div>

                    {/* Status Update */}
                    <div className="mt-6 rounded-xl border border-white/[0.06] bg-[#070707] p-4">

                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                        Application Status
                      </label>

                      <select
                        value={application.status}
                        disabled={isUpdating}
                        onChange={(e) =>
                          handleStatusChange(
                            application._id,
                            e.target.value
                          )
                        }
                        className="w-full max-w-xs rounded-lg border border-white/[0.08] bg-[#0b0b0b] px-4 py-2.5 text-sm text-gray-300 outline-none transition focus:border-[#d4af37]/50 focus:ring-1 focus:ring-[#d4af37]/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="Applied">
                          Applied
                        </option>

                        <option value="Interview">
                          Interview
                        </option>

                        <option value="Selected">
                          Selected
                        </option>

                        <option value="Rejected">
                          Rejected
                        </option>
                      </select>

                      {isUpdating && (
                        <p className="mt-2 text-xs text-[#d4af37]">
                          Updating status...
                        </p>
                      )}

                    </div>

                    {/* Skills */}
                    {job?.skills?.length > 0 && (
                      <div className="mt-5">

                        <p className="mb-2 text-xs font-medium text-gray-600">
                          Required Skills
                        </p>

                        <div className="flex flex-wrap gap-2">

                          {job.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-xs text-gray-400 transition group-hover:border-[#d4af37]/15"
                            >
                              {skill}
                            </span>
                          ))}

                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {application.notes && (
                      <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.1em] text-gray-600">
                          Notes
                        </p>

                        <p className="mt-1.5 text-sm leading-6 text-gray-400">
                          {application.notes}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-5">

                      {job?.applyLink && (
                        <a
                          href={job.applyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-[#d4af37] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#e6c35c] hover:shadow-[0_6px_20px_rgba(212,175,55,0.16)]"
                        >
                          Open Job
                          <ExternalLink size={15} />
                        </a>
                      )}

                      <button
                        onClick={() =>
                          handleDelete(application._id)
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 px-5 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                      >
                        <Trash2 size={15} />
                        Remove
                      </button>

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

export default MyApplications;