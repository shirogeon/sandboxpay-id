const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SandboxPay ID API Documentation</title>
  <style>
    * {
      box-sizing: border-box;
      scroll-behavior: smooth;
      font-family: Arial, sans-serif;
    }

    body {
      margin: 0;
      background: #0f172a;
      color: #e5e7eb;
    }

    .layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      min-height: 100vh;
    }

    aside {
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
      background: #020617;
      border-right: 1px solid #1f2937;
      padding: 24px;
    }

    main {
      padding: 32px;
      max-width: 1050px;
    }

    .brand {
      margin-bottom: 28px;
    }

    .brand h2 {
      margin: 0;
      font-size: 22px;
    }

    .brand p {
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.5;
    }

    nav a {
      display: block;
      color: #cbd5e1;
      text-decoration: none;
      padding: 10px 0;
      border-bottom: 1px solid #111827;
      font-size: 14px;
    }

    nav a:hover {
      color: #93c5fd;
    }

    section {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 22px;
    }

    h1 {
      margin-top: 0;
      font-size: 34px;
    }

    h2 {
      margin-top: 0;
      font-size: 24px;
    }

    h3 {
      margin-top: 24px;
      font-size: 18px;
    }

    p, li {
      color: #cbd5e1;
      line-height: 1.7;
    }

    .muted {
      color: #94a3b8;
    }

    .warning {
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.35);
      color: #fde68a;
      padding: 14px;
      border-radius: 12px;
      line-height: 1.6;
      margin-top: 16px;
    }

    .success {
      background: rgba(22, 163, 74, 0.12);
      border: 1px solid rgba(22, 163, 74, 0.35);
      color: #bbf7d0;
      padding: 14px;
      border-radius: 12px;
      line-height: 1.6;
      margin-top: 16px;
    }

    .method {
      display: inline-block;
      padding: 4px 9px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: bold;
      margin-right: 8px;
    }

    .GET {
      background: rgba(59, 130, 246, 0.18);
      color: #93c5fd;
    }

    .POST {
      background: rgba(22, 163, 74, 0.18);
      color: #86efac;
    }

    .endpoint {
      font-family: Consolas, monospace;
      background: #020617;
      border: 1px solid #1f2937;
      padding: 10px 12px;
      border-radius: 10px;
      display: inline-block;
      color: #e5e7eb;
      margin: 8px 0;
      word-break: break-all;
    }

    pre {
      background: #020617;
      border: 1px solid #1f2937;
      padding: 16px;
      border-radius: 12px;
      overflow-x: auto;
      color: #d1d5db;
      line-height: 1.5;
      font-size: 14px;
    }

    code {
      font-family: Consolas, monospace;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 14px;
      overflow: hidden;
      border-radius: 12px;
    }

    th, td {
      border-bottom: 1px solid #1f2937;
      padding: 12px;
      text-align: left;
      vertical-align: top;
      color: #cbd5e1;
      font-size: 14px;
    }

    th {
      color: #e5e7eb;
      background: #020617;
    }

    .quick-links {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 18px;
    }

    .quick-links a {
      color: white;
      text-decoration: none;
      background: #2563eb;
      padding: 10px 14px;
      border-radius: 10px;
      font-weight: bold;
      font-size: 14px;
    }

    .quick-links a:hover {
      background: #1d4ed8;
    }

    @media (max-width: 900px) {
      .layout {
        grid-template-columns: 1fr;
      }

      aside {
        position: static;
        height: auto;
      }

      main {
        padding: 18px;
      }
    }
  </style>
