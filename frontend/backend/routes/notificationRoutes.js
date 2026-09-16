const express = require("express");
const Notification = require("../models/Notification");

const router = express.Router();

// Get notifications for a user
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.params.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);

    res.status(500).json({
      message: "Unable to fetch notifications",
      error: error.message,
    });
  }
});

// Mark one notification as read
router.put("/:id/read", async (req, res) => {
  try {
    const notification =
      await Notification.findByIdAndUpdate(
        req.params.id,
        {
          isRead: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "Mark notification read error:",
      error
    );

    res.status(500).json({
      message: "Unable to update notification",
      error: error.message,
    });
  }
});

// Mark all notifications as read
router.put("/user/:userId/read-all", async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.params.userId,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error(
      "Mark all notifications read error:",
      error
    );

    res.status(500).json({
      message: "Unable to update notifications",
      error: error.message,
    });
  }
});

// Delete one notification
router.delete("/:id", async (req, res) => {
  try {
    const notification =
      await Notification.findByIdAndDelete(
        req.params.id
      );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete notification error:",
      error
    );

    res.status(500).json({
      message: "Unable to delete notification",
      error: error.message,
    });
  }
});

module.exports = router;
