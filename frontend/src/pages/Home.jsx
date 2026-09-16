import {
  ArrowRight,
  Brain,
  CheckCircle2,
  FileText,
  MapPin,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  BriefcaseBusiness,
} from "lucide-react";

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <Navbar />

      {/* HERO */}
      <section className="relative border-b border-white/[0.06]">

        {/* Premium gold + red glow */}
        <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[500px] w-[850px] -translate-x-1/2 rounded-full bg-[#d4af5a]/[0.055] blur-[130px]" />

        <div className="pointer-events-none absolute left-[30%] top-[-100px] h-[350px] w-[500px] rounded-full bg-[#d96d72]/[0.035] blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-20 md:pb-24 md:pt-24">

          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">

            {/* LEFT */}
            <div>

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d4af5a]/20 bg-[#d4af5a]/[0.06] px-3.5 py-1.5 text-xs font-medium text-[#d4af5a]">
                <Sparkles size={14} />
                AI-powered career platform
              </div>

              <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-[68px]">
                Find your next
                <br />
                <span className="text-[#d4af5a]">
                  career opportunity.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-gray-500 sm:text-lg">
                Discover jobs, improve your resume, practice interviews and
                build your career with AI-powered tools.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/jobs"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#d96d72] px-6 py-3 font-semibold text-white transition hover:bg-[#e27b7f] hover:shadow-[0_8px_25px_rgba(217,109,114,0.15)]"
                >
                  Explore Jobs
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-lg border border-[#d4af5a]/20 bg-[#d4af5a]/[0.035] px-6 py-3 font-semibold text-[#d4af5a] transition hover:border-[#d4af5a]/40 hover:bg-[#d4af5a]/[0.06]"
                >
                  Create Account
                </Link>

              </div>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-600">

                <span className="flex items-center gap-1.5">
                  <CheckCircle2
                    size={14}
                    className="text-[#d4af5a]"
                  />
                  Resume Analysis
                </span>

                <span className="flex items-center gap-1.5">
                  <CheckCircle2
                    size={14}
                    className="text-[#d4af5a]"
                  />
                  AI Interviews
                </span>

                <span className="flex items-center gap-1.5">
                  <CheckCircle2
                    size={14}
                    className="text-[#d4af5a]"
                  />
                  Career Roadmap
                </span>

              </div>
            </div>

            {/* PRODUCT PREVIEW */}
            <div className="relative">

              <div className="absolute -inset-5 rounded-3xl bg-[#d4af5a]/[0.035] blur-3xl" />

              <div className="relative rounded-2xl border border-white/[0.08] bg-[#0b0b0c] shadow-2xl shadow-black/60">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">

                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-white/10" />
                    <span className="h-2 w-2 rounded-full bg-white/10" />
                    <span className="h-2 w-2 rounded-full bg-white/10" />
                  </div>

                  <span className="text-[10px] text-gray-700">
                    careerai.app
                  </span>

                  <Sparkles
                    size={13}
                    className="text-[#d4af5a]"
                  />

                </div>

                <div className="p-5">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-[11px] text-gray-600">
                        Career Dashboard
                      </p>

                      <h3 className="mt-1 text-base font-semibold">
                        Welcome back
                      </h3>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d4af5a]/[0.08] text-[#d4af5a]">
                      <TrendingUp size={15} />
                    </div>

                  </div>

                  {/* Resume */}
                  <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">

                    <div className="flex items-center justify-between">

                      <div>
                        <p className="text-[11px] text-gray-600">
                          Resume Score
                        </p>

                        <p className="mt-1 text-2xl font-bold">
                          86
                          <span className="text-xs text-gray-600">
                            /100
                          </span>
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#d4af5a]/30 text-xs font-bold text-[#d4af5a]">
                        86%
                      </div>

                    </div>

                    <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/5">
                      <div className="h-full w-[86%] rounded-full bg-[#d4af5a]" />
                    </div>

                    <p className="mt-2 text-[10px] text-[#d4af5a]">
                      Strong profile
                    </p>

                  </div>

                  {/* Jobs */}
                  <div className="mt-5">

                    <div className="mb-3 flex items-center justify-between">

                      <p className="text-xs font-semibold">
                        Recommended Jobs
                      </p>

                      <span className="text-[10px] text-[#d4af5a]">
                        View all
                      </span>

                    </div>

                    <div className="space-y-2">

                      <MiniJob
                        title="Frontend Developer"
                        company="Technology Company"
                        match="94%"
                      />

                      <MiniJob
                        title="React Developer"
                        company="Product Startup"
                        match="89%"
                      />

                      <MiniJob
                        title="Full Stack Developer"
                        company="Software Labs"
                        match="84%"
                      />

                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>

          {/* SEARCH */}
          <div className="mx-auto mt-14 max-w-5xl">

            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-700">
              Search opportunities
            </div>

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-1.5">

              <div className="flex flex-col gap-1.5 md:flex-row">

                <div className="flex flex-1 items-center gap-3 rounded-lg bg-black/40 px-4 py-3">
                  <Search size={17} className="text-gray-600" />

                  <input
                    type="text"
                    placeholder="Job title, skill or keyword"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-gray-700"
                  />
                </div>

                <div className="flex flex-1 items-center gap-3 rounded-lg bg-black/40 px-4 py-3">
                  <MapPin size={17} className="text-gray-600" />

                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-gray-700"
                  />
                </div>

                <Link
                  to="/jobs"
                  className="inline-flex items-center justify-center rounded-lg bg-[#d96d72] px-7 py-3 text-sm font-semibold transition hover:bg-[#e27b7f]"
                >
                  Search
                </Link>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-white/[0.06]">

        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">

          <Stat number="10K+" label="Job Opportunities" />
          <Stat number="5K+" label="Candidates" />
          <Stat number="2K+" label="AI Interviews" />
          <Stat number="500+" label="Companies" />

        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20 md:py-24">

        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af5a]">
              Career tools
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need to move forward.
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-600">
              One simple platform for your job search, interview preparation
              and career growth.
            </p>

          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">

            <Feature
              icon={<FileText size={20} />}
              title="AI Resume Analyzer"
              text="Analyze your resume and discover practical ways to improve it."
              link="/resume-analyzer"
              label="Analyze Resume"
              iconStyle="bg-[#d4af5a]/[0.08] text-[#d4af5a]"
            />

            <Feature
              icon={<Brain size={20} />}
              title="AI Mock Interview"
              text="Practice realistic interview questions and receive AI feedback."
              link="/ai-interview"
              label="Start Interview"
              iconStyle="bg-[#d96d72]/[0.08] text-[#ef8588]"
            />

            <Feature
              icon={<Target size={20} />}
              title="Career Roadmap"
              text="Follow a structured roadmap for your target career."
              link="/career-roadmap"
              label="View Roadmap"
              iconStyle="bg-[#d4af5a]/[0.08] text-[#d4af5a]"
            />

          </div>
        </div>
      </section>

      {/* JOB MATCHING */}
      <section className="px-6 pb-20">

        <div className="mx-auto max-w-7xl">

          <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0a0b]">

            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#d4af5a]/[0.05] blur-[90px]" />

            <div className="relative grid gap-10 p-7 md:grid-cols-2 md:p-10">

              <div className="flex flex-col justify-center">

                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#d4af5a]/[0.08] text-[#d4af5a]">
                  <BriefcaseBusiness size={20} />
                </div>

                <p className="text-xs font-semibold uppercase tracking-widest text-[#d4af5a]">
                  Smart job matching
                </p>

                <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                  Find jobs that fit you.
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-6 text-gray-600">
                  Discover opportunities based on your skills, profile and
                  career goals.
                </p>

                <Link
                  to="/job-matches"
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-[#d96d72] px-5 py-2.5 text-sm font-semibold transition hover:bg-[#e27b7f]"
                >
                  Explore Matches
                  <ArrowRight size={16} />
                </Link>

              </div>

              <div className="grid gap-2.5">

                <MatchCard
                  title="Frontend Developer"
                  company="Technology Company"
                  percentage="94%"
                />

                <MatchCard
                  title="React Developer"
                  company="Product Startup"
                  percentage="91%"
                />

                <MatchCard
                  title="Full Stack Developer"
                  company="Software Company"
                  percentage="87%"
                />

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-white/[0.06] bg-white/[0.015] px-6 py-20">

        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af5a]">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              From searching to getting hired.
            </h2>

          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">

            <Step
              number="01"
              title="Create Profile"
              text="Set up your professional profile."
            />

            <Step
              number="02"
              title="Upload Resume"
              text="Let AI understand your skills."
            />

            <Step
              number="03"
              title="Prepare"
              text="Practice interviews and improve."
            />

            <Step
              number="04"
              title="Get Hired"
              text="Apply and track your progress."
            />

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:py-24">

        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-[#d4af5a]/15 bg-[#0a0a0b] px-7 py-14 text-center md:px-12">

          <div className="pointer-events-none absolute left-1/2 top-[-100px] h-56 w-96 -translate-x-1/2 rounded-full bg-[#d4af5a]/[0.055] blur-[90px]" />

          <div className="relative">

            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#d4af5a]/[0.08] text-[#d4af5a]">
              <Sparkles size={20} />
            </div>

            <h2 className="mt-5 text-3xl font-bold md:text-4xl">
              Ready for your next opportunity?
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-600">
              Improve your profile, prepare for interviews and discover your
              next career opportunity.
            </p>

            <Link
              to="/signup"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#d96d72] px-6 py-3 text-sm font-semibold transition hover:bg-[#e27b7f] hover:shadow-[0_8px_25px_rgba(217,109,114,0.15)]"
            >
              Get Started
              <ArrowRight size={17} />
            </Link>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] px-6 py-8">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>

            <div className="flex items-center gap-2">

              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#d4af5a] text-black">
                <Sparkles size={13} />
              </div>

              <span className="font-bold">
                CareerAI
              </span>

            </div>

            <p className="mt-1 text-xs text-gray-700">
              AI-powered career companion.
            </p>

          </div>

          <div className="flex flex-wrap gap-5 text-xs text-gray-600">

            <Link
              to="/jobs"
              className="transition hover:text-[#d4af5a]"
            >
              Jobs
            </Link>

            <Link
              to="/resume-analyzer"
              className="transition hover:text-[#d4af5a]"
            >
              Resume
            </Link>

            <Link
              to="/ai-interview"
              className="transition hover:text-[#d4af5a]"
            >
              Interview
            </Link>

            <Link
              to="/career-roadmap"
              className="transition hover:text-[#d4af5a]"
            >
              Roadmap
            </Link>

          </div>

          <p className="text-xs text-gray-700">
            © 2026 CareerAI
          </p>

        </div>
      </footer>
    </div>
  );
}


