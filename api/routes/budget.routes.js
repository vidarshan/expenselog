const express = require("express");
const router = express.Router();

const budgetController = require("../controllers/budget.controller");
const authMiddleware = require("../middleware/auth.middleware");

router
  .route("/")
  .get(authMiddleware, budgetController.getBudgetOverview)
  .post(authMiddleware, budgetController.createOrEditBudget);
router.route("/:id").delete(authMiddleware, budgetController.deleteBudget);

module.exports = router;
