const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SandboxPay API Tester</title>
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
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
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

    input {
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
      min-height: 180px;
      white-space: pre-wrap;
      color: #d1d5db;
    }

    .token-box {
      margin-top: 14px;
      background: #020617;
      border: 1px solid #334155;
      border-radius: 10px;
      padding: 10px;
      word-break: break-all;
      font-size: 13px;
      color: #93c5fd;
    }

    .note {
      margin-top: 12px;
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>SandboxPay API Tester</h1>
    <p>Halaman ini dipakai untuk test Register, Login, Profile, dan API Key langsung dari browser.</p>

    <div class="grid">
      <div class="card">
        <h2>1. Register</h2>

        <label>Nama</label>
        <input id="registerName" value="Shiroge Developer" />

        <label>Email</label>
        <input id="registerEmail" value="shiroge@example.com" />

        <label>Password</label>
        <input id="registerPassword" value="password123" type="password" />

        <button onclick="registerUser()">Register</button>
        <div class="note">Kalau email sudah pernah dipakai, gunakan tombol Login.</div>
      </div>

      <div class="card">
        <h2>2. Login</h2>

        <label>Email</label>
        <input id="loginEmail" value="shiroge@example.com" />

        <label>Password</label>
        <input id="loginPassword" value="password123" type="password" />

        <button onclick="loginUser()">Login</button>

        <div class="token-box" id="tokenBox">Token belum ada.</div>
      </div>

      <div class="card">
        <h2>3. Profile</h2>
        <button onclick="getProfile()">Cek Profile</button>
        <div class="note">Fitur ini butuh token dari Register/Login.</div>
      </div>

      <div class="card">
        <h2>4. API Key</h2>
        <button onclick="generateApiKey()">Generate API Key</button>
        <button class="secondary" onclick="listApiKeys()">List API Key</button>
        <button class="danger" onclick="resetApiKey()">Reset API Key</button>
        <div class="note">Secret key hanya muncul sekali saat generate/reset.</div>
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

    async function registerUser() {
      try {
        const body = {
          name: document.getElementById("registerName").value,
          email: document.getElementById("registerEmail").value,
          password: document.getElementById("registerPassword").value
        };

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });

        const data = await res.json();

        if (data.success && data.data && data.data.token) {
          token = data.data.token;
          localStorage.setItem("sandboxpay_token", token);
          updateTokenBox();
        }

        showOutput(data);
      } catch (error) {
        showError(error);
      }
    }

    async function loginUser() {
      try {
        const body = {
          email: document.getElementById("loginEmail").value,
          password: document.getElementById("loginPassword").value
        };

        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });

        const data = await res.json();

        if (data.success && data.data && data.data.token) {
          token = data.data.token;
          localStorage.setItem("sandboxpay_token", token);
          updateTokenBox();
        }

        showOutput(data);
      } catch (error) {
        showError(error);
      }
    }

    async function getProfile() {
      try {
        const res = await fetch("/api/auth/me", {
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

    async function generateApiKey() {
      try {
        const res = await fetch("/api/keys/generate", {
          method: "POST",
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

    async function listApiKeys() {
      try {
        const res = await fetch("/api/keys", {
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

    async function resetApiKey() {
      try {
        const res = await fetch("/api/keys/reset", {
          method: "POST",
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

    updateTokenBox();
  </script>
</body>
</html>
  `);
});

module.exports = router;