</head>
<body>
  <div class="layout">
    <aside>
      <div class="brand">
        <h2>SandboxPay ID</h2>
        <p>Mock payment API untuk belajar integrasi payment gateway tanpa uang asli.</p>
      </div>

      <nav>
        <a href="#introduction">Introduction</a>
        <a href="#base-url">Base URL</a>
        <a href="#authentication">Authentication</a>
        <a href="#auth-endpoints">Developer Auth</a>
        <a href="#api-key">API Key</a>
        <a href="#transactions">Transactions</a>
        <a href="#payment-simulator">Payment Simulator</a>
        <a href="#webhook">Webhook</a>
        <a href="#webhook-logs">Webhook Logs</a>
        <a href="#status">Status</a>
        <a href="#error-codes">Error Codes</a>
        <a href="#testing-tools">Testing Tools</a>
      </nav>
    </aside>

    <main>
      <section id="introduction">
        <h1>SandboxPay ID API Documentation</h1>
        <p>
          SandboxPay ID adalah mock payment gateway API untuk developer yang ingin belajar integrasi pembayaran,
          transaction status, payment URL, API key authentication, dan webhook callback.
        </p>

        <div class="warning">
          Platform ini hanya untuk edukasi dan testing. SandboxPay ID tidak memproses uang asli,
          tidak terhubung dengan e-wallet resmi, dan tidak boleh dipakai sebagai payment gateway production.
        </div>

        <div class="quick-links">
          <a href="/tester">API Tester</a>
          <a href="/transaction-tester">Transaction Tester</a>
          <a href="/webhook-log-tester">Webhook Log Tester</a>
          <a href="/webhook-test/logs">Dummy Webhook Logs</a>
        </div>
      </section>

      <section id="base-url">
        <h2>Base URL</h2>
        <p>Untuk local development:</p>
        <pre><code>http://localhost:5000</code></pre>

        <p>Untuk production nanti, base URL akan mengikuti URL backend hasil deploy.</p>
        <pre><code>https://sandboxpay-api.onrender.com</code></pre>
      </section>

      <section id="authentication">
        <h2>Authentication</h2>
        <p>
          Ada dua jenis authentication di SandboxPay ID:
        </p>

        <table>
          <thead>
            <tr>
              <th>Jenis</th>
              <th>Dipakai Untuk</th>
              <th>Header</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>JWT Token</td>
              <td>Dashboard developer, API key management, webhook logs</td>
              <td><code>Authorization: Bearer jwt_token</code></td>
            </tr>
            <tr>
              <td>Secret API Key</td>
              <td>Create transaction, list transaction, check transaction, cancel transaction</td>
              <td><code>Authorization: Bearer sk_test_xxxxx</code></td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="auth-endpoints">
        <h2>Developer Auth</h2>

        <h3><span class="method POST">POST</span> Register Developer</h3>
        <div class="endpoint">/api/auth/register</div>

        <p>Request body:</p>
        <pre><code>{
  "name": "Shiroge Developer",
  "email": "shiroge@example.com",
  "password": "password123"
}</code></pre>

        <p>Success response:</p>
        <pre><code>{
  "success": true,
  "message": "Register berhasil",
  "data": {
    "user": {
      "id": "user_id",
      "name": "Shiroge Developer",
      "email": "shiroge@example.com",
      "role": "DEVELOPER"
    },
    "token": "jwt_token"
  }
}</code></pre>

        <h3><span class="method POST">POST</span> Login Developer</h3>
        <div class="endpoint">/api/auth/login</div>

        <p>Request body:</p>
        <pre><code>{
  "email": "shiroge@example.com",
  "password": "password123"
}</code></pre>

        <h3><span class="method GET">GET</span> Get Profile</h3>
        <div class="endpoint">/api/auth/me</div>

        <p>Header:</p>
        <pre><code>Authorization: Bearer jwt_token</code></pre>
      </section>

      <section id="api-key">
        <h2>API Key</h2>

        <h3><span class="method GET">GET</span> List API Keys</h3>
        <div class="endpoint">/api/keys</div>

        <p>Header:</p>
        <pre><code>Authorization: Bearer jwt_token</code></pre>

        <h3><span class="method POST">POST</span> Generate API Key</h3>
        <div class="endpoint">/api/keys/generate</div>

        <p>Secret key hanya ditampilkan sekali saat dibuat.</p>

        <pre><code>{
  "success": true,
  "message": "API key berhasil dibuat. Simpan API key ini karena hanya ditampilkan sekali.",
  "data": {
    "apiKey": {
      "id": "api_key_id",
      "keyPrefix": "sk_test_xxxxx",
      "isActive": true
    },
    "secretKey": "sk_test_xxxxxxxxxxxxxxxxx"
  }
}</code></pre>

        <h3><span class="method POST">POST</span> Reset API Key</h3>
        <div class="endpoint">/api/keys/reset</div>

        <p>API key lama akan dinonaktifkan dan sistem membuat API key baru.</p>
      </section>

      <section id="transactions">
        <h2>Transactions</h2>

        <h3><span class="method POST">POST</span> Create Transaction</h3>
        <div class="endpoint">/api/v1/transactions</div>

        <p>Header:</p>
        <pre><code>Authorization: Bearer sk_test_xxxxxxxxx
