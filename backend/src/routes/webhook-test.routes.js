const express = require("express");

const router = express.Router();

const receivedWebhooks = [];

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Webhook test receiver aktif",
    endpoints: {
      receive: "POST /webhook-test/receive",
      logs: "GET /webhook-test/logs",
    },
    note: "Endpoint /receive hanya menerima POST dari sistem webhook, bukan dibuka langsung lewat browser.",
  });
});

router.get("/receive", (req, res) => {
  res.status(405).json({
    success: false,
    message: "Endpoint ini hanya untuk menerima webhook dengan method POST.",
    correct_usage: {
      method: "POST",
      url: "http://localhost:5000/webhook-test/receive",
    },
    note: "Jangan buka URL ini langsung di browser. Buat transaksi, buka paymentUrl, lalu klik simulasi pembayaran.",
  });
});

router.post("/receive", (req, res) => {
  const data = {
    id: `wh_received_${Date.now()}`,
    headers: {
      event: req.headers["x-sandboxpay-event"] || null,
      signature: req.headers["x-sandboxpay-signature"] || null,
      contentType: req.headers["content-type"] || null,
    },
    body: req.body,
    receivedAt: new Date().toISOString(),
  };

  receivedWebhooks.unshift(data);

  if (receivedWebhooks.length > 20) {
    receivedWebhooks.pop();
  }

  return res.status(200).json({
    success: true,
    message: "Webhook berhasil diterima oleh dummy receiver",
    data,
  });
});

router.get("/logs", (req, res) => {
  return res.json({
    success: true,
    message: "Dummy webhook logs",
    data: {
      total: receivedWebhooks.length,
      logs: receivedWebhooks,
    },
  });
});

router.delete("/logs", (req, res) => {
  receivedWebhooks.length = 0;

  return res.json({
    success: true,
    message: "Dummy webhook logs berhasil dikosongkan",
  });
});

module.exports = router;