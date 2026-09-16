const express = require("express");
const Job = require("../models/job");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// ===============================
// GET ALL JOBS
// Public
// ===============================
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Get jobs error:", error);

    res.status(500).json({
      message: "Unable to fetch jobs",
      error: error.message,
    });
  }
});

// ===============================
// GET SINGLE JOB
// Public
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Get job error:", error);

    res.status(500).json({
      message: "Unable to fetch job",
      error: error.message,
    });
  }
});

// ===============================
// CREATE JOB
// Admin only
// ===============================
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      description,
      skills,
      experience,
      salary,
      jobType,
      applyLink,
    } = req.body;

    if (!title || !company || !description) {
      return res.status(400).json({
        message: "Title, company and description are required",
      });
    }

    const job = await Job.create({
      title,
      company,
      location: location || "Remote",
      description,
      skills: skills || [],
      experience: experience || "Fresher",
      salary: salary || "Not specified",
      jobType: jobType || "Full Time",
      applyLink: applyLink || "",
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Create job error:", error);

    res.status(500).json({
      message: "Unable to create job",
      error: error.message,
    });
  }
});

// ===============================
// UPDATE JOB
// Admin only
// ===============================
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error("Update job error:", error);

    res.status(500).json({
      message: "Unable to update job",
      error: error.message,
    });
  }
});

// ===============================
// DELETE JOB
// Admin only
// ===============================
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete job error:", error);

    res.status(500).json({
      message: "Unable to delete job",
      error: error.message,
    });
  }
});

module.exports = router;