import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Bell,
  Check,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const userId = user?._id || user?.id;

  // =========================
  // FETCH NOTIFICATIONS
  // =========================
  const fetchNotifications = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Notification fetch error:", error);
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchNotifications();

      const interval = setInterval(
        fetchNotifications,
        10000
      );

      return () => clearInterval(interval);
    }
  }, [token, userId]);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // =========================
  // MARK ONE AS READ
  // =========================
  const markAsRead = async (notificationId) => {
    try {
      await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
        }
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Mark notification read error:",
        error
      );
    }
  };

  // =========================
  // MARK ALL AS READ
  // =========================
  const markAllAsRead = async () => {
    if (!userId) return;

    try {
      await fetch(
        `http://localhost:5000/api/notifications/user/${userId}/read-all`,
        {
          method: "PUT",
        }
      );

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error(
        "Mark all notifications read error:",
        error
      );
    }
  };

  // =========================
  // DELETE NOTIFICATION
  // =========================
  const deleteNotification = async (notificationId) => {
    try {
      await fetch(
        `http://localhost:5000/api/notifications/${notificationId}`,
        {
          method: "DELETE",
        }
      );

      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            notification._id !== notificationId
        )
      );
    } catch (error) {
      console.error(
        "Delete notification error:",
        error
      );
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("resumeId");

    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-[#3d3215] bg-[#0b0905]/95 px-8 text-white backdrop-blur-md">

      {/* =========================
          LOGO
      ========================= */}
      <Link
        to="/"
        className="group flex items-center gap-2"
      >
        <BriefcaseBusiness
          size={28}
          className="text-[#b89532] transition group-hover:text-[#c9a646]"
        />

        <span className="text-xl font-bold tracking-wide text-white">
          Career<span className="text-[#b89532]">AI</span>
        </span>
      </Link>

      {/* =========================
          MAIN NAVIGATION
      ========================= */}
      <div className="hidden items-center gap-7 md:flex">

        <Link
          to="/jobs"
          className="text-sm font-medium text-gray-400 transition hover:text-[#b89532]"
        >
          Jobs
        </Link>

        <Link
          to="/job-matches"
          className="text-sm font-medium text-gray-400 transition hover:text-[#b89532]"
        >
          Job Matches
        </Link>

        <Link
          to="/ai-interview"
          className="text-sm font-medium text-gray-400 transition hover:text-[#b89532]"
        >
          AI Interview
        </Link>

        <Link
          to="/resume-analyzer"
          className="text-sm font-medium text-gray-400 transition hover:text-[#b89532]"
        >
          Resume Analyzer
        </Link>

        <Link
          to="/career-roadmap"
          className="text-sm font-medium text-gray-400 transition hover:text-[#b89532]"
        >
          Career Roadmap
        </Link>

      </div>

      {/* =========================
          RIGHT SIDE
      ========================= */}
      <div className="flex items-center gap-2">

        {token && user ? (
          <>
            {/* My Applications */}
            <Link
              to="/my-applications"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition hover:bg-[#171208] hover:text-[#b89532]"
            >
              My Applications
            </Link>

            {/* Dashboard */}
            <Link
              to="/dashboard"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition hover:bg-[#171208] hover:text-[#b89532]"
            >
              Dashboard
            </Link>

            {/* Admin Panel */}
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="rounded-lg border border-[#66521c] bg-[#9a7b24]/10 px-4 py-2 text-sm font-semibold text-[#b89532] transition hover:border-[#9a7b24] hover:bg-[#9a7b24]/20 hover:text-[#c9a646]"
              >
                Admin Panel
              </Link>
            )}

            {/* =========================
                NOTIFICATION
            ========================= */}
            <div className="relative">

              <button
                onClick={() =>
                  setShowNotifications(
                    !showNotifications
                  )
                }
                className="relative rounded-lg p-3 text-gray-400 transition hover:bg-[#171208] hover:text-[#b89532]"
                title="Notifications"
              >
                <Bell size={21} />

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#9a7b24] px-1 text-[10px] font-bold text-black">
                    {unreadCount > 9
                      ? "9+"
                      : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-14 z-50 w-96 overflow-hidden rounded-2xl border border-[#493b18] bg-[#0d0b07] shadow-[0_20px_60px_rgba(0,0,0,0.8)]">

                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-[#2c2511] px-5 py-4">

                    <div>
                      <h3 className="font-semibold text-white">
                        Notifications
                      </h3>

                      <p className="mt-0.5 text-xs text-gray-500">
                        {unreadCount} unread
                      </p>
                    </div>

                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-1 text-xs font-medium text-[#b89532] transition hover:text-[#c9a646]"
                      >
                        <Check size={14} />
                        Mark all read
                      </button>
                    )}

                  </div>

                  {/* Notifications */}
                  <div className="max-h-96 overflow-y-auto">

                    {notifications.length === 0 ? (
                      <div className="px-4 py-12 text-center">

                        <Bell
                          size={32}
                          className="mx-auto mb-3 text-[#5d4a1b]"
                        />

                        <p className="text-sm text-gray-500">
                          No notifications yet
                        </p>

                      </div>
                    ) : (
                      notifications.map(
                        (notification) => (
                          <div
                            key={notification._id}
                            className={`border-b border-[#24200f] px-4 py-4 transition hover:bg-[#151107] ${
                              !notification.isRead
                                ? "bg-[#9a7b24]/[0.035]"
                                : ""
                            }`}
                          >

                            <div className="flex gap-3">

                              {/* Notification Icon */}
                              <div
                                className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                  notification.type ===
                                  "selected"
                                    ? "bg-green-500/10 text-green-400"
                                    : notification.type ===
                                      "rejected"
                                    ? "bg-red-500/10 text-red-400"
                                    : notification.type ===
                                      "interview"
                                    ? "bg-[#9a7b24]/10 text-[#c9a646]"
                                    : "bg-[#9a7b24]/10 text-[#b89532]"
                                }`}
                              >
                                {notification.type ===
                                "selected"
                                  ? "🎉"
                                  : notification.type ===
                                    "rejected"
                                  ? "❌"
                                  : notification.type ===
                                    "interview"
                                  ? "🎤"
                                  : "📄"}
                              </div>

                              {/* Content */}
                              <div className="min-w-0 flex-1">

                                <div className="flex items-start justify-between gap-2">

                                  <h4 className="text-sm font-semibold text-gray-100">
                                    {notification.title}
                                  </h4>

                                  <button
                                    onClick={() =>
                                      deleteNotification(
                                        notification._id
                                      )
                                    }
                                    className="text-gray-600 transition hover:text-red-400"
                                    title="Delete"
                                  >
                                    <X size={15} />
                                  </button>

                                </div>

                                <p className="mt-1 text-xs leading-5 text-gray-500">
                                  {notification.message}
                                </p>

                                <div className="mt-2 flex items-center justify-between">

                                  <span className="text-[10px] text-gray-600">
                                    {new Date(
                                      notification.createdAt
                                    ).toLocaleString()}
                                  </span>

                                  {!notification.isRead && (
                                    <button
                                      onClick={() =>
                                        markAsRead(
                                          notification._id
                                        )
                                      }
                                      className="text-xs font-medium text-[#b89532] transition hover:text-[#c9a646]"
                                    >
                                      Mark as read
                                    </button>
                                  )}

                                </div>

                              </div>
                            </div>

                          </div>
                        )
                      )
                    )}

                  </div>
                </div>
              )}
            </div>

            {/* =========================
                LOGOUT
            ========================= */}
            <button
              onClick={handleLogout}
              className="ml-1 rounded-lg border border-[#806824] bg-[#9a7b24] px-5 py-2 text-sm font-bold text-black transition hover:bg-[#b89532] hover:shadow-[0_0_18px_rgba(154,123,36,0.18)]"
            >
              Logout
            </button>

          </>
        ) : (
          <>
            {/* Login */}
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 transition hover:text-[#b89532]"
            >
              Login
            </Link>

            {/* Sign Up */}
            <Link
              to="/signup"
              className="rounded-lg border border-[#806824] bg-[#9a7b24] px-5 py-2 text-sm font-bold text-black transition hover:bg-[#b89532] hover:shadow-[0_0_18px_rgba(154,123,36,0.18)]"
            >
              Sign Up
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;