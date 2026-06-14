const express = require("express");

const apiKeyMiddleware = require("../middlewares/apiKey.middleware");
const {
  createTransaction,
  listTransactions,
  getTransactionDetail,
  cancelTransaction,
} = require("../controllers/transaction.controller");

const router = express.Router();

router.use(apiKeyMiddleware);

router.post("/", createTransaction);
router.get("/", listTransactions);
router.get("/:transactionId", getTransactionDetail);
router.post("/:transactionId/cancel", cancelTransaction);

module.exports = router;