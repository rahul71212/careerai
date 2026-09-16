import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  MapPin,
  Pencil,
  Trash2,
  Plus,
  X,
} from "lucide-react";

import Navbar from "../components/Navbar";

const API_URL = "http://localhost:5000";

const emptyForm = {
  title: "",
  company: "",
  location: "",
  description: "",
  skills: "",
  experience: "Fresher",
  salary: "",
  jobType: "Full Time",
  applyLink: "",
};

function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingJob, setEditingJob] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // =========================
  // FETCH JOBS
  // =========================
  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/jobs`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch jobs");
      }

      setJobs(data);
    } catch (error) {
      console.error("Fetch jobs error:", error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // CREATE / UPDATE JOB
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("Please login first.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const jobData = {
        title: form.title,
        company: form.company,
        location: form.location || "Remote",
        description: form.description,
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        experience: form.experience,
        salary: form.salary || "Not specified",
        jobType: form.jobType,
        applyLink: form.applyLink,
      };

      const url = editingJob
        ? `${API_URL}/api/jobs/${editingJob._id}`
        : `${API_URL}/api/jobs`;

      const method = editingJob ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage(
        editingJob
          ? "Job updated successfully ✓"
          : "Job created successfully ✓"
      );

      setForm(emptyForm);
      setEditingJob(null);

      fetchJobs();
    } catch (error) {
      console.error("Save job error:", error);
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // EDIT JOB
  // =========================
  const handleEdit = (job) => {
    setEditingJob(job);

    setForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      description: job.description || "",
      skills: Array.isArray(job.skills)
        ? job.skills.join(", ")
        : "",
      experience: job.experience || "Fresher",
      salary: job.salary || "",
      jobType: job.jobType || "Full Time",
      applyLink: job.applyLink || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const cancelEdit = () => {
    setEditingJob(null);
    setForm(emptyForm);
    setMessage("");
  };

  // =========================
  // DELETE JOB
  // =========================
  const handleDelete = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/jobs/${jobId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete job"
        );
      }

      setMessage("Job deleted successfully ✓");

      if (editingJob?._id === jobId) {
        cancelEdit();
      }

      fetchJobs();
    } catch (error) {
      console.error("Delete job error:", error);
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* =========================
          NAVBAR
      ========================= */}
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">

        {/* =========================
            HEADER
        ========================= */}
        <div className="mb-10">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10">
              <BriefcaseBusiness
                size={24}
                className="text-[#d4af37]"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9aa45]">
                CareerAI
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                Admin Dashboard
              </h1>
            </div>

          </div>

          <p className="mt-4 max-w-2xl text-gray-500">
            Manage jobs and CareerAI listings from one place.
          </p>

        </div>

        {/* =========================
            STATS
        ========================= */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Total Jobs */}
          <div className="rounded-2xl border border-[#d4af37]/15 bg-[#0a0a0a] p-5 transition hover:border-[#d4af37]/30">

            <p className="text-sm text-gray-500">
              Total Jobs
            </p>

            <p className="mt-2 text-3xl font-bold text-[#e6c35c]">
              {jobs.length}
            </p>

          </div>

          {/* Full Time */}
          <div className="rounded-2xl border border-[#d4af37]/15 bg-[#0a0a0a] p-5 transition hover:border-[#d4af37]/30">

            <p className="text-sm text-gray-500">
              Full Time
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {
                jobs.filter(
                  (job) => job.jobType === "Full Time"
                ).length
              }
            </p>

          </div>

          {/* Remote */}
          <div className="rounded-2xl border border-[#d4af37]/15 bg-[#0a0a0a] p-5 transition hover:border-[#d4af37]/30">

            <p className="text-sm text-gray-500">
              Remote
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {
                jobs.filter(
                  (job) =>
                    job.location?.toLowerCase() ===
                    "remote"
                ).length
              }
            </p>

          </div>

        </div>

        {/* =========================
            MESSAGE
        ========================= */}
        {message && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-[#d4af37]/20 bg-[#0b0b0b] px-4 py-3 text-sm font-medium text-[#e6c35c]">

            <span>{message}</span>

            <button
              onClick={() => setMessage("")}
              className="text-gray-600 transition hover:text-[#d4af37]"
            >
              <X size={17} />
            </button>

          </div>
        )}

        {/* =========================
            JOB FORM
        ========================= */}
        <div className="mb-8 rounded-2xl border border-[#d4af37]/15 bg-[#0a0a0a] p-6 sm:p-8">

          {/* Form Header */}
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c9aa45]">
                Job Management
              </p>

              <h2 className="mt-1 text-xl font-bold text-white">
                {editingJob
                  ? "Edit Job"
                  : "Add New Job"}
              </h2>

            </div>

            {editingJob && (
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-400 transition hover:border-[#d4af37]/50 hover:text-[#e6c35c]"
              >
                <X size={16} />
                Cancel Edit
              </button>
            )}

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >

            {/* =========================
                TITLE
            ========================= */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Job Title *
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Frontend Developer"
                required
                className="w-full rounded-xl border border-gray-800 bg-[#050505] px-4 py-3 text-white outline-none transition placeholder:text-gray-700 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20"
              />

            </div>

            {/* =========================
                COMPANY
            ========================= */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Company *
              </label>

              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Google"
                required
                className="w-full rounded-xl border border-gray-800 bg-[#050505] px-4 py-3 text-white outline-none transition placeholder:text-gray-700 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20"
              />

            </div>

            {/* =========================
                LOCATION
            ========================= */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Location
              </label>

              <div className="relative">

                <MapPin
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                />

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Noida / Remote"
                  className="w-full rounded-xl border border-gray-800 bg-[#050505] py-3 pl-10 pr-4 text-white outline-none transition placeholder:text-gray-700 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20"
                />

              </div>

            </div>

            {/* =========================
                JOB TYPE
            ========================= */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Job Type
              </label>

              <select
                name="jobType"
                value={form.jobType}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-800 bg-[#050505] px-4 py-3 text-white outline-none transition focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20"
              >
                <option value="Full Time">
                  Full Time
                </option>

                <option value="Part Time">
                  Part Time
                </option>

                <option value="Internship">
                  Internship
                </option>

                <option value="Contract">
                  Contract
                </option>
              </select>

            </div>

            {/* =========================
                EXPERIENCE
            ========================= */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Experience
              </label>

              <select
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-800 bg-[#050505] px-4 py-3 text-white outline-none transition focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20"
              >
                <option value="Fresher">
                  Fresher
                </option>

                <option value="0-1 Years">
                  0-1 Years
                </option>

                <option value="1-3 Years">
                  1-3 Years
                </option>

                <option value="3-5 Years">
                  3-5 Years
                </option>

                <option value="5+ Years">
                  5+ Years
                </option>
              </select>

            </div>

            {/* =========================
                SALARY
            ========================= */}
            <div>

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Salary
              </label>

              <input
                type="text"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="₹5-8 LPA"
                className="w-full rounded-xl border border-gray-800 bg-[#050505] px-4 py-3 text-white outline-none transition placeholder:text-gray-700 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20"
              />

            </div>

            {/* =========================
                SKILLS
            ========================= */}
            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Skills
              </label>

              <input
                type="text"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="React, JavaScript, Node.js"
                className="w-full rounded-xl border border-gray-800 bg-[#050505] px-4 py-3 text-white outline-none transition placeholder:text-gray-700 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20"
              />

              <p className="mt-2 text-xs text-gray-600">
                Separate skills using commas.
              </p>

            </div>

            {/* =========================
                APPLY LINK
            ========================= */}
            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Apply Link
              </label>

              <input
                type="url"
                name="applyLink"
                value={form.applyLink}
                onChange={handleChange}
                placeholder="https://company.com/jobs/123"
                className="w-full rounded-xl border border-gray-800 bg-[#050505] px-4 py-3 text-white outline-none transition placeholder:text-gray-700 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20"
              />

            </div>

            {/* =========================
                DESCRIPTION
            ========================= */}
            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Description *
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write complete job description..."
                rows="6"
                required
                className="w-full resize-none rounded-xl border border-gray-800 bg-[#050505] px-4 py-3 text-white outline-none transition placeholder:text-gray-700 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/20"
              />

            </div>

            {/* =========================
                SUBMIT
            ========================= */}
            <div className="md:col-span-2">

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-6 py-3 font-semibold text-black transition hover:bg-[#e6c35c] hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
              >

                {saving ? (
                  "Saving..."
                ) : editingJob ? (
                  <>
                    <Pencil size={17} />
                    Update Job
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Add Job
                  </>
                )}

              </button>

            </div>

          </form>
        </div>

        {/* =========================
            JOB LIST
        ========================= */}
        <div className="rounded-2xl border border-[#d4af37]/15 bg-[#0a0a0a] p-6 sm:p-8">

          {/* Header */}
          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10">
              <BriefcaseBusiness
                size={20}
                className="text-[#d4af37]"
              />
            </div>

            <div>

              <h2 className="text-xl font-bold text-white">
                All Jobs
              </h2>

              <p className="text-sm text-gray-600">
                {jobs.length} job listing
                {jobs.length !== 1 ? "s" : ""}
              </p>

            </div>

          </div>

          {/* =========================
              LOADING
          ========================= */}
          {loading ? (
            <div className="rounded-xl border border-gray-800 bg-[#050505] p-8 text-center text-gray-500">
              Loading jobs...
            </div>
          ) : jobs.length === 0 ? (

            /* =========================
                EMPTY
            ========================= */
            <div className="rounded-xl border border-dashed border-gray-800 bg-[#050505] p-12 text-center">

              <BriefcaseBusiness
                size={36}
                className="mx-auto text-gray-700"
              />

              <p className="mt-3 text-gray-500">
                No jobs available.
              </p>

              <p className="mt-1 text-xs text-gray-700">
                Add your first job listing above.
              </p>

            </div>

          ) : (

            /* =========================
                JOBS
            ========================= */
            <div className="space-y-4">

              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="rounded-2xl border border-gray-800 bg-[#050505] p-5 transition duration-200 hover:border-[#d4af37]/30 hover:bg-[#070707]"
                >

                  <div className="flex flex-col justify-between gap-5 lg:flex-row">

                    {/* Job Information */}
                    <div className="min-w-0">

                      <h3 className="text-lg font-bold text-white">
                        {job.title}
                      </h3>

                      <p className="mt-1 flex items-center gap-2 font-medium text-[#d4af37]">
                        <Building2 size={15} />
                        {job.company}
                      </p>

                      {/* Job Details */}
                      <div className="mt-4 flex flex-wrap gap-2 text-sm">

                        <span className="flex items-center gap-1.5 rounded-full border border-gray-800 bg-[#0a0a0a] px-3 py-1.5 text-gray-400">
                          <MapPin size={14} />
                          {job.location || "Remote"}
                        </span>

                        <span className="rounded-full border border-gray-800 bg-[#0a0a0a] px-3 py-1.5 text-gray-400">
                          {job.jobType}
                        </span>

                        <span className="rounded-full border border-gray-800 bg-[#0a0a0a] px-3 py-1.5 text-gray-400">
                          {job.experience}
                        </span>

                        <span className="rounded-full border border-[#d4af37]/20 bg-[#d4af37]/5 px-3 py-1.5 text-[#c9aa45]">
                          {job.salary}
                        </span>

                      </div>

                      {/* Skills */}
                      {job.skills?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">

                          {job.skills.map(
                            (skill, index) => (
                              <span
                                key={index}
                                className="rounded-full border border-[#d4af37]/15 bg-[#d4af37]/5 px-3 py-1 text-xs font-medium text-[#c9aa45]"
                              >
                                {skill}
                              </span>
                            )
                          )}

                        </div>
                      )}

                      {/* Description Preview */}
                      {job.description && (
                        <p className="mt-4 line-clamp-2 max-w-3xl text-sm leading-6 text-gray-600">
                          {job.description}
                        </p>
                      )}

                    </div>

                    {/* =========================
                        ACTIONS
                    ========================= */}
                    <div className="flex items-start gap-2 lg:shrink-0">

                      {/* Edit */}
                      <button
                        onClick={() =>
                          handleEdit(job)
                        }
                        className="flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-400 transition hover:border-[#d4af37]/60 hover:bg-[#d4af37]/5 hover:text-[#e6c35c]"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() =>
                          handleDelete(job._id)
                        }
                        className="flex items-center gap-2 rounded-lg border border-red-900/40 px-4 py-2 text-sm font-semibold text-red-400 transition hover:border-red-500/60 hover:bg-red-500/5"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </main>
    </div>
  );
}

export default AdminDashboard;