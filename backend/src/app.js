require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const webhookTestRoutes = require("./routes/webhook-test.routes");
const routes = require("./routes");
const testerRoutes = require("./routes/tester.routes");
const transactionTesterRoutes = require("./routes/transaction-tester.routes");
const paymentRoutes = require("./routes/payment-routes");
const webhookLogTesterRoutes = require("./routes/webhook-log-tester.routes");
const docsRoutes = require("./routes/docs.routes");

const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/error.middleware");

const app = express();

const allowedOrigins = [
  "http://localhost:5000",
  "http://127.0.0.1:5000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

if (process.env.CORS_ORIGIN) {
  const envOrigins = process.env.CORS_ORIGIN.split(",").map((origin) =>
    origin.trim()
  );

  allowedOrigins.push(...envOrigins);
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (
        process.env.NODE_ENV === "development" &&
        (origin.includes("localhost") || origin.includes("127.0.0.1"))
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to SandboxPay ID API",
    docs: "/docs",
    health: "/api/health",
    tester: "/tester",
    transactionTester: "/transaction-tester",
    webhookLogTester: "/webhook-log-tester",
    webhookTest: "/webhook-test/logs",
    paymentExample: "/pay/trx_xxxxx",
  });
});

app.use("/docs", docsRoutes);
app.use("/tester", testerRoutes);
app.use("/transaction-tester", transactionTesterRoutes);
app.use("/webhook-log-tester", webhookLogTesterRoutes);
app.use("/pay", paymentRoutes);
app.use("/webhook-test", webhookTestRoutes);
app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;