import { useEffect, useState } from "react";
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
  }).format(value || 0);
}

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        SandboxPay ID
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
    <main className="container">
      <section className="hero">
        <div>
          <p className="eyebrow">Mock Payment Gateway Sandbox</p>
          <h1>Belajar integrasi payment gateway tanpa uang asli.</h1>
          <p className="heroText">
            SandboxPay ID adalah mock API untuk developer yang ingin belajar
            membuat transaksi, payment URL, simulasi status pembayaran, API key,
            webhook callback, dan webhook logs.
          </p>

          <div className="actions">
            <Link to="/register" className="button primary">
              Mulai Sekarang
            </Link>
            <a
              href={`${API_BASE_URL}/docs`}
              target="_blank"
              rel="noreferrer"
              className="button secondary"
            >
              Buka Dokumentasi
            </a>
          </div>
        </div>

        <div className="codeCard">
          <div className="badge success">payment.success</div>
          <h3>Webhook Payload</h3>
          <pre>{`{
  "event": "payment.success",
  "transaction_id": "trx_xxxxx",
  "order_id": "ORDER-001",
  "amount": 50000,
  "status": "SUCCESS"
}`}</pre>
        </div>
      </section>

      <section className="features">
        <div className="panel">
          <h3>API Key</h3>
          <p>Generate secret key untuk mengakses endpoint transaksi.</p>
        </div>

        <div className="panel">
          <h3>Transaction API</h3>
          <p>Buat transaksi sandbox dan dapatkan payment URL otomatis.</p>
        </div>

        <div className="panel">
          <h3>Payment Simulator</h3>
          <p>Simulasikan pembayaran sukses, gagal, pending, atau expired.</p>
        </div>

        <div className="panel">
          <h3>Webhook Logs</h3>
          <p>Lihat response webhook, attempt, status, dan retry webhook.</p>
        </div>
      </section>
    </main>
  );
}

function Register({ refreshUser }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "Shiroge Developer",
    email: "shiroge@example.com",
    password: "password123",
  });

  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMessage("Memproses register...");

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
    }
  }

  return (
    <main className="authPage">
      <form className="authCard" onSubmit={submit}>
        <h1>Register Developer</h1>
        <p>Buat akun untuk mendapatkan API key sandbox.</p>

        <label>Nama</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label>Email</label>
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="button primary full">Register</button>

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
    email: "shiroge@example.com",
    password: "password123",
  });

  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();
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
    }
  }

  return (
    <main className="authPage">
      <form className="authCard" onSubmit={submit}>
        <h1>Login Developer</h1>
        <p>Masuk untuk mengelola API key dan transaksi sandbox.</p>

        <label>Email</label>
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="button primary full">Login</button>

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

  async function loadKeys() {
    try {
      const data = await apiRequest("/api/keys");
      setApiKeys(data.data.apiKeys);
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

  useEffect(() => {
    refreshUser();
    loadKeys();
  }, []);

  if (!getToken()) {
    return <Navigate to="/login" />;
  }

  return (
    <main className="container">
      <section className="dashboardHeader">
        <div>
          <p className="eyebrow">Developer Dashboard</p>
          <h1>Selamat datang, {user?.name || "Developer"}</h1>
          <p>
            Kelola API key sandbox, cek transaksi, dan pantau webhook dari satu
            dashboard.
          </p>
        </div>

        <div className="actions">
          <Link to="/transactions" className="button secondary">
            Transactions
          </Link>
          <Link to="/webhooks" className="button secondary">
            Webhook Logs
          </Link>
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
          <h2>API Key</h2>
          <p>
            Secret API key hanya tampil saat generate atau reset. Simpan baik-baik
            karena key ini dipakai untuk create transaction.
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
              <code>{secretKey}</code>
            </div>
          )}

          {message && <div className="message">{message}</div>}
        </div>
      </section>

      <section className="panel">
        <div className="sectionHeader">
          <h2>API Key List</h2>
          <button onClick={loadKeys} className="button secondary small">
            Refresh
          </button>
        </div>

        {apiKeys.length === 0 ? (
          <p>Belum ada API key.</p>
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
                    <td>{key.keyPrefix}</td>
                    <td>
                      <span
                        className={
                          key.isActive ? "badge success" : "badge danger"
                        }
                      >
                        {key.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
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

  const [form, setForm] = useState({
    order_id: `ORDER-${Date.now()}`,
    amount: 50000,
    customer_name: "Bayhaqi",
    customer_email: "bayhaqi@example.com",
    payment_method: "MOCK_EWALLET",
    callback_url: "http://localhost:5000/webhook-test/receive",
  });

  function saveApiKey() {
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
    setMessage("Membuat transaksi...");

    try {
      const data = await transactionRequest("/api/v1/transactions", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
        }),
      });

      setMessage(data.message);
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
    try {
      const data = await transactionRequest("/api/v1/transactions");
      setTransactions(data.data.transactions);
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
    <main className="container">
      <section className="dashboardHeader">
        <div>
          <p className="eyebrow">Transaction Management</p>
          <h1>Transactions</h1>
          <p>
            Buat transaksi sandbox, buka payment simulator, dan kelola status
            transaksi.
          </p>
        </div>
      </section>

      <section className="gridTwo">
        <div className="panel">
          <h2>Secret API Key</h2>
          <p>Masukkan secret API key dari dashboard.</p>

          <label>Secret API Key</label>
          <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} />

          <button onClick={saveApiKey} className="button primary full">
            Simpan API Key
          </button>
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
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />

          <label>Customer Name</label>
          <input
            value={form.customer_name}
            onChange={(e) =>
              setForm({ ...form, customer_name: e.target.value })
            }
          />

          <label>Customer Email</label>
          <input
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
          <h2>Transaction History</h2>
          <button onClick={loadTransactions} className="button secondary small">
            Refresh
          </button>
        </div>

        {transactions.length === 0 ? (
          <p>Belum ada transaksi.</p>
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
                {transactions.map((trx) => (
                  <tr key={trx.transactionId}>
                    <td>
                      <span className={`badge ${trx.status.toLowerCase()}`}>
                        {trx.status}
                      </span>
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

  async function loadLogs() {
    try {
      const data = await apiRequest("/api/webhook-logs");
      setLogs(data.data.logs);
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
    <main className="container">
      <section className="dashboardHeader">
        <div>
          <p className="eyebrow">Webhook Monitoring</p>
          <h1>Webhook Logs</h1>
          <p>
            Pantau callback yang dikirim ke developer, response status, attempt,
            dan retry webhook.
          </p>
        </div>

        <button onClick={loadLogs} className="button secondary">
          Refresh
        </button>
      </section>

      {message && <div className="message">{message}</div>}

      <section className="panel">
        {logs.length === 0 ? (
          <p>Webhook log masih kosong.</p>
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
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <span className={`badge ${log.status.toLowerCase()}`}>
                        {log.status}
                      </span>
                    </td>
                    <td>{log.eventName}</td>
                    <td>{log.transactionId}</td>
                    <td>{log.responseStatus || "-"}</td>
                    <td>{log.attempt}</td>
                    <td>{log.callbackUrl}</td>
                    <td>{formatDate(log.createdAt)}</td>
                    <td>
                      <button
                        onClick={() => retryLog(log.id)}
                        className="button secondary small"
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
        <Route path="/register" element={<Register refreshUser={refreshUser} />} />
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