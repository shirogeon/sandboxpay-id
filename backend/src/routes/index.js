const express = require("express");

const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const keyRoutes = require("./key.routes");
const transactionRoutes = require("./transaction.routes");
const webhookRoutes = require("./webhook.routes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/keys", keyRoutes);
router.use("/v1/transactions", transactionRoutes);
router.use("/webhook-logs", webhookRoutes);

module.exports = router;