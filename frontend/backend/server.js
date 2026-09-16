require("dotenv").config();
const aiInterviewRoutes = require("./routes/aiInterviewRoutes");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const jobRoutes = require("./routes/jobRoutes");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const protect = require("./middleware/authMiddleware");
const matchRoutes = require("./routes/matchRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({
    message: "CareerAI backend is running",
  });
});

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/ai-interview", aiInterviewRoutes);
app.use("/api/applications", applicationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});