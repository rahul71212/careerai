const express = require("express");
const Application = require("../models/Application");
const Notification = require("../models/Notification");
const Job = require("../models/Job");

const router = express.Router();

// Apply for a job
router.post("/", async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    if (!userId || !jobId) {
      return res.status(400).json({
        message: "User ID and Job ID are required",
      });
    }

    const existingApplication = await Application.findOne({
      user: userId,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const application = await Application.create({
      user: userId,
      job: jobId,
      status: "Applied",
    });

    // Create notification
    await Notification.create({
      user: userId,
      title: "Application Submitted",
      message: `Your application for ${job.title} at ${job.company} has been submitted successfully.`,
      type: "application",
    });

    res.status(201).json({
      message: "Job applied successfully",
      application,
    });
  } catch (error) {
    console.error("Apply job error:", error);

    res.status(500).json({
      message: "Unable to apply for job",
      error: error.message,
    });
  }
});


// Get applications for a user
router.get("/:userId", async (req, res) => {
  try {
    const applications = await Application.find({
      user: req.params.userId,
    })
      .populate("job")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Get applications error:", error);

    res.status(500).json({
      message: "Unable to fetch applications",
      error: error.message,
    });
  }
});


// Update application status
router.put("/:id", async (req, res) => {
  try {
    const { status, notes } = req.body;

    const existingApplication =
      await Application.findById(req.params.id).populate("job");

    if (!existingApplication) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    const oldStatus = existingApplication.status;

    const application =
      await Application.findByIdAndUpdate(
        req.params.id,
        {
          ...(status && { status }),
          ...(notes !== undefined && { notes }),
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate("job");

    // Create notification only when status actually changes
    if (status && status !== oldStatus) {
      let notificationType = "general";
      let notificationTitle = "Application Status Updated";

      if (status === "Interview") {
        notificationType = "interview";
        notificationTitle = "Interview Update";
      } else if (status === "Selected") {
        notificationType = "selected";
        notificationTitle = "Congratulations! 🎉";
      } else if (status === "Rejected") {
        notificationType = "rejected";
        notificationTitle = "Application Update";
      }

      await Notification.create({
        user: existingApplication.user,
        title: notificationTitle,
        message: `Your application for ${existingApplication.job.title} at ${existingApplication.job.company} is now marked as ${status}.`,
        type: notificationType,
      });
    }

    res.status(200).json({
      message: "Application updated successfully",
      application,
    });
  } catch (error) {
    console.error("Update application error:", error);

    res.status(500).json({
      message: "Unable to update application",
      error: error.message,
    });
  }
});


// Delete application
router.delete("/:id", async (req, res) => {
  try {
    const application =
      await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.status(200).json({
      message: "Application removed successfully",
    });
  } catch (error) {
    console.error("Delete application error:", error);

    res.status(500).json({
      message: "Unable to remove application",
      error: error.message,
    });
  }
});


module.exports = router;