/* =========================
   SMALL COMPONENTS
========================= */

function Stat({ number, label }) {
  return (
    <div className="border-r border-white/[0.06] px-4 py-7 text-center last:border-r-0">

      <p className="text-2xl font-bold md:text-3xl">
        {number}
      </p>

      <p className="mt-1.5 text-[11px] text-gray-700 sm:text-xs">
        {label}
      </p>

    </div>
  );
}


function Feature({
  icon,
  title,
  text,
  link,
  label,
  iconStyle,
}) {
  return (
    <div className="group rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 transition duration-200 hover:-translate-y-1 hover:border-[#d4af5a]/25 hover:bg-white/[0.035]">

      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconStyle}`}
      >
        {icon}
      </div>

      <h3 className="mt-5 text-base font-semibold">
        {title}
      </h3>

      <p className="mt-2 min-h-[48px] text-xs leading-5 text-gray-600">
        {text}
      </p>

      <Link
        to={link}
        className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#d4af5a] transition-all group-hover:gap-2.5"
      >
        {label}
        <ArrowRight size={14} />
      </Link>

    </div>
  );
}


function MiniJob({ title, company, match }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.015] px-3 py-2.5 transition hover:border-[#d4af5a]/15">

      <div className="flex items-center gap-3">

        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#d4af5a]/[0.07] text-[#d4af5a]">
          <BriefcaseBusiness size={13} />
        </div>

        <div>

          <p className="text-[11px] font-semibold">
            {title}
          </p>

          <p className="text-[9px] text-gray-700">
            {company}
          </p>

        </div>
      </div>

      <span className="text-[10px] font-semibold text-[#d4af5a]">
        {match}
      </span>

    </div>
  );
}


function MatchCard({ title, company, percentage }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3 transition duration-200 hover:border-[#d4af5a]/20">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d4af5a]/[0.07] text-[#d4af5a]">
          <BriefcaseBusiness size={15} />
        </div>

        <div>

          <h3 className="text-sm font-semibold">
            {title}
          </h3>

          <p className="mt-0.5 text-[10px] text-gray-700">
            {company}
          </p>

        </div>
      </div>

      <div className="text-right">

        <p className="text-sm font-bold text-[#d4af5a]">
          {percentage}
        </p>

        <p className="text-[9px] text-gray-700">
          match
        </p>

      </div>

    </div>
  );
}


function Step({ number, title, text }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#080808] p-5 transition duration-200 hover:border-[#d4af5a]/20">

      <span className="text-3xl font-black text-[#d4af5a]/20">
        {number}
      </span>

      <h3 className="mt-4 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-gray-700">
        {text}
      </p>

    </div>
  );
}


export default Home;