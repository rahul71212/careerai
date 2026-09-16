import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail, User, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Signup failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Account created successfully!");

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-5 py-10">

        {/* Premium background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4af5a]/[0.035] blur-3xl" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d96d72]/[0.025] blur-3xl" />

        <div className="relative w-full max-w-md">

          {/* Header */}
          <div className="mb-7 text-center">

            {/* Premium Icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#d4af5a]/25 bg-[#d4af5a]/[0.07] shadow-[0_0_25px_rgba(212,175,90,0.06)]">
              <User
                size={21}
                className="text-[#d4af5a]"
              />
            </div>

            <h1 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Start your journey with{" "}
              <span className="text-[#d4af5a]">CareerAI</span>.
            </p>
          </div>

          {/* Signup Card */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#0b0b0b] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.5)] sm:p-7">

            {/* Top premium line */}
            <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-[#d4af5a]/40 to-transparent" />

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Full Name */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060606] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-700 hover:border-white/[0.13] focus:border-[#d4af5a]/50 focus:ring-1 focus:ring-[#d4af5a]/10"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060606] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-700 hover:border-white/[0.13] focus:border-[#d4af5a]/50 focus:ring-1 focus:ring-[#d4af5a]/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-white/[0.08] bg-[#060606] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-700 hover:border-white/[0.13] focus:border-[#d4af5a]/50 focus:ring-1 focus:ring-[#d4af5a]/10"
                  />
                </div>

                <p className="mt-2 text-[11px] text-gray-600">
                  Password must contain at least 6 characters.
                </p>
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    message.includes("successfully")
                      ? "border-[#d4af5a]/20 bg-[#d4af5a]/[0.06] text-[#e6c875]"
                      : "border-[#d96d72]/20 bg-[#d96d72]/[0.06] text-[#ef9a9d]"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Create Account */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d96d72] py-3 text-sm font-semibold text-white transition hover:bg-[#e27b7f] hover:shadow-[0_8px_28px_rgba(217,109,114,0.18)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Login */}
            <div className="mt-6 border-t border-white/[0.06] pt-5 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-[#d4af5a] transition hover:text-[#e6c875]"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom text */}
          <p className="mt-5 text-center text-[11px] text-gray-700">
            Build your profile. Discover better opportunities.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Signup;