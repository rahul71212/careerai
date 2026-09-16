import { useRef, useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Target,
  BriefcaseBusiness,
  GraduationCap,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
import Navbar from "../components/Navbar";

function ResumeAnalyzer() {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  // File selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage("Please upload a PDF, DOC or DOCX file.");
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage("File size must be less than 5 MB.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setMessage("");
    setUploadedFile(null);
    setAnalysis(null);
  };

  // Upload + AI Analysis
  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a resume first.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    setAnalyzing(false);
    setMessage("");
    setAnalysis(null);

    try {
      // =========================
      // STEP 1: UPLOAD RESUME
      // =========================

      console.log("UPLOAD STARTED");
      console.log("FILE:", file);
      console.log("TOKEN EXISTS:", !!token);

      const response = await fetch(
        "http://localhost:5000/api/resume/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      console.log("RESPONSE STATUS:", response.status);

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Upload failed.");
        return;
      }

      setUploadedFile(data.file);

      localStorage.setItem("resumeId", data.resumeId);

      console.log("RESUME ID:", data.resumeId);
      console.log("EXTRACTED RESUME TEXT:", data.resumeText);

      setMessage("Resume uploaded successfully!");

      // =========================
      // STEP 2: GET SAVED RESUME
      // =========================

      const resumeResponse = await fetch(
        `http://localhost:5000/api/resume/${data.resumeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resumeData = await resumeResponse.json();

      console.log("SAVED RESUME:", resumeData);

      // =========================
      // STEP 3: AI ANALYSIS
      // =========================

      setAnalyzing(true);
      setMessage("Resume uploaded. AI is analyzing your resume...");

      const analysisResponse = await fetch(
        `http://localhost:5000/api/resume/analyze/${data.resumeId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const analysisData = await analysisResponse.json();

      if (!analysisResponse.ok) {
        setMessage(
          analysisData.message || "AI analysis failed."
        );
        return;
      }

      console.log("AI ANALYSIS:", analysisData);

      setAnalysis(analysisData.analysis);
      setMessage("Resume analyzed successfully!");
    } catch (error) {
      console.error("ERROR:", error);
      setMessage("Unable to connect to server.");
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="relative mx-auto max-w-6xl overflow-hidden px-5 py-10 sm:px-6 sm:py-12">

        {/* Background Glow */}
        <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-[#d4af37]/[0.035] blur-3xl" />

        <div className="pointer-events-none absolute right-0 top-96 h-72 w-72 rounded-full bg-[#d4af37]/[0.018] blur-3xl" />

        {/* =========================
            PAGE HEADER
        ========================== */}

        <div className="relative text-center">

          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/[0.06]">
            <Sparkles
              size={20}
              className="text-[#d4af37]"
            />
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#d4af37]">
            AI Career Intelligence
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            AI Resume{" "}
            <span className="text-[#e6c35c]">
              Analyzer
            </span>
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
            Upload your resume and get AI-powered ATS analysis,
            skill insights and personalized recommendations.
          </p>
        </div>

        {/* =========================
            UPLOAD SECTION
        ========================== */}

        <div className="relative mt-10 rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-5 shadow-[0_25px_70px_rgba(0,0,0,0.35)] sm:p-7">

          {/* Top Gold Line */}
          <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-[#d4af37]/35 to-transparent" />

          {/* Upload Area */}

          <div
            onClick={() => fileInputRef.current?.click()}
            className="group cursor-pointer rounded-xl border border-dashed border-white/[0.10] bg-[#070707] px-5 py-12 text-center transition duration-300 hover:border-[#d4af37]/40 hover:bg-[#d4af37]/[0.015]"
          >

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/[0.06] transition duration-300 group-hover:scale-105 group-hover:border-[#d4af37]/40 group-hover:bg-[#d4af37]/[0.09]">
              <Upload
                className="text-[#d4af37]"
                size={24}
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-100">
              Upload your resume
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Click anywhere here to select your resume
            </p>

            <p className="mt-2 text-xs text-gray-700">
              PDF, DOC or DOCX • Maximum 5 MB
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Selected File */}

          {file && (
            <div className="mt-5 flex items-center gap-4 rounded-xl border border-[#d4af37]/15 bg-[#d4af37]/[0.035] p-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#d4af37]/10 bg-[#d4af37]/[0.07]">
                <FileText
                  className="text-[#d4af37]"
                  size={20}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-200">
                  {file.name}
                </p>

                <p className="mt-1 text-xs text-gray-600">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <ShieldCheck
                size={18}
                className="shrink-0 text-[#d4af37]"
              />
            </div>
          )}

          {/* Message */}

          {message && (
            <div
              className={`mt-5 flex items-center gap-3 rounded-xl border p-4 text-sm ${
                uploadedFile
                  ? "border-[#d4af37]/20 bg-[#d4af37]/[0.04] text-[#e6c35c]"
                  : "border-red-500/20 bg-red-500/[0.04] text-red-400"
              }`}
            >
              {uploadedFile ? (
                <CheckCircle
                  className="shrink-0 text-[#d4af37]"
                  size={18}
                />
              ) : (
                <AlertCircle
                  className="shrink-0 text-red-400"
                  size={18}
                />
              )}

              <span>{message}</span>
            </div>
          )}

          {/* Upload Button */}

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] py-3 text-sm font-semibold text-black transition hover:bg-[#e6c35c] hover:shadow-[0_8px_28px_rgba(212,175,55,0.15)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <>
                <Sparkles
                  size={16}
                  className="animate-pulse"
                />

                {analyzing
                  ? "AI Analyzing Resume..."
                  : "Uploading..."}
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Upload & Analyze Resume
              </>
            )}
          </button>

          {/* Uploaded File */}

          {uploadedFile && (
            <div className="mt-5 rounded-xl border border-[#d4af37]/15 bg-[#d4af37]/[0.035] p-4">

              <div className="flex items-center gap-3">

                <CheckCircle
                  size={18}
                  className="text-[#d4af37]"
                />

                <h3 className="text-sm font-semibold text-[#e6c35c]">
                  Resume uploaded successfully
                </h3>

              </div>

              <p className="mt-2 text-sm text-gray-400">
                {uploadedFile.originalName}
              </p>

              <p className="mt-1 text-xs text-gray-700">
                File successfully stored on the server.
              </p>

            </div>
          )}

        </div>

        {/* =====================================================
            ATS DASHBOARD
        ====================================================== */}

        {analysis && (
          <div className="relative mt-10 space-y-5">

            {/* =========================
                ATS SCORE
            ========================== */}

            <div className="rounded-2xl border border-[#d4af37]/15 bg-[#090909] p-7 text-center shadow-[0_20px_60px_rgba(0,0,0,0.25)]">

              <div className="flex items-center justify-center gap-2">

                <Target
                  size={17}
                  className="text-[#d4af37]"
                />

                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  ATS Score
                </p>

              </div>

              <div className="relative mx-auto mt-5 h-40 w-40">

                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(#d4af37 ${
                      analysis.atsScore * 3.6
                    }deg, #191919 0deg)`,
                  }}
                />

                <div className="absolute inset-[5px] rounded-full bg-[#050505]" />

                <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-[#090909]">

                  <span className="text-4xl font-semibold text-[#e6c35c]">
                    {analysis.atsScore}
                  </span>

                  <span className="text-xs text-gray-600">
                    / 100
                  </span>

                </div>

              </div>

              <p className="mt-5 text-xl font-semibold text-gray-100">
                {analysis.targetRole}
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Target role identified from your resume
              </p>

            </div>

            {/* =========================
                SUMMARY
            ========================== */}

            <div className="rounded-2xl border border-white/[0.07] bg-[#090909] p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d4af37]/10 bg-[#d4af37]/[0.07]">
                  <FileText
                    size={17}
                    className="text-[#d4af37]"
                  />
                </div>

                <h3 className="text-lg font-semibold">
                  Professional Summary
                </h3>

              </div>

              <p className="mt-4 text-sm leading-7 text-gray-500">
                {analysis.summary}
              </p>

            </div>

            {/* =========================
                SKILLS + MISSING SKILLS
            ========================== */}

            <div className="grid gap-5 md:grid-cols-2">

              {/* Skills */}

              <div className="rounded-2xl border border-white/[0.07] bg-[#090909] p-6">

                <h3 className="text-lg font-semibold">
                  Skills
                </h3>

                <p className="mt-1 text-xs text-gray-600">
                  Skills detected in your resume
                </p>

                <div className="mt-4 flex flex-wrap gap-2">

                  {analysis.skills?.map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="rounded-full border border-[#d4af37]/15 bg-[#d4af37]/[0.05] px-3 py-1.5 text-xs text-[#e6c35c] transition hover:border-[#d4af37]/30"
                      >
                        ✓ {skill}
                      </span>
                    )
                  )}

                </div>

              </div>

              {/* Missing Skills */}

              <div className="rounded-2xl border border-white/[0.07] bg-[#090909] p-6">

                <h3 className="text-lg font-semibold">
                  Missing Skills
                </h3>

                <p className="mt-1 text-xs text-gray-600">
                  Skills that could strengthen your profile
                </p>

                <div className="mt-4 flex flex-wrap gap-2">

                  {analysis.missingSkills?.map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="rounded-full border border-[#d4af37]/15 bg-[#d4af37]/[0.035] px-3 py-1.5 text-xs text-[#c9aa45]"
                      >
                        + {skill}
                      </span>
                    )
                  )}

                </div>

              </div>

            </div>

            {/* =========================
                STRENGTHS + WEAKNESSES
            ========================== */}

            <div className="grid gap-5 md:grid-cols-2">

              {/* Strengths */}

              <div className="rounded-2xl border border-white/[0.07] bg-[#090909] p-6">

                <h3 className="text-lg font-semibold">
                  Strengths
                </h3>

                <ul className="mt-4 space-y-2.5 text-sm text-gray-500">

                  {analysis.strengths?.map(
                    (item, index) => (
                      <li
                        key={index}
                        className="rounded-xl border border-[#d4af37]/10 bg-[#d4af37]/[0.025] p-3.5 transition hover:border-[#d4af37]/20"
                      >
                        <span className="mr-2 text-[#d4af37]">
                          ✓
                        </span>

                        {item}
                      </li>
                    )
                  )}

                </ul>

              </div>

              {/* Weaknesses */}

              <div className="rounded-2xl border border-white/[0.07] bg-[#090909] p-6">

                <h3 className="text-lg font-semibold">
                  Weaknesses
                </h3>

                <ul className="mt-4 space-y-2.5 text-sm text-gray-500">

                  {analysis.weaknesses?.map(
                    (item, index) => (
                      <li
                        key={index}
                        className="rounded-xl border border-white/[0.07] bg-[#060606] p-3.5 transition hover:border-[#d4af37]/15"
                      >
                        <span className="mr-2 text-[#c9aa45]">
                          !
                        </span>

                        {item}
                      </li>
                    )
                  )}

                </ul>

              </div>

            </div>

            {/* =========================
                EDUCATION
            ========================== */}

            <div className="rounded-2xl border border-white/[0.07] bg-[#090909] p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d4af37]/10 bg-[#d4af37]/[0.07]">
                  <GraduationCap
                    size={18}
                    className="text-[#d4af37]"
                  />
                </div>

                <h3 className="text-lg font-semibold">
                  Education
                </h3>

              </div>

              <div className="mt-5 space-y-3">

                {analysis.education?.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-white/[0.06] bg-[#060606] p-5 transition hover:border-[#d4af37]/15"
                    >

                      <h4 className="text-base font-semibold text-gray-200">
                        {item.degree}
                      </h4>

                      <p className="mt-1 text-sm text-gray-500">
                        {item.institution}
                      </p>

                      <p className="mt-2 text-xs text-gray-700">
                        {item.period}
                      </p>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* =========================
                EXPERIENCE
            ========================== */}

            <div className="rounded-2xl border border-white/[0.07] bg-[#090909] p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d4af37]/10 bg-[#d4af37]/[0.07]">
                  <BriefcaseBusiness
                    size={17}
                    className="text-[#d4af37]"
                  />
                </div>

                <h3 className="text-lg font-semibold">
                  Experience
                </h3>

              </div>

              <div className="mt-5 space-y-3">

                {analysis.experience?.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-white/[0.06] bg-[#060606] p-5 transition hover:border-[#d4af37]/15"
                    >

                      <h4 className="text-base font-semibold text-gray-200">
                        {item.jobTitle}
                      </h4>

                      <p className="mt-1 text-sm text-[#d4af37]">
                        {item.company}
                      </p>

                      <p className="mt-1 text-xs text-gray-700">
                        {item.period}
                      </p>

                      <p className="mt-4 text-sm leading-6 text-gray-500">
                        {item.description}
                      </p>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* =========================
                PROJECTS
            ========================== */}

            <div className="rounded-2xl border border-white/[0.07] bg-[#090909] p-6">

              <h3 className="text-lg font-semibold">
                Projects
              </h3>

              <div className="mt-5 grid gap-4 md:grid-cols-2">

                {analysis.projects?.map(
                  (project, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-white/[0.06] bg-[#060606] p-5 transition hover:border-[#d4af37]/15"
                    >

                      <h4 className="text-base font-semibold text-gray-200">
                        {project.title}
                      </h4>

                      <div className="mt-3 flex flex-wrap gap-2">

                        {project.tools?.map(
                          (tool, toolIndex) => (
                            <span
                              key={toolIndex}
                              className="rounded-full border border-white/[0.07] bg-white/[0.02] px-2.5 py-1 text-[11px] text-gray-500"
                            >
                              {tool}
                            </span>
                          )
                        )}

                      </div>

                      <p className="mt-4 text-sm leading-6 text-gray-500">
                        {project.description}
                      </p>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* =========================
                AI SUGGESTIONS
            ========================== */}

            <div className="rounded-2xl border border-[#d4af37]/15 bg-[#0a0a0a] p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d4af37]/10 bg-[#d4af37]/[0.07]">
                  <Lightbulb
                    size={18}
                    className="text-[#d4af37]"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold">
                    AI Suggestions
                  </h3>

                  <p className="mt-1 text-xs text-gray-600">
                    Personalized recommendations to improve your resume.
                  </p>
                </div>

              </div>

              <div className="mt-5 space-y-3">

                {analysis.suggestions?.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 rounded-xl border border-white/[0.06] bg-[#060606] p-4 transition hover:border-[#d4af37]/15"
                    >

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d4af37]/20 bg-[#d4af37]/[0.05] text-xs font-semibold text-[#d4af37]">
                        {index + 1}
                      </div>

                      <p className="text-sm leading-6 text-gray-400">
                        {item}
                      </p>

                    </div>
                  )
                )}

              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default ResumeAnalyzer;