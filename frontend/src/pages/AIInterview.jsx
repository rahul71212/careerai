import { useState } from "react";
import {
  BrainCircuit,
  Clock,
  ChevronRight,
  RotateCcw,
  CheckCircle,
  Target,
  Award,
} from "lucide-react";
import Navbar from "../components/Navbar";

const interviewQuestions = {
  "Frontend Developer": [
    "Tell me about yourself and your technical background.",
    "What is the difference between HTML, CSS and JavaScript?",
    "What is React and why is it used?",
    "What is the difference between props and state in React?",
    "How does useEffect work in React?",
    "What is the difference between localStorage and sessionStorage?",
    "Explain how you would build a responsive web application.",
    "Tell me about one project you have developed.",
  ],

  "Backend Developer": [
    "Tell me about yourself and your technical background.",
    "What is Node.js and why is it used?",
    "What is Express.js?",
    "What is REST API?",
    "What is the difference between authentication and authorization?",
    "What is MongoDB and when would you use it?",
    "Explain how JWT authentication works.",
    "Tell me about one backend project you have developed.",
  ],

  "Full Stack Developer": [
    "Tell me about yourself and your technical background.",
    "Explain the difference between frontend and backend development.",
    "What is React and why is it useful?",
    "What is Node.js?",
    "How does a REST API work?",
    "How would you connect a React frontend with a Node.js backend?",
    "How would you implement user authentication?",
    "Tell me about one full-stack project you have developed.",
  ],

  "Java Developer": [
    "Tell me about yourself and your technical background.",
    "What are the main principles of OOP?",
    "What is the difference between an abstract class and an interface?",
    "What is exception handling in Java?",
    "What is the Java Collections Framework?",
    "What is the difference between ArrayList and LinkedList?",
    "What is the difference between == and equals() in Java?",
    "Tell me about a Java project you have worked on.",
  ],
};

