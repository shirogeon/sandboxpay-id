const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SandboxPay Webhook Logs</title>
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
      max-width: 1100px;
      margin: auto;
    }

    h1 {
      margin-bottom: 8px;
    }

    p {
      color: #94a3b8;
      line-height: 1.6;
    }

    .card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 14px;
      padding: 18px;
      margin-top: 16px;
    }

    .actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 16px;
    }

    button {
      border: none;
      padding: 11px 16px;
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

    input {
      width: 100%;
      padding: 11px;
      border-radius: 10px;
      border: 1px solid #334155;
      background: #020617;
      color: #e5e7eb;
      outline: none;
      margin-top: 8px;
    }

    .token-box {
      background: #020617;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 10px;
      word-break: break-all;
      color: #93c5fd;
      font-size: 13px;
      margin-top: 10px;
    }

    .table-wrapper {
      overflow-x: auto;
      margin-top: 16px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 900px;
    }

    th, td {
      border-bottom: 1px solid #1f2937;
      padding: 12px;
      text-align: left;
      font-size: 14px;
      vertical-align: top;
    }

    th {
      color: #cbd5e1;
      background: #020617;
    }

    td {
      color: #e5e7eb;
    }

    .badge {
      display: inline-block;
      padding: 5px 9px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: bold;
    }

    .SUCCESS {
      background: rgba(22, 163, 74, 0.18);
      color: #86efac;
    }

    .FAILED {
      background: rgba(220, 38, 38, 0.18);
      color: #fca5a5;
    }

    .PENDING {
      background: rgba(234, 179, 8, 0.18);
      color: #fde68a;
    }

    pre {
      margin-top: 18px;
      background: #020617;
      border: 1px solid #1f2937;
      padding: 18px;
      border-radius: 14px;
      overflow: auto;
      min-height: 220px;
      white-space: pre-wrap;
      color: #d1d5db;
    }

    a {
      color: #93c5fd;
    }

    .note {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.5;
      margin-top: 8px;
    }

    @media (max-width: 700px) {
      body {
        padding: 16px;
      }

      .actions {
        flex-direction: column;
      }

      button {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>SandboxPay Webhook Logs</h1>
    <p>
      Halaman ini menampilkan webhook log dari database. Pastikan kamu sudah login lewat
      <a href="/tester">API Tester</a>, karena halaman ini memakai token login dari browser.
    </p>

    <div class="card">
      <h2>Token Login</h2>
      <div id="tokenBox" class="token-box">Token belum ada.</div>
      <div class="note">
        Kalau token kosong, buka <a href="/tester">/tester</a>, lalu klik Login.
      </div>

      <div class="actions">
        <button onclick="loadLogs()">Load Webhook Logs</button>
        <button class="secondary" onclick="openDummyLogs()">Buka Dummy Receiver Logs</button>
      </div>
    </div>

    <div class="card">
      <h2>Webhook Log Detail / Retry</h2>

      <label>Webhook Log ID</label>
      <input id="logId" placeholder="Masukkan ID webhook log" />

      <div class="actions">
        <button onclick="getLogDetail()">Get Detail</button>
        <button class="danger" onclick="retryWebhook()">Retry Webhook</button>
      </div>

      <div class="note">
        Klik salah satu log dari tabel untuk mengisi Webhook Log ID otomatis.
      </div>
    </div>

    <div class="card">
      <h2>Logs</h2>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Event</th>
              <th>Transaction ID</th>
              <th>Response</th>
              <th>Attempt</th>
              <th>Callback URL</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody id="logsTable">
            <tr>
              <td colspan="7">Belum ada data. Klik Load Webhook Logs.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <pre id="output">Output response akan muncul di sini.</pre>
  </div>

  <script>
    let token = localStorage.getItem("sandboxpay_token") || "";

    function updateTokenBox() {
      const tokenBox = document.getElementById("tokenBox");
      tokenBox.textContent = token ? token : "Token belum ada.";
    }

    function showOutput(data) {
      document.getElementById("output").textContent = JSON.stringify(data, null, 2);
    }

    function showError(error) {
      document.getElementById("output").textContent = error.message || String(error);
    }

    function setLogId(id) {
      document.getElementById("logId").value = id;
    }

    function formatDate(dateString) {
      if (!dateString) return "-";
      return new Date(dateString).toLocaleString("id-ID");
    }

    function renderLogs(logs) {
      const tbody = document.getElementById("logsTable");

      if (!logs || logs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">Webhook log masih kosong.</td></tr>';
        return;
      }

      tbody.innerHTML = logs.map((log) => {
        const response = log.responseStatus ? log.responseStatus : "-";
        const status = log.status || "PENDING";

        return \`
          <tr onclick="setLogId('\${log.id}')" style="cursor:pointer;">
            <td><span class="badge \${status}">\${status}</span></td>
            <td>\${log.eventName || "-"}</td>
            <td>\${log.transactionId || "-"}</td>
            <td>\${response}</td>
            <td>\${log.attempt}</td>
            <td>\${log.callbackUrl || "-"}</td>
            <td>\${formatDate(log.createdAt)}</td>
          </tr>
        \`;
      }).join("");
    }

    async function loadLogs() {
      try {
        token = localStorage.getItem("sandboxpay_token") || "";
        updateTokenBox();

        const res = await fetch("/api/webhook-logs", {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token
          }
        });

        const data = await res.json();

        if (data.success && data.data && data.data.logs) {
          renderLogs(data.data.logs);
        }

        showOutput(data);
      } catch (error) {
        showError(error);
      }
    }

    async function getLogDetail() {
      try {
        const logId = document.getElementById("logId").value.trim();

        if (!logId) {
          showOutput({
            success: false,
            message: "Webhook Log ID wajib diisi"
          });
          return;
        }

        const res = await fetch("/api/webhook-logs/" + logId, {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token
          }
        });

        const data = await res.json();
        showOutput(data);
      } catch (error) {
        showError(error);
      }
    }

    async function retryWebhook() {
      try {
        const logId = document.getElementById("logId").value.trim();

        if (!logId) {
          showOutput({
            success: false,
            message: "Webhook Log ID wajib diisi"
          });
          return;
        }

        const res = await fetch("/api/webhook-logs/" + logId + "/retry", {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + token
          }
        });

        const data = await res.json();
        showOutput(data);

        if (data.success) {
          setTimeout(loadLogs, 700);
        }
      } catch (error) {
        showError(error);
      }
    }

    function openDummyLogs() {
      window.open("/webhook-test/logs", "_blank");
    }

    updateTokenBox();
  </script>
</body>
</html>
  `);
});

module.exports = router;