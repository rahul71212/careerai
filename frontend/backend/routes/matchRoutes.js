const express = require("express");

const Resume = require("../models/Resume");
const Job = require("../models/job");

const router = express.Router();

// Normalize skill names
const normalizeSkill = (skill) => {
  return skill
    .toLowerCase()
    .trim()
    .replace(/[.-]/g, "")
    .replace(/\s+/g, "");
};

// Check whether two skills are equivalent
const skillsMatch = (resumeSkill, jobSkill) => {
  const resume = normalizeSkill(resumeSkill);
  const job = normalizeSkill(jobSkill);

  // Exact match
  if (resume === job) {
    return true;
  }

  // Common skill aliases
  const aliases = {
    react: ["react", "reactjs"],
    node: ["node", "nodejs"],
    express: ["express", "expressjs"],
    javascript: ["javascript", "js"],
    typescript: ["typescript", "ts"],
    mongodb: ["mongodb", "mongo"],
    git: ["git", "github"],
    tailwind: ["tailwind", "tailwindcss"],
    html: ["html", "html5"],
    css: ["css", "css3"],
  };

  for (const values of Object.values(aliases)) {
    if (values.includes(resume) && values.includes(job)) {
      return true;
    }
  }

  return false;
};

// Match resume with jobs
router.get("/:resumeId", async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    const jobs = await Job.find();

    const resumeSkills = resume.analysis?.skills || [];

    const matches = jobs.map((job) => {
      const requiredSkills = job.skills || [];

      // Find matched skills
      const matchedSkills = requiredSkills.filter((jobSkill) =>
        resumeSkills.some((resumeSkill) =>
          skillsMatch(resumeSkill, jobSkill)
        )
      );

      // Calculate match percentage
      const matchPercentage =
        requiredSkills.length > 0
          ? Math.round(
              (matchedSkills.length / requiredSkills.length) * 100
            )
          : 0;

      return {
        ...job.toObject(),
        matchPercentage,
        matchedSkills,
      };
    });

    // Highest match first
    matches.sort(
      (a, b) => b.matchPercentage - a.matchPercentage
    );

    res.status(200).json(matches);
  } catch (error) {
    console.error("Job matching error:", error);

    res.status(500).json({
      message: "Unable to match jobs",
      error: error.message,
    });
  }
});

module.exports = router;