Content-Type: application/json</code></pre>

        <p>Request body:</p>
        <pre><code>{
  "order_id": "ORDER-001",
  "amount": 50000,
  "customer_name": "Bayhaqi",
  "customer_email": "bayhaqi@example.com",
  "payment_method": "MOCK_EWALLET",
  "callback_url": "http://localhost:5000/webhook-test/receive",
  "redirect_url": "https://example.com/payment-finish"
}</code></pre>

        <p>Success response:</p>
        <pre><code>{
  "success": true,
  "message": "Transaction berhasil dibuat",
  "data": {
    "transaction": {
      "transactionId": "trx_xxxxx",
      "orderId": "ORDER-001",
      "amount": 50000,
      "paymentMethod": "MOCK_EWALLET",
      "status": "PENDING",
      "paymentUrl": "http://localhost:5000/pay/trx_xxxxx",
      "callbackUrl": "http://localhost:5000/webhook-test/receive",
      "expiredAt": "2026-06-14T10:00:00.000Z"
    }
  }
}</code></pre>

        <h3><span class="method GET">GET</span> List Transactions</h3>
        <div class="endpoint">/api/v1/transactions</div>

        <h3><span class="method GET">GET</span> Get Transaction Detail</h3>
        <div class="endpoint">/api/v1/transactions/:transactionId</div>

        <h3><span class="method POST">POST</span> Cancel Transaction</h3>
        <div class="endpoint">/api/v1/transactions/:transactionId/cancel</div>
      </section>

      <section id="payment-simulator">
        <h2>Payment Simulator</h2>
        <p>
          Payment simulator adalah halaman tiruan pembayaran. Halaman ini muncul dari field
          <code>paymentUrl</code> setelah transaksi dibuat.
        </p>

        <h3><span class="method GET">GET</span> Open Payment Page</h3>
        <div class="endpoint">/pay/:transactionId</div>

        <h3><span class="method POST">POST</span> Simulate Payment Status</h3>
        <div class="endpoint">/pay/:transactionId/simulate</div>

        <p>Request body:</p>
        <pre><code>{
  "status": "SUCCESS"
}</code></pre>

        <p>Status yang bisa disimulasikan:</p>
        <pre><code>SUCCESS
FAILED
PENDING
EXPIRED</code></pre>
      </section>

      <section id="webhook">
        <h2>Webhook</h2>
        <p>
          Webhook akan dikirim ke <code>callback_url</code> saat status transaksi berubah
          menjadi SUCCESS, FAILED, EXPIRED, atau CANCELLED.
        </p>

        <p>Headers yang dikirim:</p>
        <pre><code>Content-Type: application/json
