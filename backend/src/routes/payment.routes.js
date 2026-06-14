const express = require("express");

const {
  showPaymentPage,
  simulatePayment,
} = require("../controllers/payment.controller");

const router = express.Router();

router.get("/:transactionId", showPaymentPage);
router.post("/:transactionId/simulate", simulatePayment);

module.exports = router;