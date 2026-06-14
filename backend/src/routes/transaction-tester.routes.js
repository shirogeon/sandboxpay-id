const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SandboxPay Transaction Tester</title>
  <style>
    * {
      box-sizing: border-box;
      font-family: Arial, sans-serif;
    }

    body {
      margin: 0;
      background: #0f172a;
      color: #e5e7eb;
      padding: 24px;
    }

    .container {
      max-width: 1000px;
      margin: auto;
    }

    h1 {
      margin-bottom: 8px;
    }

    p {
      color: #94a3b8;
      line-height: 1.6;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      margin-top: 24px;
    }

    .card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 14px;
      padding: 18px;
    }

    label {
      display: block;
      margin-top: 12px;
      margin-bottom: 6px;
      color: #cbd5e1;
      font-size: 14px;
    }

    input, select {
      width: 100%;
      padding: 11px;
      border-radius: 10px;
      border: 1px solid #334155;
      background: #020617;
      color: #e5e7eb;
      outline: none;
    }

    button {
      margin-top: 14px;
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 10px;
      background: #2563eb;
      color: white;
      font-weight: bold;
      cursor: pointer;
    }

    button:hover {
      background: #1d4ed8;
    }

    .secondary {
      background: #334155;
    }

    .secondary:hover {
      background: #475569;
    }

    .danger {
      background: #dc2626;
    }

    .danger:hover {
      background: #b91c1c;
    }

    pre {
      margin-top: 24px;
      background: #020617;
      border: 1px solid #1f2937;
      padding: 18px;
      border-radius: 14px;
      overflow: auto;
      min-height: 220px;
      white-space: pre-wrap;
      color: #d1d5db;
    }

    .note {
      margin-top: 12px;
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.5;
    }

    a {
      color: #93c5fd;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>SandboxPay Transaction Tester</h1>
    <p>
      Masukkan secret API key dari halaman <a href="/tester">API Tester</a>,
      lalu buat transaksi sandbox.
    </p>

    <div class="grid">
      <div class="card">
        <h2>API Key</h2>

        <label>Secret API Key</label>
        <input id="apiKey" placeholder="sk_test_xxxxxxxxx" />

        <button onclick="saveApiKey()">Simpan API Key</button>
        <div class="note">API key akan disimpan di browser lokal kamu.</div>
      </div>

      <div class="card">
        <h2>Create Transaction</h2>

        <label>Order ID</label>
        <input id="orderId" />

        <label>Amount</label>
        <input id="amount" type="number" value="50000" />

        <label>Customer Name</label>
        <input id="customerName" value="Bayhaqi" />

        <label>Customer Email</label>
        <input id="customerEmail" value="bayhaqi@example.com" />

        <label>Callback URL</label>
        <input id="callbackUrl" value="http://localhost:5000/webhook-test/receive" />

        <label>Payment Method</label>
        <select id="paymentMethod">
          <option value="MOCK_EWALLET">Mock E-Wallet</option>
          <option value="MOCK_QR">Mock QR Payment</option>
          <option value="MOCK_VA">Mock Virtual Account</option>
          <option value="MOCK_RETAIL">Mock Retail Payment</option>
        </select>

        <button onclick="createTransaction()">Create Transaction</button>
      </div>

      <div class="card">
        <h2>Manage Transaction</h2>

        <label>Transaction ID</label>
        <input id="transactionId" placeholder="trx_xxxxx" />

        <button onclick="getTransactionDetail()">Get Detail</button>
        <button class="danger" onclick="cancelTransaction()">Cancel Transaction</button>
        <button class="secondary" onclick="listTransactions()">List Transactions</button>

        <div class="note">Transaction ID otomatis terisi setelah create transaction berhasil.</div>
      </div>
    </div>

    <pre id="output">Output response akan muncul di sini.</pre>
  </div>

  <script>
    const savedKey = localStorage.getItem("sandboxpay_secret_api_key") || "";
    document.getElementById("apiKey").value = savedKey;

    document.getElementById("orderId").value = "ORDER-" + Date.now();

    function getApiKey() {
      return document.getElementById("apiKey").value.trim();
    }

    function saveApiKey() {
      const apiKey = getApiKey();
      localStorage.setItem("sandboxpay_secret_api_key", apiKey);

      showOutput({
        success: true,
        message: "API key berhasil disimpan di browser",
        apiKeyPrefix: apiKey.slice(0, 16)
      });
    }

    function showOutput(data) {
      document.getElementById("output").textContent = JSON.stringify(data, null, 2);
    }

    function showError(error) {
      document.getElementById("output").textContent = error.message || String(error);
    }

    async function createTransaction() {
      try {
        const body = {
            order_id: document.getElementById("orderId").value,
            amount: Number(document.getElementById("amount").value),
            customer_name: document.getElementById("customerName").value,
            customer_email: document.getElementById("customerEmail").value,
            payment_method: document.getElementById("paymentMethod").value,
            callback_url: document.getElementById("callbackUrl").value
            };

        const res = await fetch("/api/v1/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getApiKey()
          },
          body: JSON.stringify(body)
        });

        const data = await res.json();

        if (
          data.success &&
          data.data &&
          data.data.transaction &&
          data.data.transaction.transactionId
        ) {
          document.getElementById("transactionId").value =
            data.data.transaction.transactionId;
        }

        showOutput(data);
      } catch (error) {
        showError(error);
      }
    }

    async function listTransactions() {
      try {
        const res = await fetch("/api/v1/transactions", {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + getApiKey()
          }
        });

        const data = await res.json();
        showOutput(data);
      } catch (error) {
        showError(error);
      }
    }

    async function getTransactionDetail() {
      try {
        const transactionId = document.getElementById("transactionId").value;

        const res = await fetch("/api/v1/transactions/" + transactionId, {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + getApiKey()
          }
        });

        const data = await res.json();
        showOutput(data);
      } catch (error) {
        showError(error);
      }
    }

    async function cancelTransaction() {
      try {
        const transactionId = document.getElementById("transactionId").value;

        const res = await fetch("/api/v1/transactions/" + transactionId + "/cancel", {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + getApiKey()
          }
        });

        const data = await res.json();
        showOutput(data);
      } catch (error) {
        showError(error);
      }
    }
  </script>
</body>
</html>
  `);
});

module.exports = router;