const express = require("express");

const authMiddleware = require("../middlewares/auth.middleware");
const {
  getApiKeys,
  generateNewApiKey,
  resetApiKey,
} = require("../controllers/key.controller");

const router = express.Router();

router.get("/", authMiddleware, getApiKeys);
router.post("/generate", authMiddleware, generateNewApiKey);
router.post("/reset", authMiddleware, resetApiKey);

module.exports = router;