function AIInterview() {
  const [role, setRole] = useState("Full Stack Developer");
  const [difficulty, setDifficulty] = useState("Intermediate");

  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState("");
  const [finished, setFinished] = useState(false);

  const questions = interviewQuestions[role];

  const startInterview = () => {
    setStarted(true);
    setCurrentQuestion(0);
    setAnswer("");
    setAnswers([]);
    setEvaluations([]);
    setEvaluationError("");
    setFinished(false);
  };

  const handleNext = async () => {
    if (!answer.trim() || evaluating) {
      return;
    }

    setEvaluating(true);
    setEvaluationError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai-interview/evaluate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role,
            question: questions[currentQuestion],
            answer: answer.trim(),
            difficulty,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to evaluate answer"
        );
      }

      const newAnswer = {
        question: questions[currentQuestion],
        answer: answer.trim(),
      };

      const newEvaluation = data.evaluation;

      const updatedAnswers = [...answers, newAnswer];
      const updatedEvaluations = [
        ...evaluations,
        newEvaluation,
      ];

      setAnswers(updatedAnswers);
      setEvaluations(updatedEvaluations);

      if (currentQuestion === questions.length - 1) {
        setFinished(true);
        setStarted(false);
        return;
      }

      setCurrentQuestion(currentQuestion + 1);
      setAnswer("");
    } catch (error) {
      console.error("AI evaluation error:", error);

      setEvaluationError(
        error.message ||
          "Unable to evaluate answer. Please try again."
      );
    } finally {
      setEvaluating(false);
    }
  };

  const restartInterview = () => {
    setStarted(false);
    setFinished(false);
    setCurrentQuestion(0);
    setAnswer("");
    setAnswers([]);
    setEvaluations([]);
    setEvaluationError("");
  };

  const overallScore =
    evaluations.length > 0
      ? Math.round(
          evaluations.reduce(
            (sum, item) => sum + Number(item.score || 0),
            0
          ) / evaluations.length
        )
      : 0;

  const technicalScore =
    evaluations.length > 0
      ? Math.round(
          evaluations.reduce(
            (sum, item) =>
              sum + Number(item.technicalScore || 0),
            0
          ) / evaluations.length
        )
      : 0;

  const communicationScore =
    evaluations.length > 0
      ? Math.round(
          evaluations.reduce(
            (sum, item) =>
              sum + Number(item.communicationScore || 0),
            0
          ) / evaluations.length
        )
      : 0;

  const progress = Math.round(
    ((currentQuestion + (answer.trim() ? 1 : 0)) /
      questions.length) *
      100
  );

  /* =========================
     Setup Screen
  ========================= */

  if (!started && !finished) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <Navbar />

        <main className="relative mx-auto max-w-4xl overflow-hidden px-5 py-12 sm:px-6 sm:py-16">

          {/* Background Glow */}
          <div className="pointer-events-none absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-[#d4af37]/[0.035] blur-3xl" />

          <div className="relative text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/[0.06]">
              <BrainCircuit
                className="text-[#d4af37]"
                size={32}
              />
            </div>

            <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-[#d4af37]">
              AI Career Intelligence
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              AI Mock{" "}
              <span className="text-[#e6c35c]">
                Interview
              </span>
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              Practice realistic technical interviews and improve
              your confidence before the real interview.
            </p>

          </div>

          {/* Setup Card */}
          <div className="relative mt-10 rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.35)] sm:p-8">

            <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-[#d4af37]/35 to-transparent" />

            <h2 className="text-xl font-semibold">
              Interview Setup
            </h2>

            {/* Role */}
            <div className="mt-6">

              <label className="mb-2 block text-sm font-medium text-gray-400">
                Select Role
              </label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-[#050505] px-4 py-3 text-sm text-white outline-none transition focus:border-[#d4af37]/40 focus:ring-1 focus:ring-[#d4af37]/10"
              >
                {Object.keys(interviewQuestions).map(
                  (item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  )
                )}
              </select>

            </div>

            {/* Difficulty */}
            <div className="mt-5">

              <label className="mb-2 block text-sm font-medium text-gray-400">
                Difficulty
              </label>

              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value)
                }
                className="w-full rounded-xl border border-white/[0.08] bg-[#050505] px-4 py-3 text-sm text-white outline-none transition focus:border-[#d4af37]/40 focus:ring-1 focus:ring-[#d4af37]/10"
              >
                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Advanced">
                  Advanced
                </option>
              </select>

            </div>

            {/* Interview Info */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">

              <div className="rounded-xl border border-white/[0.06] bg-[#060606] p-4">
                <Target
                  className="text-[#d4af37]"
                  size={21}
                />

                <p className="mt-3 text-xs text-gray-600">
                  Role
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-300">
                  {role}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-[#060606] p-4">
                <Clock
                  className="text-[#d4af37]"
                  size={21}
                />

                <p className="mt-3 text-xs text-gray-600">
                  Questions
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-300">
                  {questions.length}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-[#060606] p-4">
                <Award
                  className="text-[#d4af37]"
                  size={21}
                />

                <p className="mt-3 text-xs text-gray-600">
                  Difficulty
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-300">
                  {difficulty}
                </p>
              </div>

            </div>

            <button
              onClick={startInterview}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] py-3.5 text-sm font-semibold text-black transition hover:bg-[#e6c35c] hover:shadow-[0_8px_28px_rgba(212,175,55,0.15)] active:scale-[0.99]"
            >
              Start Interview
              <ChevronRight size={19} />
            </button>

          </div>
        </main>
      </div>
    );
  }

  /* =========================
     Interview Screen
  ========================= */

  if (started) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <Navbar />

        <main className="relative mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-12">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <p className="text-xs text-[#c9aa45]">
                {role}
              </p>

              <h1 className="mt-1 text-2xl font-semibold">
                AI Mock Interview
              </h1>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock size={17} className="text-[#d4af37]" />

              Question {currentQuestion + 1} of{" "}
              {questions.length}
            </div>

          </div>

          {/* Progress */}
          <div className="mt-6">

            <div className="flex justify-between text-xs text-gray-600">
              <span>Interview Progress</span>
              <span className="text-[#c9aa45]">
                {progress}%
              </span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">

              <div
                className="h-full rounded-full bg-[#d4af37] transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>

          {/* Question */}
          <div className="mt-8 rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:p-8">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d4af37]/15 bg-[#d4af37]/[0.06]">
                <BrainCircuit
                  className="text-[#d4af37]"
                  size={22}
                />
              </div>

              <div>

                <p className="text-xs uppercase tracking-wider text-gray-600">
                  AI Interviewer
                </p>

                <p className="text-sm text-[#d4af37]">
                  {difficulty} Interview
                </p>

              </div>

            </div>

            <h2 className="mt-7 text-xl font-semibold leading-8 text-gray-100 sm:text-2xl">
              {questions[currentQuestion]}
            </h2>

            {/* Answer */}
            <div className="mt-7">

              <label className="mb-2 block text-sm font-medium text-gray-400">
                Your Answer
              </label>

              <textarea
                value={answer}
                onChange={(e) =>
                  setAnswer(e.target.value)
                }
                rows={8}
                placeholder="Type your answer here..."
                className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#050505] p-4 text-sm leading-6 text-white outline-none placeholder:text-gray-700 transition focus:border-[#d4af37]/40 focus:ring-1 focus:ring-[#d4af37]/10"
              />

              <p className="mt-2 text-right text-xs text-gray-700">
                {answer.length} characters
              </p>

            </div>

            {evaluationError && (
              <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/[0.04] p-3 text-center text-sm text-red-400">
                {evaluationError}
              </p>
            )}

            <button
              onClick={handleNext}
              disabled={!answer.trim() || evaluating}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] py-3.5 text-sm font-semibold text-black transition hover:bg-[#e6c35c] hover:shadow-[0_8px_28px_rgba(212,175,55,0.15)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {evaluating
                ? "AI is evaluating..."
                : currentQuestion === questions.length - 1
                ? "Finish Interview"
                : "Submit & Next"}

              {!evaluating && <ChevronRight size={19} />}
            </button>

          </div>
        </main>
      </div>
    );
  }

  /* =========================
     Result Screen
  ========================= */

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="relative mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-12">

        {/* Header */}
        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#d4af37]/20 bg-[#d4af37]/[0.06]">
            <CheckCircle
              className="text-[#d4af37]"
              size={34}
            />
          </div>

          <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-[#d4af37]">
            Interview Report
          </p>

          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Interview{" "}
            <span className="text-[#e6c35c]">
              Completed
            </span>
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Great job! Your answers have been evaluated by AI.
          </p>

        </div>

        <div className="mt-10 rounded-2xl border border-white/[0.07] bg-[#0a0a0a] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.3)] sm:p-8">

          {/* Basic Info */}
          <div className="grid gap-3 sm:grid-cols-3">

            <div className="rounded-xl border border-white/[0.06] bg-[#060606] p-5 text-center">
              <p className="text-xs text-gray-600">
                Role
              </p>

              <p className="mt-2 text-sm font-semibold text-gray-300">
                {role}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#060606] p-5 text-center">
              <p className="text-xs text-gray-600">
                Questions Answered
              </p>

              <p className="mt-2 text-2xl font-bold text-[#e6c35c]">
                {answers.length}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#060606] p-5 text-center">
              <p className="text-xs text-gray-600">
                Difficulty
              </p>

              <p className="mt-2 text-sm font-semibold text-gray-300">
                {difficulty}
              </p>
            </div>

          </div>

          {/* AI Scores */}
          <div className="mt-5 grid gap-3 sm:grid-cols-3">

            <div className="rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/[0.045] p-5 text-center">
              <p className="text-xs text-gray-500">
                Overall AI Score
              </p>

              <p className="mt-2 text-4xl font-bold text-[#e6c35c]">
                {overallScore}%
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#060606] p-5 text-center">
              <p className="text-xs text-gray-500">
                Technical Score
              </p>

              <p className="mt-2 text-4xl font-bold text-gray-200">
                {technicalScore}%
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#060606] p-5 text-center">
              <p className="text-xs text-gray-500">
                Communication
              </p>

              <p className="mt-2 text-4xl font-bold text-gray-200">
                {communicationScore}%
              </p>
            </div>

          </div>

          {/* Question Evaluations */}
          <div className="mt-10">

            <div className="flex items-center gap-3">

              <div className="h-px flex-1 bg-white/[0.06]" />

              <h2 className="text-lg font-semibold text-gray-200">
                AI Evaluation
              </h2>

              <div className="h-px flex-1 bg-white/[0.06]" />

            </div>

            <div className="mt-5 space-y-5">

              {answers.map((item, index) => {
                const evaluation = evaluations[index];

                return (
                  <div
                    key={index}
                    className="rounded-xl border border-white/[0.07] bg-[#060606] p-5"
                  >

                    <div className="flex items-center justify-between">

                      <p className="text-xs font-semibold uppercase tracking-wider text-[#c9aa45]">
                        Question {index + 1}
                      </p>

                      {evaluation && (
                        <span className="rounded-full border border-[#d4af37]/15 bg-[#d4af37]/[0.05] px-2.5 py-1 text-[11px] text-[#d4af37]">
                          {evaluation.score}/100
                        </span>
                      )}

                    </div>

                    <p className="mt-3 text-sm leading-6 text-gray-400">
                      {item.question}
                    </p>

                    {/* Candidate Answer */}
                    <div className="mt-4 rounded-xl border border-white/[0.05] bg-[#0a0a0a] p-4">

                      <p className="mb-2 text-[11px] uppercase tracking-wide text-gray-700">
                        Your Answer
                      </p>

                      <p className="text-sm leading-6 text-gray-500">
                        {item.answer}
                      </p>

                    </div>

                    {/* AI Evaluation */}
                    {evaluation && (
                      <div className="mt-4 rounded-xl border border-[#d4af37]/15 bg-[#d4af37]/[0.025] p-5">

                        <div className="grid gap-4 sm:grid-cols-3">

                          <div>
                            <p className="text-xs text-gray-600">
                              Score
                            </p>

                            <p className="mt-1 text-xl font-bold text-[#e6c35c]">
                              {evaluation.score}/100
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-600">
                              Technical
                            </p>

                            <p className="mt-1 text-xl font-bold text-gray-300">
                              {evaluation.technicalScore}/100
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-600">
                              Communication
                            </p>

                            <p className="mt-1 text-xl font-bold text-gray-300">
                              {evaluation.communicationScore}/100
                            </p>
                          </div>

                        </div>

                        {evaluation.strengths?.length > 0 && (
                          <div className="mt-5">

                            <p className="font-semibold text-emerald-400">
                              Strengths
                            </p>

                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-500">
                              {evaluation.strengths.map(
                                (item, i) => (
                                  <li key={i}>{item}</li>
                                )
                              )}
                            </ul>

                          </div>
                        )}

                        {evaluation.weaknesses?.length > 0 && (
                          <div className="mt-5">

                            <p className="font-semibold text-red-400">
                              Weaknesses
                            </p>

                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-500">
                              {evaluation.weaknesses.map(
                                (item, i) => (
                                  <li key={i}>{item}</li>
                                )
                              )}
                            </ul>

                          </div>
                        )}

                        {evaluation.feedback && (
                          <div className="mt-5">

                            <p className="font-semibold text-[#d4af37]">
                              AI Feedback
                            </p>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                              {evaluation.feedback}
                            </p>

                          </div>
                        )}

                        {evaluation.suggestion && (
                          <div className="mt-5">

                            <p className="font-semibold text-[#e6c35c]">
                              How to Improve
                            </p>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                              {evaluation.suggestion}
                            </p>

                          </div>
                        )}

                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          </div>

          {/* Restart */}
          <button
            onClick={restartInterview}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.10] py-3 text-sm font-semibold text-gray-400 transition hover:border-[#d4af37]/30 hover:text-[#d4af37]"
          >
            <RotateCcw size={18} />
            Start New Interview
          </button>

        </div>
      </main>
    </div>
  );
}

export default AIInterview;