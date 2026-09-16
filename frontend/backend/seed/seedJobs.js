require("dotenv").config();
const mongoose = require("mongoose");
const Job = require("../models/job");

const MONGO_URI = process.env.MONGO_URI;

const jobs = [
  {
    title: "Software Development Engineer I",
    company: "Amazon",
    location: "Bengaluru / Hyderabad / Chennai",
    description:
      "Amazon is hiring Software Development Engineers to design and build scalable software systems. The role involves software development, distributed systems, algorithms, databases and working in an agile environment.",
    skills: [
      "Java",
      "Python",
      "C++",
      "Data Structures",
      "Algorithms",
      "OOP",
      "Databases",
      "Git",
    ],
    experience: "Fresher - 2026 Graduates",
    salary: "Not specified",
    jobType: "Full Time",
    applyLink:
      "https://amazon.jobs/en/jobs/10454438/software-dev-engineer-i-amazon-university-talent-acquisition",
  },
    {
    title: "Fresher AIML Developer",
    company: "HCLTech",
    location: "Noida, Uttar Pradesh",
    description:
      "Fresher AIML Developer role for recent B.Tech graduates. Work across AI and software products including data preparation, model development, deployment and monitoring.",
    skills: [
      "Python",
      "SQL",
      "Data Structures",
      "Algorithms",
      "DBMS",
      "Machine Learning",
      "Deep Learning",
      "Generative AI",
      "Git",
      "GitHub",
    ],
    experience: "Fresher",
    salary: "Not specified",
    jobType: "Full Time",
    applyLink:
      "https://careers.hcltech.com/job/Campus-Advanced-Beginner/162110-en_US",
  },

  {
    title: "Graduate Engineer Trainee",
    company: "NEC Corporation India",
    location: "Noida, Uttar Pradesh",
    description:
      "Fresher Java Developer opportunity for candidates starting their career in the IT software industry.",
    skills: [
      "Java",
      "Object Oriented Programming",
      "Software Development",
    ],
    experience: "0-1 years / Fresher",
    salary: "Not specified",
    jobType: "Full Time",
    applyLink:
      "https://careers.nec.com/",
  },
];


const seedJobs = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    await Job.deleteMany();

    await Job.insertMany(jobs);

    console.log("Jobs inserted successfully");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Seed jobs error:", error);
    process.exit(1);
  }
};


seedJobs();