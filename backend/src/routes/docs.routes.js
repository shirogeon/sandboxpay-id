const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  const baseUrl =
    process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;

  res.send(`<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SandboxPay ID API Documentation</title>

  <style>
    * {
      box-sizing: border-box;
    }

    :root {
      --bg: #f7f3ea;
      --card: #ffffff;
      --text: #1f1f23;
      --muted: #706a64;
      --border: #e5ded2;
      --primary: #7c3aed;
      --primary-dark: #6d28d9;
      --primary-soft: #ede9fe;
      --accent: #f59e0b;
      --dark: #241f2f;
      --success: #4d7c0f;
      --success-soft: #ecfccb;
      --shadow: 0 18px 45px rgba(31, 31, 35, 0.08);
    }

    body {
      margin: 0;
      background:
        radial-gradient(circle at top left, rgba(124, 58, 237, 0.12), transparent 28rem),
        radial-gradient(circle at top right, rgba(245, 158, 11, 0.14), transparent 26rem),
        var(--bg);
      color: var(--text);
      font-family: Arial, sans-serif;
    }

    a {
      color: inherit;
    }

    .nav {
      min-height: 74px;
      padding: 0 28px;
      background: rgba(255,255,255,.84);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      backdrop-filter: blur(16px);
      z-index: 10;
    }

    .brand {
      font-size: 21px;
      font-weight: 900;
      letter-spacing: -0.04em;
    }

    .nav a {
      text-decoration: none;
      font-weight: 800;
      background: white;
      border: 1px solid var(--border);
      padding: 10px 14px;
      border-radius: 999px;
    }

    .container {
      max-width: 1120px;
      margin: auto;
      padding: 54px 24px;
    }

    .hero {
      display: grid;
      grid-template-columns: 1.1fr .9fr;
      gap: 28px;
      align-items: center;
      margin-bottom: 36px;
    }

    .eyebrow {
      color: var(--primary);
      font-weight: 900;
      font-size: 13px;
      letter-spacing: .18em;
      text-transform: uppercase;
    }

    h1 {
      font-size: clamp(42px, 6vw, 72px);
      line-height: .98;
      margin: 12px 0 18px;
      letter-spacing: -.07em;
    }

    h2 {
      font-size: 34px;
      margin: 0 0 12px;
      letter-spacing: -.05em;
    }

    h3 {
      margin: 0 0 10px;
    }

    p {
      color: var(--muted);
      line-height: 1.75;
    }

    .card {
      background: rgba(255,255,255,.88);
      border: 1px solid var(--border);
      border-radius: 22px;
      padding: 24px;
      box-shadow: var(--shadow);
      margin-bottom: 16px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 16px;
    }

    .endpoint {
      border-left: 5px solid var(--primary);
    }

    .method {
      display: inline-block;
      background: var(--primary-soft);
      color: var(--primary-dark);
      padding: 7px 10px;
      border-radius: 999px;
      font-weight: 900;
      font-size: 12px;
      margin-right: 8px;
    }

    code {
      color: var(--primary-dark);
      font-weight: 800;
    }

    pre {
      margin: 14px 0 0;
      background: var(--dark);
      color: #f7f3ea;
      padding: 18px;
      border-radius: 16px;
      overflow-x: auto;
      line-height: 1.65;
      font-size: 13px;
    }

    .baseUrl {
      background: #f5f0ff;
      border: 1px solid #ddd6fe;
      border-radius: 18px;
      padding: 18px;
      word-break: break-all;
    }

    .notice {
      background: #fff7ed;
      border: 1px solid #fed7aa;
      color: #7c2d12;
      border-radius: 18px;
      padding: 18px;
      line-height: 1.7;
      margin-bottom: 16px;
    }

    .success {
      background: var(--success-soft);
      color: var(--success);
      padding: 6px 10px;
      border-radius: 999px;
      font-weight: 900;
      font-size: 12px;
      display: inline-block;
    }

    @media (max-width: 860px) {
      .hero,
      .grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>

<body>
  <nav class="nav">
    <div class="brand">SandboxPay ID Docs</div>
    <a href="${baseUrl}/api/health">Health Check</a>
  </nav>

  <main class="container">
    <section class="hero">
      <div>
        <p class="eyebrow">API Documentation</p>
        <h1>Mock Payment Gateway API untuk testing developer.</h1>
        <p>
          Gunakan dokumentasi ini untuk mencoba authentication, API key,
          transaction API, payment simulator, dan webhook callback.
        </p>
      </div>

      <div class="card">
        <h3>Base URL</h3>
        <div class="baseUrl">
          <code>${baseUrl}</code>
        </div>
        <p>
          Semua endpoint production menggunakan base URL di atas.
        </p>
      </div>
    </section>

    <div class="notice">
      SandboxPay ID hanya untuk edukasi dan testing. Sistem ini tidak memproses
      uang asli, tidak terhubung ke bank, e-wallet, QRIS, atau payment gateway resmi.
    </div>

    <section class="grid">
      <div class="card">
        <h3>Authentication</h3>
        <p>
          Register dan login menghasilkan JWT token untuk akses dashboard API key.
        </p>
      </div>

      <div class="card">
        <h3>API Key</h3>
        <p>
          Secret API key dipakai sebagai Bearer Token untuk endpoint transaksi.
        </p>
      </div>

      <div class="card">
        <h3>Transaction</h3>
        <p>
          Buat transaksi sandbox dan dapatkan payment URL untuk simulasi pembayaran.
        </p>
      </div>

      <div class="card">
        <h3>Webhook</h3>
        <p>
          Setelah status pembayaran berubah, backend mengirim callback ke callback_url.
        </p>
      </div>
    </section>

    <section class="card endpoint">
      <h2>Auth</h2>

      <h3><span class="method">POST</span> /api/auth/register</h3>
      <pre>curl -X POST ${baseUrl}/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Andi Developer",
    "email": "andi@example.com",
    "password": "password123"
  }'</pre>

      <h3><span class="method">POST</span> /api/auth/login</h3>
      <pre>curl -X POST ${baseUrl}/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "andi@example.com",
    "password": "password123"
  }'</pre>

      <h3><span class="method">GET</span> /api/auth/me</h3>
      <pre>curl ${baseUrl}/api/auth/me \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"</pre>
    </section>

    <section class="card endpoint">
      <h2>API Key</h2>

      <h3><span class="method">GET</span> /api/keys</h3>
      <pre>curl ${baseUrl}/api/keys \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"</pre>

      <h3><span class="method">POST</span> /api/keys/generate</h3>
      <pre>curl -X POST ${baseUrl}/api/keys/generate \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"</pre>

      <h3><span class="method">POST</span> /api/keys/reset</h3>
      <pre>curl -X POST ${baseUrl}/api/keys/reset \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"</pre>
    </section>

    <section class="card endpoint">
      <h2>Transactions</h2>

      <h3><span class="method">POST</span> /api/v1/transactions</h3>
      <pre>curl -X POST ${baseUrl}/api/v1/transactions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_SECRET_API_KEY" \\
  -d '{
    "order_id": "ORDER-001",
    "amount": 50000,
    "customer_name": "Andi",
    "customer_email": "andi@example.com",
    "payment_method": "MOCK_EWALLET",
    "callback_url": "${baseUrl}/webhook-test/receive"
  }'</pre>

      <h3><span class="method">GET</span> /api/v1/transactions</h3>
      <pre>curl ${baseUrl}/api/v1/transactions \\
  -H "Authorization: Bearer YOUR_SECRET_API_KEY"</pre>

      <h3><span class="method">GET</span> /api/v1/transactions/:transactionId</h3>
      <pre>curl ${baseUrl}/api/v1/transactions/trx_xxxxx \\
  -H "Authorization: Bearer YOUR_SECRET_API_KEY"</pre>

      <h3><span class="method">POST</span> /api/v1/transactions/:transactionId/cancel</h3>
      <pre>curl -X POST ${baseUrl}/api/v1/transactions/trx_xxxxx/cancel \\
  -H "Authorization: Bearer YOUR_SECRET_API_KEY"</pre>
    </section>

    <section class="card endpoint">
      <h2>Payment Simulator</h2>

      <h3><span class="method">GET</span> /pay/:transactionId</h3>
      <pre>${baseUrl}/pay/trx_xxxxx</pre>

      <p>
        Buka payment URL dari response create transaction, lalu pilih status:
        success, failed, pending, atau expired.
      </p>
    </section>

    <section class="card endpoint">
      <h2>Webhook Logs</h2>

      <h3><span class="method">GET</span> /api/webhook-logs</h3>
      <pre>curl ${baseUrl}/api/webhook-logs \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"</pre>

      <h3><span class="method">POST</span> /api/webhook-logs/:id/retry</h3>
      <pre>curl -X POST ${baseUrl}/api/webhook-logs/WEBHOOK_LOG_ID/retry \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"</pre>
    </section>

    <section class="card endpoint">
      <h2>Webhook Payload Example</h2>

      <span class="success">payment.success</span>

      <pre>{
  "event": "payment.success",
  "transaction_id": "trx_xxxxx",
  "order_id": "ORDER-001",
  "amount": 50000,
  "payment_method": "MOCK_EWALLET",
  "status": "SUCCESS",
  "customer_name": "Andi",
  "customer_email": "andi@example.com",
  "paid_at": "2026-06-14T10:00:00.000Z",
  "expired_at": "2026-06-14T10:30:00.000Z",
  "created_at": "2026-06-14T09:59:00.000Z",
  "updated_at": "2026-06-14T10:00:00.000Z"
}</pre>
    </section>

    <section class="card">
      <h2>JavaScript Fetch Example</h2>

      <pre>const response = await fetch("${baseUrl}/api/v1/transactions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_SECRET_API_KEY"
  },
  body: JSON.stringify({
    order_id: "ORDER-001",
    amount: 50000,
    customer_name: "Andi",
    customer_email: "andi@example.com",
    payment_method: "MOCK_EWALLET",
    callback_url: "${baseUrl}/webhook-test/receive"
  })
});

const data = await response.json();
console.log(data);</pre>
    </section>
  </main>
</body>
</html>`);
});

module.exports = router;