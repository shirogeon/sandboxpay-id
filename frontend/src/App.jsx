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
  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <img
          src="/brand/sandboxpay-icon.png"
          alt="SandboxPay ID icon"
          className="brandLogo"
        />
        <span>SandboxPay ID</span>
      </Link>

      <div className="navLinks">
        <a href={`${API_BASE_URL}/docs`} target="_blank" rel="noreferrer">
          Docs
        </a>

        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/transactions">Transactions</Link>
            <Link to="/webhooks">Webhook Logs</Link>
            <button onClick={onLogout} className="navButton">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="navPrimary">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

function Landing() {
  return (
    <main>
      <section className="publicHero">
        <div className="container publicHeroGrid">
          <div className="publicHeroText">
            <div className="heroBrandLockup">
              <img
                src="/brand/sandboxpay-icon.png"
                alt="SandboxPay ID icon"
                className="heroBrandIcon"
              />

              <div>
                <strong>SandboxPay ID</strong>
                <span>Payment sandbox for developers</span>
              </div>
            </div>

            <div className="productBadge">Sandbox Payment Gateway API</div>

            <h1>Mock payment gateway untuk latihan integrasi pembayaran.</h1>

            <p>
              SandboxPay ID membantu developer belajar membuat transaksi,
              payment URL, API key, payment simulator, webhook callback, dan
              webhook logs tanpa memproses uang asli.
            </p>

            <div className="publicActions">
              <Link to="/register" className="button primary">
                Mulai Testing
              </Link>

              <a
                href={`${API_BASE_URL}/docs`}
                target="_blank"
                rel="noreferrer"
                className="button ghost"
              >
                Buka Dokumentasi
              </a>
            </div>

            <div className="publicMiniStats">
              <div>
                <strong>API Key</strong>
                <span>Bearer token style</span>
              </div>

              <div>
                <strong>Webhook</strong>
                <span>Callback simulator</span>
              </div>

              <div>
                <strong>No Real Money</strong>
                <span>Aman untuk belajar</span>
              </div>
            </div>
          </div>

          <div className="terminalPreview">
            <div className="terminalTop">
              <span></span>
              <span></span>
              <span></span>
              <p>Create Transaction</p>
            </div>

            <pre>{`POST /api/v1/transactions

{
  "order_id": "ORDER-001",
  "amount": 50000,
  "payment_method": "MOCK_EWALLET",
  "callback_url": "${API_BASE_URL}/webhook-test/receive"
}`}</pre>

            <div className="terminalResult">
              <StatusBadge status="SUCCESS" />
              <p>payment_url generated</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container publicSection">
        <div className="publicSectionHeader">
          <span>Kenapa SandboxPay ID?</span>
          <h2>Dibuat untuk developer yang ingin belajar flow payment gateway.</h2>
          <p>
            Portal payment resmi biasanya butuh verifikasi bisnis. SandboxPay ID
            memberi environment aman untuk memahami alur teknisnya dulu.
          </p>
        </div>

        <div className="publicFeatureGrid">
          <div className="publicFeatureCard">
            <div className="featureIcon">01</div>
            <h3>Developer Account</h3>
            <p>Register dan login untuk mengelola API key dan transaksi.</p>
          </div>

          <div className="publicFeatureCard">
            <div className="featureIcon">02</div>
            <h3>API Key Management</h3>
            <p>Generate secret key untuk akses endpoint transaksi sandbox.</p>
          </div>

          <div className="publicFeatureCard">
            <div className="featureIcon">03</div>
            <h3>Payment Simulator</h3>
            <p>Simulasikan pembayaran success, failed, pending, atau expired.</p>
          </div>

          <div className="publicFeatureCard">
            <div className="featureIcon">04</div>
            <h3>Webhook Logs</h3>
            <p>Lihat callback URL, response status, attempt, dan retry log.</p>
          </div>
        </div>
      </section>

      <section className="container publicSection">
        <div className="apiFlowCard">
          <div>
            <span className="sectionTag">Integration Flow</span>
            <h2>Flow testing yang mirip payment gateway asli.</h2>
          </div>

          <div className="apiFlowSteps">
            <div>
              <strong>1</strong>
              <p>Developer generate API key dari dashboard.</p>
            </div>

            <div>
              <strong>2</strong>
              <p>Client membuat transaksi lewat endpoint API.</p>
            </div>

            <div>
              <strong>3</strong>
              <p>User membuka payment simulator dari payment URL.</p>
            </div>

            <div>
              <strong>4</strong>
              <p>Sistem mengirim webhook ke callback URL developer.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container publicSection">
        <div className="endpointShowcase">
          <div className="endpointText">
            <span className="sectionTag">API Preview</span>
            <h2>Endpoint yang siap dicoba dari dokumentasi.</h2>
            <p>
              Gunakan dashboard untuk generate API key, lalu pakai endpoint ini
              dari aplikasi, Postman, atau terminal.
            </p>
          </div>

          <div className="endpointList">
            <div>
              <span>POST</span>
              <code>/api/auth/register</code>
            </div>

            <div>
              <span>POST</span>
              <code>/api/keys/generate</code>
            </div>

            <div>
              <span>POST</span>
              <code>/api/v1/transactions</code>
            </div>

            <div>
              <span>GET</span>
              <code>/api/webhook-logs</code>
            </div>
          </div>
        </div>
      </section>

      <section className="container publicCta">
        <div>
          <span className="sectionTag">Ready</span>
          <h2>Mulai buat transaksi sandbox pertama kamu.</h2>
          <p>
            Cocok untuk latihan backend, frontend integration, webhook handling,
            dan portfolio fullstack.
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
    setMessage("Membuat akun developer...");

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
        <h1>Register Developer</h1>
        <p>
          Buat akun untuk mengelola API key dan mencoba payment gateway sandbox.
        </p>

        <label>Nama</label>
        <input
          placeholder="Contoh: Andi Developer"
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
    setMessage("Memproses login...");

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
        <h1>Login Developer</h1>
        <p>Masuk untuk melihat API key, transaksi, dan webhook logs kamu.</p>

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
    if (!confirm("Yakin ingin reset API key? API key lama akan dinonaktifkan.")) {
      return;
    }

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

  if (!getToken()) {
    return <Navigate to="/login" />;
  }

  return (
    <main className="container pageContainer">
      <section className="pageHeader">
        <div>
          <p className="eyebrow">Developer Dashboard</p>
          <h1>Halo, {user?.name || "Developer"}</h1>
          <p>
            Kelola API key, buat transaksi sandbox, dan cek webhook delivery
            dari satu dashboard.
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

        <div className="statCard">
          <span>API Base URL</span>
          <code>{API_BASE_URL}</code>
        </div>
      </section>

      <section className="gridTwo">
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
          <h2>API Key Management</h2>
          <p>
            Secret API key hanya tampil saat generate atau reset. Simpan key ini
            karena dipakai sebagai Bearer Token untuk endpoint transaksi.
          </p>

          <div className="actions">
            <button onClick={generateKey} className="button primary">
              Generate API Key
            </button>

            <button onClick={resetKey} className="button danger">
              Reset API Key
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
            <p>Daftar API key yang pernah dibuat untuk akun ini.</p>
          </div>

          <button onClick={loadKeys} className="button ghost small">
            Refresh
          </button>
        </div>

        {apiKeys.length === 0 ? (
          <div className="emptyState">
            <h3>Belum ada API key</h3>
            <p>Generate API key pertama kamu untuk mulai membuat transaksi.</p>
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

    if (!response.ok) {
      throw data;
    }

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
        {
          method: "POST",
        }
      );

      setMessage(data.message);
      loadTransactions();
    } catch (error) {
      setMessage(error.message || "Gagal membatalkan transaksi.");
    }
  }

  useEffect(() => {
    if (apiKey) {
      loadTransactions();
    }
  }, []);

  return (
    <main className="container pageContainer">
      <section className="pageHeader">
        <div>
          <p className="eyebrow">Transaction Management</p>
          <h1>Transactions</h1>
          <p>
            Buat transaksi sandbox, buka payment simulator, dan pantau status
            transaksi.
          </p>
        </div>
      </section>

      <section className="gridTwo">
        <div className="panel">
          <h2>Secret API Key</h2>
          <p>
            Gunakan secret API key dari dashboard. Key ini disimpan di browser
            lokal kamu.
          </p>

          <label>Secret API Key</label>
          <input
            placeholder="sk_test_xxxxx"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />

          <div className="actions">
            <button onClick={saveApiKey} className="button primary">
              Simpan API Key
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
    <main className="container pageContainer">
      <section className="pageHeader">
        <div>
          <p className="eyebrow">Webhook Monitoring</p>
          <h1>Webhook Logs</h1>
          <p>
            Pantau callback yang dikirim ke endpoint developer, response status,
            attempt, dan retry webhook.
          </p>
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
  if (!getToken()) {
    return <Navigate to="/login" />;
  }

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
    </>
  );
}

export default App;