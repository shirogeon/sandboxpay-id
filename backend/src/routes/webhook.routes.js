const express = require("express");

const authMiddleware = require("../middlewares/auth.middleware");
const {
  listWebhookLogs,
  getWebhookLogDetail,
  retryWebhook,
} = require("../controllers/webhook.controller");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listWebhookLogs);
router.get("/:id", getWebhookLogDetail);
router.post("/:id/retry", retryWebhook);

module.exports = router;