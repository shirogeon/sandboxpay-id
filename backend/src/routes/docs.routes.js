const express = require("express");

const router = express.Router();

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

router.get("/", (req, res) => {
  const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;
  const safeBaseUrl = escapeHtml(baseUrl);

  res.send(`<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>SandboxPay ID API Documentation</title>
  <meta
  name="description"
  content="Dokumentasi SandboxPay ID API untuk testing payment gateway, API key, transaction API, payment simulator, webhook callback, dan webhook logs."
  />

  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#7c3aed" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="SandboxPay ID API Documentation" />
  <meta
    property="og:description"
    content="Dokumentasi API untuk belajar integrasi mock payment gateway tanpa uang asli."
  />
  <meta property="og:image" content="https://sandboxpay-id.vercel.app/brand/sandboxpay-og.png" />

  <link rel="icon" type="image/png" href="https://sandboxpay-id.vercel.app/brand/sandboxpay-icon.png" />
  
  <style>
    * {
      box-sizing: border-box;
    }

    :root {
      --bg: #f7f3ea;
      --card: #ffffff;
      --muted-card: #fbf8f1;
      --text: #1f1f23;
      --muted: #706a64;
      --border: #e5ded2;
      --primary: #7c3aed;
      --primary-dark: #6d28d9;
      --primary-soft: #ede9fe;
      --dark: #251f2f;
      --code: #17121f;
      --accent: #f59e0b;
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
      background: rgba(255,255,255,.88);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      position: sticky;
      top: 0;
      z-index: 20;
      backdrop-filter: blur(16px);
    }

    .brand {
      font-size: 21px;
      font-weight: 900;
      letter-spacing: -0.04em;
      white-space: nowrap;
    }

    .navActions {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .navActions a {
      text-decoration: none;
      font-weight: 900;
      background: white;
      border: 1px solid var(--border);
      padding: 10px 14px;
      border-radius: 999px;
      white-space: nowrap;
    }

    .container {
      max-width: 1120px;
      margin: auto;
      padding: 54px 24px;
    }

    .hero {
      display: grid;
      grid-template-columns: 1.08fr 0.92fr;
      gap: 26px;
      align-items: center;
      margin-bottom: 24px;
    }

    .eyebrow {
      display: inline-flex;
      width: fit-content;
      background: var(--primary-soft);
      color: var(--primary-dark);
      border: 1px solid #ddd6fe;
      padding: 8px 12px;
      border-radius: 999px;
      font-weight: 900;
      font-size: 12px;
      letter-spacing: .08em;
      text-transform: uppercase;
    }

    h1 {
      font-size: clamp(40px, 6vw, 72px);
      line-height: .98;
      margin: 16px 0 18px;
      letter-spacing: -.07em;
    }

    h2 {
      font-size: clamp(28px, 4vw, 42px);
      line-height: 1.06;
      margin: 0 0 12px;
      letter-spacing: -.05em;
    }

    h3 {
      margin: 22px 0 10px;
      font-size: 22px;
      line-height: 1.2;
      letter-spacing: -.03em;
    }

    p {
      color: var(--muted);
      line-height: 1.75;
      margin: 0 0 14px;
    }

    .card {
      background: rgba(255,255,255,.9);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 24px;
      box-shadow: var(--shadow);
      margin-bottom: 16px;
      overflow: hidden;
    }

    .baseBox {
      background: #f5f0ff;
      border: 1px solid #ddd6fe;
      border-radius: 18px;
      padding: 16px;
      word-break: break-all;
      color: var(--primary-dark);
      font-weight: 900;
    }

    .notice {
      background: #fff7ed;
      border: 1px solid #fed7aa;
      color: #7c2d12;
      border-radius: 18px;
      padding: 16px;
      line-height: 1.7;
      margin-bottom: 16px;
    }

    .featureGrid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 16px;
    }

    .feature {
      background: rgba(255,255,255,.9);
      border: 1px solid var(--border);
      border-radius: 22px;
      padding: 20px;
      box-shadow: var(--shadow);
    }

    .feature strong {
      display: block;
      margin-bottom: 8px;
      font-size: 18px;
    }

    .feature span {
      color: var(--muted);
      line-height: 1.6;
      font-size: 14px;
    }

    .endpoint {
      border-left: 6px solid var(--primary);
    }

    .endpointTitle {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 24px;
      margin-bottom: 12px;
    }

    .endpointTitle h3 {
      margin: 0;
      min-width: 0;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .method {
      flex: 0 0 auto;
      display: inline-flex;
      background: var(--primary-soft);
      color: var(--primary-dark);
      padding: 7px 10px;
      border-radius: 999px;
      font-weight: 900;
      font-size: 12px;
    }

    .codeWrap {
      width: 100%;
      max-width: 100%;
      overflow-x: auto;
      border-radius: 18px;
      background: var(--code);
      -webkit-overflow-scrolling: touch;
    }

    pre {
      margin: 0;
      min-width: max-content;
      background: var(--code);
      color: #f7f3ea;
      padding: 18px;
      line-height: 1.65;
      font-size: 13px;
      font-family: Consolas, Monaco, monospace;
      white-space: pre;
    }

    code {
      font-family: Consolas, Monaco, monospace;
    }

    .payloadBadge {
      display: inline-flex;
      background: var(--success-soft);
      color: var(--success);
      padding: 7px 10px;
      border-radius: 999px;
      font-weight: 900;
      font-size: 12px;
      margin-bottom: 12px;
    }

    .footer {
      color: var(--muted);
      text-align: center;
      padding: 34px 20px 54px;
      line-height: 1.7;
    }

    @media (max-width: 860px) {
      .hero,
      .featureGrid {
        grid-template-columns: 1fr;
      }

      .container {
        padding: 34px 16px;
      }

      .nav {
        min-height: auto;
        padding: 14px 16px;
        align-items: flex-start;
        flex-direction: column;
      }

      .brand {
        font-size: 21px;
      }

      .navActions {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
      }

      .navActions a {
        text-align: center;
        padding: 10px 8px;
      }

      h1 {
        font-size: 38px;
        line-height: 1.02;
      }

      h2 {
        font-size: 30px;
      }

      h3 {
        font-size: 20px;
      }

      .card,
      .feature {
        padding: 18px;
        border-radius: 20px;
      }

      .endpoint {
        border-left-width: 4px;
      }

      .endpointTitle {
        gap: 8px;
      }

      .endpointTitle h3 {
        width: 100%;
        font-size: 19px;
      }

      pre {
        font-size: 12px;
        padding: 16px;
      }
    }

    @media (max-width: 430px) {
      .container {
        padding-left: 14px;
        padding-right: 14px;
      }

      .brand {
        font-size: 19px;
      }

      .navActions a {
        font-size: 13px;
      }

      h1 {
        font-size: 32px;
      }

      h2 {
        font-size: 26px;
      }

      .eyebrow {
        font-size: 10px;
      }

      pre {
        font-size: 11px;
      }
    }
  </style>
</head>

<body>
  <nav class="nav">
    <div class="brand">SandboxPay ID Docs</div>

    <div class="navActions">
      <a href="${safeBaseUrl}/api/health">Health Check</a>
      <a href="${safeBaseUrl}">API Root</a>
    </div>
  </nav>

  <main class="container">
    <section class="hero">
      <div>
        <span class="eyebrow">API Documentation</span>
        <h1>Dokumentasi API untuk testing payment gateway.</h1>
        <p>
          Gunakan SandboxPay ID untuk belajar membuat transaksi, API key,
          payment simulator, webhook callback, dan webhook logs.
        </p>
      </div>

      <div class="card">
        <h2>Base URL</h2>
        <div class="baseBox">${safeBaseUrl}</div>
        <p style="margin-top:14px">
          Semua endpoint production memakai base URL ini.
        </p>
      </div>
    </section>

    <div class="notice">
      SandboxPay ID hanya untuk edukasi dan testing. Tidak memproses uang asli,
      tidak terhubung ke bank, e-wallet, QRIS, atau payment gateway resmi.
    </div>

    <section class="featureGrid">
      <div class="feature">
        <strong>Auth</strong>
        <span>Register, login, dan profile developer dengan JWT.</span>
      </div>

      <div class="feature">
        <strong>API Key</strong>
        <span>Generate secret key untuk mengakses transaction API.</span>
      </div>

      <div class="feature">
        <strong>Transaction</strong>
        <span>Buat transaksi sandbox dan dapatkan payment URL.</span>
      </div>

      <div class="feature">
        <strong>Webhook</strong>
        <span>Terima callback dan pantau delivery logs.</span>
      </div>
    </section>

    <section class="card endpoint">
      <h2>Auth</h2>

      <div class="endpointTitle">
        <span class="method">POST</span>
        <h3>/api/auth/register</h3>
      </div>
      <div class="codeWrap"><pre>curl -X POST ${safeBaseUrl}/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Andi Developer",
    "email": "andi@example.com",
    "password": "password123"
  }'</pre></div>

      <div class="endpointTitle">
        <span class="method">POST</span>
        <h3>/api/auth/login</h3>
      </div>
      <div class="codeWrap"><pre>curl -X POST ${safeBaseUrl}/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "andi@example.com",
    "password": "password123"
  }'</pre></div>

      <div class="endpointTitle">
        <span class="method">GET</span>
        <h3>/api/auth/me</h3>
      </div>
      <div class="codeWrap"><pre>curl ${safeBaseUrl}/api/auth/me \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"</pre></div>
    </section>

    <section class="card endpoint">
      <h2>API Key</h2>

      <div class="endpointTitle">
        <span class="method">GET</span>
        <h3>/api/keys</h3>
      </div>
      <div class="codeWrap"><pre>curl ${safeBaseUrl}/api/keys \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"</pre></div>

      <div class="endpointTitle">
        <span class="method">POST</span>
        <h3>/api/keys/generate</h3>
      </div>
      <div class="codeWrap"><pre>curl -X POST ${safeBaseUrl}/api/keys/generate \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"</pre></div>

      <div class="endpointTitle">
        <span class="method">POST</span>
        <h3>/api/keys/reset</h3>
      </div>
      <div class="codeWrap"><pre>curl -X POST ${safeBaseUrl}/api/keys/reset \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"</pre></div>
    </section>

    <section class="card endpoint">
      <h2>Transactions</h2>

      <div class="endpointTitle">
        <span class="method">POST</span>
        <h3>/api/v1/transactions</h3>
      </div>
      <div class="codeWrap"><pre>curl -X POST ${safeBaseUrl}/api/v1/transactions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_SECRET_API_KEY" \\
  -d '{
    "order_id": "ORDER-001",
    "amount": 50000,
    "customer_name": "Andi",
    "customer_email": "andi@example.com",
    "payment_method": "MOCK_EWALLET",
    "callback_url": "${safeBaseUrl}/webhook-test/receive"
  }'</pre></div>

      <div class="endpointTitle">
        <span class="method">GET</span>
        <h3>/api/v1/transactions</h3>
      </div>
      <div class="codeWrap"><pre>curl ${safeBaseUrl}/api/v1/transactions \\
  -H "Authorization: Bearer YOUR_SECRET_API_KEY"</pre></div>

      <div class="endpointTitle">
        <span class="method">GET</span>
        <h3>/api/v1/transactions/:transactionId</h3>
      </div>
      <div class="codeWrap"><pre>curl ${safeBaseUrl}/api/v1/transactions/trx_xxxxx \\
  -H "Authorization: Bearer YOUR_SECRET_API_KEY"</pre></div>

      <div class="endpointTitle">
        <span class="method">POST</span>
        <h3>/api/v1/transactions/:transactionId/cancel</h3>
      </div>
      <div class="codeWrap"><pre>curl -X POST ${safeBaseUrl}/api/v1/transactions/trx_xxxxx/cancel \\
  -H "Authorization: Bearer YOUR_SECRET_API_KEY"</pre></div>
    </section>

    <section class="card endpoint">
      <h2>Payment Simulator</h2>

      <div class="endpointTitle">
        <span class="method">GET</span>
        <h3>/pay/:transactionId</h3>
      </div>
      <div class="codeWrap"><pre>${safeBaseUrl}/pay/trx_xxxxx</pre></div>

      <p style="margin-top:14px">
        Buka payment URL dari response create transaction, lalu pilih status
        pembayaran success, failed, pending, atau expired.
      </p>
    </section>

    <section class="card endpoint">
      <h2>Webhook Logs</h2>

      <div class="endpointTitle">
        <span class="method">GET</span>
        <h3>/api/webhook-logs</h3>
      </div>
      <div class="codeWrap"><pre>curl ${safeBaseUrl}/api/webhook-logs \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"</pre></div>

      <div class="endpointTitle">
        <span class="method">POST</span>
        <h3>/api/webhook-logs/:id/retry</h3>
      </div>
      <div class="codeWrap"><pre>curl -X POST ${safeBaseUrl}/api/webhook-logs/WEBHOOK_LOG_ID/retry \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"</pre></div>
    </section>

    <section class="card endpoint">
      <h2>Webhook Payload Example</h2>

      <span class="payloadBadge">payment.success</span>

      <div class="codeWrap"><pre>{
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
}</pre></div>
    </section>

    <section class="card endpoint">
      <h2>JavaScript Fetch Example</h2>

      <div class="codeWrap"><pre>const response = await fetch("${safeBaseUrl}/api/v1/transactions", {
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
    callback_url: "${safeBaseUrl}/webhook-test/receive"
  })
});

const data = await response.json();
console.log(data);</pre></div>
    </section>
  </main>

  <footer class="footer">
    SandboxPay ID dibuat untuk edukasi, latihan integrasi API, dan portfolio developer.
  </footer>
</body>
</html>`);
});

module.exports = router;