const express = require("express");
const { successResponse } = require("../utils/response");

const router = express.Router();

router.get("/", (req, res) => {
  return successResponse(res, "SandboxPay API is running", {
    app: "SandboxPay ID",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;