const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    resumeText: {
      type: String,
      required: true,
    },

    analysis: {
      atsScore: {
        type: Number,
        default: 0,
      },

      summary: {
        type: String,
        default: "",
      },

      skills: {
        type: [String],
        default: [],
      },

      missingSkills: {
        type: [String],
        default: [],
      },analysis: {
  atsScore: { type: Number, default: 0 },
  summary: { type: String, default: "" },
  targetRole: { type: String, default: "" },

  skills: { type: [String], default: [] },
  missingSkills: { type: [String], default: [] },

  education: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },

  experience: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },

  projects: {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
  },

  strengths: { type: [String], default: [] },
  weaknesses: { type: [String], default: [] },
  suggestions: { type: [String], default: [] },
},

     education: { type: [mongoose.Schema.Types.Mixed], default: [] },
experience: { type: [mongoose.Schema.Types.Mixed], default: [] },
projects: { type: [mongoose.Schema.Types.Mixed], default: [] },

      strengths: {
        type: [String],
        default: [],
      },

      weaknesses: {
        type: [String],
        default: [],
      },

      suggestions: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);