import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  Loader2,
} from "lucide-react";
import Navbar from "../components/Navbar";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
        "http://localhost:5000/api/auth/login",
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
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setMessage("Login successful!");

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

      {/* =========================
          NAVBAR
      ========================= */}
      <Navbar />

      <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-5 py-12">

        {/* Background Glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4af37]/[0.045] blur-3xl" />

        <div className="relative w-full max-w-md">

          {/* =========================
              HEADER
          ========================= */}
          <div className="mb-7 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#d4af37]/25 bg-[#d4af37]/10">
              <LockKeyhole
                size={21}
                className="text-[#d4af37]"
              />
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9aa45]">
              CareerAI
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Login to continue your career journey.
            </p>

          </div>

          {/* =========================
              LOGIN CARD
          ========================= */}
          <div className="rounded-2xl border border-[#d4af37]/15 bg-[#0a0a0a] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] sm:p-7">

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* =========================
                  EMAIL
              ========================= */}
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
                    className="w-full rounded-xl border border-gray-800 bg-[#050505] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/15"
                  />

                </div>

              </div>

              {/* =========================
                  PASSWORD
              ========================= */}
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
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-gray-800 bg-[#050505] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/15"
                  />

                </div>

              </div>

              {/* =========================
                  MESSAGE
              ========================= */}
              {message && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    message.includes("successful")
                      ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-400"
                      : "border-red-500/20 bg-red-500/[0.06] text-red-400"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* =========================
                  LOGIN BUTTON
              ========================= */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d4af37] py-3 text-sm font-bold text-black transition hover:bg-[#e6c35c] hover:shadow-[0_8px_25px_rgba(212,175,55,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight size={16} />
                  </>
                )}

              </button>

            </form>

            {/* =========================
                SIGNUP
            ========================= */}
            <div className="mt-6 border-t border-[#d4af37]/10 pt-5 text-center">

              <p className="text-sm text-gray-600">
                Don't have an account?{" "}

                <Link
                  to="/signup"
                  className="font-medium text-[#d4af37] transition hover:text-[#e6c35c]"
                >
                  Sign up
                </Link>
              </p>

            </div>

          </div>

          {/* =========================
              BOTTOM TEXT
          ========================= */}
          <p className="mt-5 text-center text-[11px] text-gray-700">
            AI-powered tools to help you move forward.
          </p>

        </div>
      </main>
    </div>
  );
}

export default Login;