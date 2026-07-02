import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import {
  API_BASE_URL,
  apiRequest,
  getSecretApiKey,
  getToken,
  removeToken,
  setSecretApiKey,
  setToken,
} from "./services/api";

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID");
}

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function copyText(value, callback) {
  if (!value) return;
  navigator.clipboard.writeText(value);
  callback?.();
}

function StatusBadge({ status }) {
  const cleanStatus = String(status || "-").toLowerCase();
  return <span className={`badge ${cleanStatus}`}>{status || "-"}</span>;
}

function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout() {
    closeMenu();
    onLogout();
  }

  return (
    <nav className="navbar">
      <div className="navInner">
        <Link to="/" className="brand" onClick={closeMenu}>
          <img
            src="/brand/sandboxpay-icon.png"
            alt="SandboxPay ID icon"
            className="brandLogo"
          />
          <span>SandboxPay ID</span>
        </Link>

        <button
          type="button"
          className={`hamburger ${menuOpen ? "isOpen" : ""}`}
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navLinks ${menuOpen ? "showMenu" : ""}`}>
          <a
            href={`${API_BASE_URL}/docs`}
            target="_blank"
            rel="noreferrer"
            onClick={closeMenu}
          >
            Docs
          </a>

          {user ? (
            <>
              <Link to="/dashboard" onClick={closeMenu}>
                Dashboard
              </Link>

              <Link to="/transactions" onClick={closeMenu}>
                Transactions
              </Link>

              <Link to="/webhooks" onClick={closeMenu}>
                Webhook Logs
              </Link>

              <button onClick={handleLogout} className="navButton">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>
                Login
              </Link>

              <Link to="/register" className="navPrimary" onClick={closeMenu}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function FAQ() {
  const faqs = [
    {
      question: "Apakah ini memproses uang asli?",
      answer:
        "Tidak. SandboxPay ID hanya dipakai untuk simulasi transaksi, payment URL, dan webhook. Tidak ada saldo, QR, virtual account, atau uang asli yang diproses.",
    },
    {
      question: "Apakah perlu KYC atau verifikasi bisnis?",
      answer:
        "Tidak perlu. Developer bisa langsung membuat akun, generate API key, lalu mencoba flow transaksi sandbox.",
    },
    {
      question: "Bisa dipakai untuk bot Discord atau e-commerce?",
      answer:
        "Bisa. Flow-nya cocok untuk auto order Discord bot, checkout e-commerce, dashboard toko digital, dan testing webhook payment.",
    },
    {
      question: "Callback URL harus pakai apa?",
      answer:
        "Gunakan URL publik dari backend kamu, misalnya Vercel, Railway, Render, VPS, atau ngrok. Jangan pakai localhost kalau aplikasi sudah online.",
    },
    {
      question: "Bisa dipakai untuk pembayaran asli?",
      answer:
        "Tidak. Untuk pembayaran asli tetap pakai payment gateway resmi. SandboxPay ID hanya untuk development, testing, dan belajar integrasi.",
    },
  ];

  return (
    <section className="faqBlock">
      <div className="sectionHead">
        <span>FAQ</span>
        <h2>Hal yang sering ditanya.</h2>
        <p>
          Ringkas aja. Ini sandbox untuk testing flow, bukan payment gateway
          live.
        </p>
      </div>

      <div className="faqList">
        {faqs.map((item) => (
          <details className="faqItem" key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="siteFooter">
      <div className="footerMain">
        <div>
          <div className="footerBrand">
            <img src="/brand/sandboxpay-icon.png" alt="SandboxPay ID icon" />
            <strong>SandboxPay ID</strong>
          </div>
          <p>
            Mock payment gateway API untuk testing transaksi, payment simulator,
            API key, dan webhook callback.
          </p>
        </div>

        <div className="footerLinks">
          <a href={`${API_BASE_URL}/docs`} target="_blank" rel="noreferrer">
            Docs
          </a>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/transactions">Transactions</Link>
          <Link to="/webhooks">Webhook Logs</Link>
        </div>
      </div>

      <div className="footerBottom">
        <span>© {year} SandboxPay ID. All rights reserved.</span>
        <span>Development and testing only.</span>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <main className="marketingPage">
      <section className="heroSection">
        <div className="heroCopy">
          <div className="heroLabel">
            <img src="/brand/sandboxpay-icon.png" alt="SandboxPay ID icon" />
            <span>Mock Payment Gateway API</span>
          </div>

          <h1>Test payment flow tanpa uang asli.</h1>

          <p>
            Buat transaksi sandbox, buka payment simulator, lalu cek webhook
            callback dari satu tempat. Cocok untuk bot Discord, e-commerce, dan
            latihan backend.
          </p>

          <div className="heroButtons">
            <Link to="/register" className="button primary">
              Mulai Testing
            </Link>

            <a
              href={`${API_BASE_URL}/docs`}
              target="_blank"
              rel="noreferrer"
              className="button ghost"
            >
              Buka Docs
            </a>
          </div>

          <div className="heroNotes">
            <span>No KYC</span>
            <span>No real money</span>
            <span>Webhook ready</span>
          </div>
        </div>

        <div className="heroConsole">
          <div className="consoleTop">
            <span>POST</span>
            <code>/api/v1/transactions</code>
          </div>

          <pre>{`{
  "order_id": "ORDER-001",
  "amount": 50000,
  "payment_method": "MOCK_EWALLET",
  "callback_url": "${API_BASE_URL}/webhook-test/receive"
}`}</pre>

          <div className="consoleStatus">
            <span></span>
            Payment URL generated
          </div>
        </div>
      </section>

      <section className="featureSection">
        <div className="sectionHead">
          <span>Core flow</span>
          <h2>Yang bisa dites.</h2>
          <p>
            Fitur dibuat secukupnya untuk ngetes flow payment dari aplikasi
            sendiri.
          </p>
        </div>

        <div className="featureRows">
          <div>
            <strong>API Key</strong>
            <p>Generate secret key untuk request dari backend kamu.</p>
          </div>

          <div>
            <strong>Transaction API</strong>
            <p>Buat transaksi sandbox dan dapatkan payment URL.</p>
          </div>

          <div>
            <strong>Payment Simulator</strong>
            <p>Simulasikan success, failed, pending, cancelled, atau expired.</p>
          </div>

          <div>
            <strong>Webhook Logs</strong>
            <p>Lihat response callback, attempt, dan status delivery.</p>
          </div>
        </div>
      </section>

      <section className="splitInfo">
        <div>
          <span className="kicker">Integration</span>
          <h2>Dari order sampai webhook.</h2>
          <p>
            Aplikasi kamu create transaction, user buka payment URL, lalu
            SandboxPay ID kirim webhook ke callback URL milik kamu.
          </p>
        </div>

        <div className="flowStack">
          <div>
            <span>01</span>
            <p>Backend kamu membuat transaksi.</p>
          </div>

          <div>
            <span>02</span>
            <p>User membuka payment simulator.</p>
          </div>

          <div>
            <span>03</span>
            <p>Status pembayaran disimulasikan.</p>
          </div>

          <div>
            <span>04</span>
            <p>Webhook dikirim ke callback URL.</p>
          </div>
        </div>
      </section>

      <section className="codeSection">
        <div className="sectionHead">
          <span>Example</span>
          <h2>Request sederhana.</h2>
          <p>
            Pakai dari backend, API server bot Discord, atau service checkout
            e-commerce.
          </p>
        </div>

        <div className="codePanel">
          <pre>{`await fetch("${API_BASE_URL}/api/v1/transactions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_SECRET_API_KEY"
  },
  body: JSON.stringify({
    order_id: "ORDER-001",
    amount: 50000,
    customer_name: "Customer",
    customer_email: "customer@email.com",
    payment_method: "MOCK_EWALLET",
    callback_url: "https://your-app.com/webhook/payment"
  })
});`}</pre>
        </div>
      </section>

      <FAQ />

      <section className="finalCta">
        <div>
          <h2>Bangun flow-nya dulu. Payment asli belakangan.</h2>
          <p>
            SandboxPay ID membantu kamu memahami alur integrasi sebelum pindah
            ke payment gateway resmi.
          </p>
        </div>

        <Link to="/register" className="button primary">
          Buat Akun Developer
        </Link>
      </section>
    </main>
  );
}

function Register({ refreshUser }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setMessage("Nama, email, dan password wajib diisi.");
      return;
    }

    setLoading(true);
    setMessage("Membuat akun...");

    try {
      const data = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setToken(data.data.token);
      await refreshUser();
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.message || "Register gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="authPage">
      <form className="authCard" onSubmit={submit}>
        <p className="eyebrow">Create Account</p>
        <h1>Register</h1>
        <p>Buat akun untuk generate API key dan mencoba transaksi sandbox.</p>

        <label>Nama</label>
        <input
          placeholder="Nama kamu"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="nama@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Minimal 6 karakter"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="button primary full" disabled={loading}>
          {loading ? "Memproses..." : "Register"}
        </button>

        {message && <div className="message">{message}</div>}

        <p className="switchText">
          Sudah punya akun? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}

function Login({ refreshUser }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    if (!form.email || !form.password) {
      setMessage("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    setMessage("Login...");

    try {
      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setToken(data.data.token);
      await refreshUser();
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.message || "Login gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="authPage">
      <form className="authCard" onSubmit={submit}>
        <p className="eyebrow">Welcome Back</p>
        <h1>Login</h1>
        <p>Masuk untuk melihat API key, transaksi, dan webhook logs.</p>

        <label>Email</label>
        <input
          type="email"
          placeholder="nama@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Masukkan password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="button primary full" disabled={loading}>
          {loading ? "Memproses..." : "Login"}
        </button>

        {message && <div className="message">{message}</div>}

        <p className="switchText">
          Belum punya akun? <Link to="/register">Register</Link>
        </p>
      </form>
    </main>
  );
}

function Dashboard({ user, refreshUser }) {
  const [apiKeys, setApiKeys] = useState([]);
  const [secretKey, setSecretKey] = useState(getSecretApiKey());
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState("");

  async function loadKeys() {
    try {
      const data = await apiRequest("/api/keys");
      setApiKeys(data.data.apiKeys || []);
    } catch (error) {
      setMessage(error.message || "Gagal mengambil API key.");
    }
  }

  async function generateKey() {
    setMessage("Membuat API key...");

    try {
      const data = await apiRequest("/api/keys/generate", {
        method: "POST",
      });

      setSecretKey(data.data.secretKey);
      setSecretApiKey(data.data.secretKey);
      setMessage(data.message);
      loadKeys();
    } catch (error) {
      setMessage(error.message || "Gagal membuat API key.");
    }
  }

  async function resetKey() {
    if (!confirm("Reset API key? Key lama akan dinonaktifkan.")) return;

    setMessage("Mereset API key...");

    try {
      const data = await apiRequest("/api/keys/reset", {
        method: "POST",
      });

      setSecretKey(data.data.secretKey);
      setSecretApiKey(data.data.secretKey);
      setMessage(data.message);
      loadKeys();
    } catch (error) {
      setMessage(error.message || "Gagal reset API key.");
    }
  }

  function handleCopySecret() {
    if (!secretKey) return;

    copyText(secretKey, () => {
      setCopied("Secret API key berhasil dicopy.");
      setTimeout(() => setCopied(""), 2200);
    });
  }

  useEffect(() => {
    refreshUser();
    loadKeys();
  }, []);

  if (!getToken()) return <Navigate to="/login" />;

  return (
    <main className="pageContainer">
      <section className="pageHeader">
        <div>
          <p className="eyebrow">Workspace</p>
          <h1>Halo, {user?.name || "Developer"}</h1>
          <p>
            Pantau API key, transaksi, dan callback webhook tanpa
            pindah-pindah tool.
          </p>
        </div>

        <div className="actions">
          <Link to="/transactions" className="button secondary">
            Buat Transaksi
          </Link>

          <Link to="/webhooks" className="button ghost">
            Lihat Webhook Logs
          </Link>
        </div>
      </section>

      <section className="statsGrid">
        <div className="statCard">
          <span>Total API Key</span>
          <strong>{apiKeys.length}</strong>
        </div>

        <div className="statCard">
          <span>Active Key</span>
          <strong>{apiKeys.filter((item) => item.isActive).length}</strong>
        </div>

        <div className="statCard wide">
          <span>API Base URL</span>
          <code>{API_BASE_URL}</code>
        </div>
      </section>

      <section className="dashboardGrid">
        <div className="panel">
          <h2>Profile</h2>

          <div className="infoRow">
            <span>Nama</span>
            <strong>{user?.name || "-"}</strong>
          </div>

          <div className="infoRow">
            <span>Email</span>
            <strong>{user?.email || "-"}</strong>
          </div>

          <div className="infoRow">
            <span>Role</span>
            <strong>{user?.role || "-"}</strong>
          </div>
        </div>

        <div className="panel">
          <h2>API Key</h2>
          <p>
            Secret key dipakai untuk request transaksi dari backend kamu.
            Simpan baik-baik karena key lengkap hanya tampil saat dibuat atau
            di-reset.
          </p>

          <div className="actions">
            <button onClick={generateKey} className="button primary">
              Generate Key
            </button>

            <button onClick={resetKey} className="button danger">
              Reset Key
            </button>
          </div>

          {secretKey && (
            <div className="secretBox">
              <span>Secret API Key</span>

              <div className="copyRow">
                <code>{secretKey}</code>
                <button onClick={handleCopySecret} className="button small ghost">
                  Copy
                </button>
              </div>
            </div>
          )}

          {copied && <div className="successMessage">{copied}</div>}
          {message && <div className="message">{message}</div>}
        </div>
      </section>

      <section className="panel">
        <div className="sectionHeader">
          <div>
            <h2>API Key List</h2>
            <p>Key yang aktif dan riwayat key yang pernah kamu buat.</p>
          </div>

          <button onClick={loadKeys} className="button ghost small">
            Refresh
          </button>
        </div>

        {apiKeys.length === 0 ? (
          <div className="emptyState">
            <h3>Belum ada API key</h3>
            <p>Generate API key pertama untuk mulai membuat transaksi.</p>
          </div>
        ) : (
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Prefix</th>
                  <th>Status</th>
                  <th>Last Used</th>
                  <th>Created At</th>
                </tr>
              </thead>

              <tbody>
                {apiKeys.map((key) => (
                  <tr key={key.id}>
                    <td>
                      <code>{key.keyPrefix}</code>
                    </td>
                    <td>
                      <StatusBadge status={key.isActive ? "ACTIVE" : "INACTIVE"} />
                    </td>
                    <td>{formatDate(key.lastUsedAt)}</td>
                    <td>{formatDate(key.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function Transactions() {
  const [apiKey, setApiKey] = useState(getSecretApiKey());
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [form, setForm] = useState({
    order_id: `ORDER-${Date.now()}`,
    amount: 50000,
    customer_name: "",
    customer_email: "",
    payment_method: "MOCK_EWALLET",
    callback_url: `${API_BASE_URL}/webhook-test/receive`,
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter((trx) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        trx.transactionId?.toLowerCase().includes(keyword) ||
        trx.orderId?.toLowerCase().includes(keyword) ||
        trx.customerName?.toLowerCase().includes(keyword) ||
        trx.customerEmail?.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "ALL" || trx.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, search, statusFilter]);

  function saveApiKey() {
    if (!apiKey) {
      setMessage("Secret API key wajib diisi.");
      return;
    }

    setSecretApiKey(apiKey);
    setMessage("Secret API key berhasil disimpan di browser.");
  }

  async function transactionRequest(path, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...(options.headers || {}),
    };

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) throw data;

    return data;
  }

  async function createTransaction(e) {
    e.preventDefault();

    if (!apiKey) {
      setMessage("Simpan Secret API Key dulu sebelum membuat transaksi.");
      return;
    }

    if (!form.customer_name || !form.customer_email) {
      setMessage("Customer name dan customer email wajib diisi.");
      return;
    }

    setMessage("Membuat transaksi...");

    try {
      const data = await transactionRequest("/api/v1/transactions", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
        }),
      });

      setMessage(data.message || "Transaksi berhasil dibuat.");
      setForm({ ...form, order_id: `ORDER-${Date.now()}` });
      loadTransactions();

      if (data.data.transaction.paymentUrl) {
        window.open(data.data.transaction.paymentUrl, "_blank");
      }
    } catch (error) {
      setMessage(error.message || "Gagal membuat transaksi.");
    }
  }

  async function loadTransactions() {
    if (!apiKey) {
      setMessage("Masukkan Secret API Key untuk mengambil transaksi.");
      return;
    }

    try {
      const data = await transactionRequest("/api/v1/transactions");
      setTransactions(data.data.transactions || []);
    } catch (error) {
      setMessage(error.message || "Gagal mengambil transaksi.");
    }
  }

  async function cancelTransaction(transactionId) {
    if (!confirm("Batalkan transaksi ini?")) return;

    try {
      const data = await transactionRequest(
        `/api/v1/transactions/${transactionId}/cancel`,
        { method: "POST" }
      );

      setMessage(data.message);
      loadTransactions();
    } catch (error) {
      setMessage(error.message || "Gagal membatalkan transaksi.");
    }
  }

  useEffect(() => {
    if (apiKey) loadTransactions();
  }, []);

  return (
    <main className="pageContainer">
      <section className="pageHeader">
        <div>
          <p className="eyebrow">Transactions</p>
          <h1>Buat transaksi sandbox.</h1>
          <p>
            Generate payment URL, buka simulator, lalu lihat status transaksi.
          </p>
        </div>
      </section>

      <section className="dashboardGrid">
        <div className="panel">
          <h2>Secret API Key</h2>
          <p>Key ini dipakai sebagai Bearer Token untuk endpoint transaksi.</p>

          <label>Secret API Key</label>
          <input
            placeholder="sk_test_xxxxx"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />

          <div className="actions">
            <button onClick={saveApiKey} className="button primary">
              Simpan Key
            </button>

            <button
              onClick={() => {
                setApiKey("");
                setSecretApiKey("");
                setMessage("Secret API key di browser sudah dikosongkan.");
              }}
              className="button ghost"
            >
              Clear
            </button>
          </div>
        </div>

        <form className="panel" onSubmit={createTransaction}>
          <h2>Create Transaction</h2>

          <label>Order ID</label>
          <input
            value={form.order_id}
            onChange={(e) => setForm({ ...form, order_id: e.target.value })}
          />

          <label>Amount</label>
          <input
            type="number"
            min="1000"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />

          <label>Customer Name</label>
          <input
            placeholder="Nama customer"
            value={form.customer_name}
            onChange={(e) =>
              setForm({ ...form, customer_name: e.target.value })
            }
          />

          <label>Customer Email</label>
          <input
            type="email"
            placeholder="customer@email.com"
            value={form.customer_email}
            onChange={(e) =>
              setForm({ ...form, customer_email: e.target.value })
            }
          />

          <label>Payment Method</label>
          <select
            value={form.payment_method}
            onChange={(e) =>
              setForm({ ...form, payment_method: e.target.value })
            }
          >
            <option value="MOCK_EWALLET">Mock E-Wallet</option>
            <option value="MOCK_QR">Mock QR Payment</option>
            <option value="MOCK_VA">Mock Virtual Account</option>
            <option value="MOCK_RETAIL">Mock Retail Payment</option>
          </select>

          <label>Callback URL</label>
          <input
            value={form.callback_url}
            onChange={(e) =>
              setForm({ ...form, callback_url: e.target.value })
            }
          />

          <button className="button primary full">Create Transaction</button>
        </form>
      </section>

      {message && <div className="message">{message}</div>}

      <section className="panel">
        <div className="sectionHeader">
          <div>
            <h2>Transaction History</h2>
            <p>Cari transaksi berdasarkan order ID, transaction ID, atau customer.</p>
          </div>

          <button onClick={loadTransactions} className="button ghost small">
            Refresh
          </button>
        </div>

        <div className="toolbar">
          <input
            placeholder="Cari transaksi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Semua Status</option>
            <option value="PENDING">Pending</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="EXPIRED">Expired</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="emptyState">
            <h3>Belum ada transaksi</h3>
            <p>Buat transaksi pertama kamu dari form di atas.</p>
          </div>
        ) : (
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Payment URL</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((trx) => (
                  <tr key={trx.transactionId}>
                    <td>
                      <StatusBadge status={trx.status} />
                    </td>
                    <td>{trx.orderId}</td>
                    <td>{formatRupiah(trx.amount)}</td>
                    <td>{trx.paymentMethod}</td>
                    <td>
                      <a
                        href={trx.paymentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="tableLink"
                      >
                        Open
                      </a>
                    </td>
                    <td>{formatDate(trx.createdAt)}</td>
                    <td>
                      {trx.status === "PENDING" ? (
                        <button
                          className="button danger small"
                          onClick={() => cancelTransaction(trx.transactionId)}
                        >
                          Cancel
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function WebhookLogs() {
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        log.transactionId?.toLowerCase().includes(keyword) ||
        log.eventName?.toLowerCase().includes(keyword) ||
        log.callbackUrl?.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "ALL" || log.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [logs, search, statusFilter]);

  async function loadLogs() {
    try {
      const data = await apiRequest("/api/webhook-logs");
      setLogs(data.data.logs || []);
      setMessage("");
    } catch (error) {
      setMessage(error.message || "Gagal mengambil webhook logs.");
    }
  }

  async function retryLog(id) {
    try {
      const data = await apiRequest(`/api/webhook-logs/${id}/retry`, {
        method: "POST",
      });

      setMessage(data.message);
      loadLogs();
    } catch (error) {
      setMessage(error.message || "Gagal retry webhook.");
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <main className="pageContainer">
      <section className="pageHeader">
        <div>
          <p className="eyebrow">Webhook Logs</p>
          <h1>Callback delivery.</h1>
          <p>Lihat status webhook yang dikirim ke endpoint developer.</p>
        </div>

        <button onClick={loadLogs} className="button ghost">
          Refresh
        </button>
      </section>

      {message && <div className="message">{message}</div>}

      <section className="panel">
        <div className="toolbar">
          <input
            placeholder="Cari webhook log..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Semua Status</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="emptyState">
            <h3>Webhook log masih kosong</h3>
            <p>Log akan muncul setelah transaksi disimulasikan.</p>
          </div>
        ) : (
          <div className="tableWrap">
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
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <StatusBadge status={log.status} />
                    </td>
                    <td>{log.eventName}</td>
                    <td>{log.transactionId}</td>
                    <td>{log.responseStatus || "-"}</td>
                    <td>{log.attempt}</td>
                    <td className="urlCell">{log.callbackUrl}</td>
                    <td>{formatDate(log.createdAt)}</td>
                    <td>
                      <button
                        onClick={() => retryLog(log.id)}
                        className="button ghost small"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function ProtectedRoute({ children }) {
  if (!getToken()) return <Navigate to="/login" />;
  return children;
}

function App() {
  const [user, setUser] = useState(null);

  async function refreshUser() {
    if (!getToken()) return;

    try {
      const data = await apiRequest("/api/auth/me");
      setUser(data.data.user);
    } catch {
      removeToken();
      setUser(null);
    }
  }

  function logout() {
    removeToken();
    setUser(null);
    window.location.href = "/";
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <>
      <Navbar user={user} onLogout={logout} />

      <Routes>
        <Route path="/" element={<Landing />} />

        <Route
          path="/register"
          element={<Register refreshUser={refreshUser} />}
        />

        <Route path="/login" element={<Login refreshUser={refreshUser} />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard user={user} refreshUser={refreshUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/webhooks"
          element={
            <ProtectedRoute>
              <WebhookLogs />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
