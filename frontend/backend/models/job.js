const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      default: "Remote",
    },

    description: {
      type: String,
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: {
      type: String,
      default: "Fresher",
    },

    salary: {
      type: String,
      default: "Not specified",
    },

    jobType: {
      type: String,
      default: "Full Time",
    },

    applyLink: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Job || mongoose.model("Job", jobSchema);