require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const routes = require("./routes");
const testerRoutes = require("./routes/tester.routes");
const transactionTesterRoutes = require("./routes/transaction-tester.routes");
const paymentRoutes = require("./routes/payment.routes");
const webhookTestRoutes = require("./routes/webhook-test.routes");
const webhookLogTesterRoutes = require("./routes/webhook-log-tester.routes");
const docsRoutes = require("./routes/docs.routes");

const { notFoundHandler, errorHandler } = require("./middlewares/error.middleware");

const app = express();

/*
|--------------------------------------------------------------------------
| CORS CONFIG
|--------------------------------------------------------------------------
| Aman untuk:
| - localhost development
| - frontend Vercel production
| - backend Vercel direct access
| - Vercel preview domain
| - request tanpa origin seperti browser direct, Postman, health check
|--------------------------------------------------------------------------
*/

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5000",
];

const envAllowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const extraAllowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.BACKEND_URL,
]
  .map((origin) => (origin || "").trim())
  .filter(Boolean);

const allowedOrigins = [
  ...defaultAllowedOrigins,
  ...envAllowedOrigins,
  ...extraAllowedOrigins,
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Sandboxpay-Event",
      "X-Sandboxpay-Signature",
    ],
  })
);

app.options("*", cors());

/*
|--------------------------------------------------------------------------
| BASIC MIDDLEWARE
|--------------------------------------------------------------------------
*/

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

/*
|--------------------------------------------------------------------------
| ROOT
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to SandboxPay ID API",
    data: {
      app: "SandboxPay ID",
      environment: process.env.NODE_ENV || "development",
      docs: "/docs",
      health: "/api/health",
      tester: "/tester",
      transactionTester: "/transaction-tester",
      webhookLogTester: "/webhook-log-tester",
      webhookTest: "/webhook-test/logs",
      paymentExample: "/pay/trx_xxxxx",
    },
  });
});

/*
|--------------------------------------------------------------------------
| ROUTES
|--------------------------------------------------------------------------
*/

app.use("/docs", docsRoutes);
app.use("/tester", testerRoutes);
app.use("/transaction-tester", transactionTesterRoutes);
app.use("/webhook-log-tester", webhookLogTesterRoutes);
app.use("/pay", paymentRoutes);
app.use("/webhook-test", webhookTestRoutes);
app.use("/api", routes);

/*
|--------------------------------------------------------------------------
| ERROR HANDLERS
|--------------------------------------------------------------------------
*/

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;