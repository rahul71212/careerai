
const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/evaluate", async (req, res) => {
  try {
    const { role, question, answer, difficulty } = req.body;

    if (!role || !question || !answer) {
      return res.status(400).json({
        message: "Role, question and answer are required.",
      });
    }

    const prompt = `
You are an experienced technical interviewer.

Evaluate the candidate's interview answer.

Candidate Role: ${role}
Difficulty: ${difficulty || "Intermediate"}

Interview Question:
${question}

Candidate Answer:
${answer}

Evaluate the answer fairly for a fresher/early-career candidate.

Return ONLY valid JSON in exactly this structure:

{
  "score": 0,
  "technicalScore": 0,
  "communicationScore": 0,
  "strengths": [],
  "weaknesses": [],
  "feedback": "",
  "suggestion": ""
}

Rules:
- score must be between 0 and 100.
- technicalScore must be between 0 and 100.
- communicationScore must be between 0 and 100.
- strengths must contain 2 to 4 short points.
- weaknesses must contain 1 to 3 short points.
- feedback should briefly explain how good or weak the answer was.
- suggestion should tell the candidate how to improve the answer.
- Do not use markdown.
- Do not add anything outside the JSON.
`;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3.2:latest",
        prompt,
        stream: false,
        format: "json",
      },
      {
        timeout: 120000,
      }
    );

    const rawResponse = response.data.response;

    let evaluation;

    try {
      evaluation = JSON.parse(rawResponse);
    } catch (parseError) {
      console.error("AI JSON parse error:", rawResponse);

      return res.status(500).json({
        message: "AI returned an invalid response.",
      });
    }

    res.status(200).json({
      evaluation,
    });
  } catch (error) {
    console.error(
      "Interview evaluation error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message:
        "Unable to evaluate answer. Make sure Ollama is running.",
    });
  }
});

module.exports = router;

