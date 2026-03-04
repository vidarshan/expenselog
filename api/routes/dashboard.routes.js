const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboard.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.route("/").get(authMiddleware, dashboardController.getDashboard);
router
  .route("/compare")
  .get(authMiddleware, dashboardController.getCategoryComparison);

module.exports = router;
