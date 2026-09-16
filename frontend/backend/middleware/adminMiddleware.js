const User = require("../models/User");

const adminOnly = async (req, res, next) => {
  try {
    // authMiddleware se userId milna chahiye
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    req.admin = user;

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);

    res.status(500).json({
      message: "Unable to verify admin access",
      error: error.message,
    });
  }
};

module.exports = adminOnly;
