const axios = require("axios");
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const protect = require("../middleware/authMiddleware");
const parseResume = require("../utils/resumeParser");
const Resume = require("../models/Resume");

const router = express.Router();

router.use((req, res, next) => {
  console.log("RESUME ROUTE HIT:", req.method, req.url);
  next();
});

// ===============================
// MULTER CONFIG
// ===============================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC and DOCX files are allowed"));
    }
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// ===============================
// UPLOAD RESUME
// ===============================

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Please upload a resume",
        });
      }

      const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        req.file.filename
      );

      const resumeText = await parseResume(
        filePath,
        req.file.mimetype
      );

      const resume = await Resume.create({
        user: req.user.id,
        originalName: req.file.originalname,
        fileName: req.file.filename,
        filePath: `/uploads/${req.file.filename}`,
        resumeText,
      });

      res.status(200).json({
        message: "Resume uploaded and parsed successfully",

        file: {
          originalName: req.file.originalname,
          fileName: req.file.filename,
          size: req.file.size,
          path: `/uploads/${req.file.filename}`,
        },

        resumeId: resume._id,
        resumeText,
      });
    } catch (error) {
      console.error("Resume parsing error:", error);

      if (req.file) {
        const filePath = path.join(
          __dirname,
          "..",
          "uploads",
          req.file.filename
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      res.status(500).json({
        message: "Unable to process resume",
        error: error.message,
      });
    }
  }
);

// ===============================
// AI RESUME ANALYSIS - OLLAMA
// ===============================

router.post("/analyze/:id", protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    if (!resume.resumeText) {
      return res.status(400).json({
        message: "Resume text not available",
      });
    }
const prompt = `
You are an expert ATS resume analyzer and professional career advisor.

Analyze the following resume carefully and return ONLY valid JSON.

Your analysis must be based ONLY on information explicitly present in the resume.

IMPORTANT RULES:

1. DO NOT invent any information.
2. DO NOT assume skills, experience, education, projects, companies, or technologies that are not mentioned.
3. DO NOT contradict the resume.
4. missingSkills must contain only useful skills that are genuinely missing for the identified target role.
5. Do NOT put a skill in missingSkills if that skill is already present anywhere in the resume.
6. Extract education exactly from the resume.
7. Extract work experience/internships exactly from the resume.
8. Extract projects exactly from the resume.
9. For project tools/technologies, include ONLY technologies explicitly mentioned for that project.
10. Do not assign React, Node.js, GitHub, or any other technology to a project unless the resume indicates that technology was used in that project.
11. Weaknesses must be based on actual gaps or weaknesses visible in the resume.
12. Never say the candidate has "no backend experience" if backend technologies, backend projects, or backend internships are present in the resume.
13. Limited professional experience can be mentioned as a weakness if appropriate.
14.ATS SCORE GUIDELINES:

Calculate the ATS score realistically from 1 to 100.

Consider these factors:

- Resume structure and readability: 15 points
- Relevant technical skills and keywords: 20 points
- Education: 10 points
- Professional experience/internships: 15 points
- Projects and practical experience: 15 points
- Target-role relevance: 10 points
- Achievements/certifications: 5 points
- Overall completeness and professionalism: 10 points

Do not automatically give a high score.

A student/fresher resume with good skills and projects but limited professional experience will normally fall around 65-85.

A strong resume with relevant internships, projects, achievements, strong keywords, and good structure may score 80-95.

Only give 95+ when the resume is exceptionally strong and highly relevant.

The score must reflect the actual resume quality.
Do not increase the score simply because the candidate has many technologies listed.

15. atsScore MUST be an integer between 1 and 100. NEVER return 0.

16. targetRole MUST contain exactly ONE clean job title.
Do not use "/" or multiple roles.

17. summary MUST NOT be empty.

18. strengths MUST contain at least 3 items.

19. weaknesses MUST contain at least 2 items.

20. suggestions MUST contain at least 3 practical items.

21. missingSkills should contain 0 or more items depending on the resume.

22. If information is unavailable, use an empty array or a suitable neutral statement instead of inventing information.

23. Return JSON only. Do not return markdown.

24. Do not include \`\`\`json or any other formatting.

Return exactly this JSON structure:

{
  "atsScore": 0,
  "targetRole": "",
  "summary": "",
  "skills": [],
  "missingSkills": [],
  "education": [
    {
      "institution": "",
      "degree": "",
      "period": ""
    }
  ],
  "experience": [
    {
      "company": "",
      "jobTitle": "",
      "period": "",
      "description": ""
    }
  ],
  "projects": [
    {
      "title": "",
      "tools": [],
      "description": ""
    }
  ],
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}

RESUME:
${resume.resumeText}
`;
    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3.2",
        prompt: prompt,
        stream: false,
        format: "json",
      }
    );

    const aiText = response.data.response;

    let analysis;

    try {
      analysis = JSON.parse(aiText);
    } catch (error) {
      return res.status(500).json({
        message: "AI returned invalid JSON",
        rawResponse: aiText,
      });
    }

    resume.analysis = analysis;

    await resume.save();

    res.status(200).json({
      message: "Resume analyzed successfully",
      analysis,
    });
  } catch (error) {
    console.error("AI analysis error:", error);

    res.status(500).json({
      message: "Unable to analyze resume",
      error: error.message,
    });
  }
});

// ===============================
// TEST ROUTE
// ===============================

router.get("/test", (req, res) => {
  console.log("RESUME TEST ROUTE HIT");

  res.json({
    message: "Resume route is working",
  });
});

// ===============================
// GET RESUME
// ===============================

router.get("/:id", protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    res.status(200).json({
      resume,
    });
  } catch (error) {
    console.error("Get resume error:", error);

    res.status(500).json({
      message: "Unable to get resume",
    });
  }
});


module.exports = router;