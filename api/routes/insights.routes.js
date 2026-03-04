const express = require("express");
const router = express.Router();

const insightsController = require("../controllers/insights.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.route("/").get(authMiddleware, insightsController.getInsights);

module.exports = router;
