import JobMatches from "./pages/JobMatches";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import AIInterview from "./pages/AIInterview";
import CareerRoadmap from "./pages/CareerRoadmap";
import CandidateDashboard from "./pages/CandidateDashboard";
import MyApplications from "./pages/MyApplications";
import JobDetails from "./pages/JobDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard"
          element={<CandidateDashboard />}
        />

        <Route path="/" element={<Home />} />

        <Route path="/jobs" element={<Jobs />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route
          path="/job-matches"
          element={<JobMatches />}
        />

        <Route
          path="/resume-analyzer"
          element={<ResumeAnalyzer />}
        />

        <Route
          path="/ai-interview"
          element={<AIInterview />}
        />

        <Route
          path="/career-roadmap"
          element={<CareerRoadmap />}
        />

        <Route
          path="/my-applications"
          element={<MyApplications />}
        />
        <Route path="/jobs/:id" element={<JobDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;