X-Sandboxpay-Event: payment.success
X-Sandboxpay-Signature: hmac_sha256_signature</code></pre>

        <p>Payload webhook:</p>
        <pre><code>{
  "event": "payment.success",
  "transaction_id": "trx_xxxxx",
  "order_id": "ORDER-001",
  "amount": 50000,
  "payment_method": "MOCK_EWALLET",
  "status": "SUCCESS",
  "customer_name": "Bayhaqi",
  "customer_email": "bayhaqi@example.com",
  "paid_at": "2026-06-14T10:00:00.000Z",
  "expired_at": "2026-06-14T10:30:00.000Z",
  "created_at": "2026-06-14T09:59:00.000Z",
  "updated_at": "2026-06-14T10:00:00.000Z"
}</code></pre>

        <div class="success">
          Untuk testing lokal, gunakan callback URL:
          <br />
          <code>http://localhost:5000/webhook-test/receive</code>
        </div>
      </section>

      <section id="webhook-logs">
        <h2>Webhook Logs</h2>

        <h3><span class="method GET">GET</span> List Webhook Logs</h3>
        <div class="endpoint">/api/webhook-logs</div>

        <p>Header:</p>
        <pre><code>Authorization: Bearer jwt_token</code></pre>

        <h3><span class="method GET">GET</span> Webhook Log Detail</h3>
        <div class="endpoint">/api/webhook-logs/:id</div>

        <h3><span class="method POST">POST</span> Retry Webhook</h3>
        <div class="endpoint">/api/webhook-logs/:id/retry</div>
      </section>

      <section id="status">
        <h2>Transaction Status</h2>

        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Arti</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>PENDING</code></td>
              <td>Transaksi dibuat dan masih menunggu pembayaran.</td>
            </tr>
            <tr>
              <td><code>SUCCESS</code></td>
              <td>Pembayaran disimulasikan berhasil.</td>
            </tr>
            <tr>
              <td><code>FAILED</code></td>
              <td>Pembayaran disimulasikan gagal.</td>
            </tr>
            <tr>
              <td><code>EXPIRED</code></td>
              <td>Transaksi sudah melewati waktu expired atau disimulasikan expired.</td>
            </tr>
            <tr>
              <td><code>CANCELLED</code></td>
              <td>Transaksi dibatalkan oleh developer.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="error-codes">
        <h2>Error Codes</h2>

        <table>
          <thead>
            <tr>
              <th>Error Code</th>
              <th>Arti</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>ROUTE_NOT_FOUND</code></td>
              <td>Route tidak ditemukan atau method HTTP salah.</td>
            </tr>
            <tr>
              <td><code>TOKEN_REQUIRED</code></td>
              <td>JWT token belum dikirim.</td>
            </tr>
            <tr>
              <td><code>INVALID_TOKEN</code></td>
              <td>JWT token salah atau expired.</td>
            </tr>
            <tr>
              <td><code>API_KEY_REQUIRED</code></td>
              <td>Secret API key belum dikirim.</td>
            </tr>
            <tr>
              <td><code>INVALID_API_KEY</code></td>
              <td>Secret API key salah atau sudah tidak aktif.</td>
            </tr>
            <tr>
              <td><code>ORDER_ID_ALREADY_EXISTS</code></td>
              <td>Order ID sudah pernah dipakai oleh developer yang sama.</td>
            </tr>
            <tr>
              <td><code>TRANSACTION_NOT_FOUND</code></td>
              <td>Transaction ID tidak ditemukan.</td>
            </tr>
            <tr>
              <td><code>TRANSACTION_ALREADY_FINAL</code></td>
              <td>Status transaksi sudah final dan tidak bisa diubah lagi.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="testing-tools">
        <h2>Testing Tools</h2>

        <table>
          <thead>
            <tr>
              <th>Tool</th>
              <th>URL</th>
              <th>Fungsi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>API Tester</td>
              <td><a href="/tester">/tester</a></td>
              <td>Register, login, profile, generate API key.</td>
            </tr>
            <tr>
              <td>Transaction Tester</td>
              <td><a href="/transaction-tester">/transaction-tester</a></td>
              <td>Create transaction, list transaction, detail, cancel.</td>
            </tr>
            <tr>
              <td>Payment Simulator</td>
              <td><code>/pay/:transactionId</code></td>
              <td>Simulasi pembayaran sukses, gagal, pending, expired.</td>
            </tr>
            <tr>
              <td>Webhook Log Tester</td>
              <td><a href="/webhook-log-tester">/webhook-log-tester</a></td>
              <td>Melihat webhook log dari database dan retry webhook.</td>
            </tr>
            <tr>
              <td>Dummy Webhook Receiver</td>
              <td><a href="/webhook-test/logs">/webhook-test/logs</a></td>
              <td>Melihat webhook yang diterima oleh dummy receiver.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</body>
</html>
  `);
});

module.exports = router;