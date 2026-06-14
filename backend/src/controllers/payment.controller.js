const prisma = require("../config/prisma");
const { successResponse, errorResponse } = require("../utils/response");
const { sendPaymentWebhook } = require("../services/webhook.service");

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getStatusLabel(status) {
  const labels = {
    PENDING: "Menunggu Pembayaran",
    SUCCESS: "Pembayaran Berhasil",
    FAILED: "Pembayaran Gagal",
    EXPIRED: "Transaksi Expired",
    CANCELLED: "Transaksi Dibatalkan",
  };

  return labels[status] || status;
}

function getPaymentMethodLabel(method) {
  const labels = {
    MOCK_EWALLET: "Mock E-Wallet",
    MOCK_QR: "Mock QR Payment",
    MOCK_VA: "Mock Virtual Account",
    MOCK_RETAIL: "Mock Retail Payment",
  };

  return labels[method] || method;
}

async function autoExpireTransaction(transaction) {
  const now = new Date();

  if (
    transaction.status === "PENDING" &&
    transaction.expiredAt &&
    now > transaction.expiredAt
  ) {
    return prisma.transaction.update({
      where: {
        transactionId: transaction.transactionId,
      },
      data: {
        status: "EXPIRED",
      },
    });
  }

  return transaction;
}

async function showPaymentPage(req, res, next) {
  try {
    const { transactionId } = req.params;

    let transaction = await prisma.transaction.findUnique({
      where: {
        transactionId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!transaction) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Transaction Not Found</title>
          <style>
            body {
              margin: 0;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #0f172a;
              color: #e5e7eb;
              font-family: Arial, sans-serif;
              padding: 24px;
            }
            .card {
              max-width: 520px;
              width: 100%;
              background: #111827;
              border: 1px solid #1f2937;
              border-radius: 18px;
              padding: 28px;
              text-align: center;
            }
            h1 {
              margin-top: 0;
            }
            p {
              color: #94a3b8;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Transaksi Tidak Ditemukan</h1>
            <p>Transaction ID yang kamu buka tidak tersedia di SandboxPay ID.</p>
          </div>
        </body>
        </html>
      `);
    }

    transaction = await autoExpireTransaction(transaction);

    const isFinalStatus = ["SUCCESS", "FAILED", "EXPIRED", "CANCELLED"].includes(
      transaction.status
    );

    const expiredAt = transaction.expiredAt
      ? new Date(transaction.expiredAt).toLocaleString("id-ID")
      : "-";

    const paidAt = transaction.paidAt
      ? new Date(transaction.paidAt).toLocaleString("id-ID")
      : "-";

    return res.send(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SandboxPay Payment Simulator</title>
  <style>
    * {
      box-sizing: border-box;
      font-family: Arial, sans-serif;
    }

    body {
      margin: 0;
      min-height: 100vh;
      background:
        radial-gradient(circle at top left, rgba(37, 99, 235, 0.25), transparent 32%),
        #0f172a;
      color: #e5e7eb;
      padding: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .wrapper {
      width: 100%;
      max-width: 560px;
    }

    .brand {
      text-align: center;
      margin-bottom: 18px;
    }

    .brand h1 {
      margin: 0;
      font-size: 28px;
    }

    .brand p {
      color: #94a3b8;
      margin: 8px 0 0;
      line-height: 1.5;
    }

    .card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    }

    .status {
      display: inline-block;
      padding: 8px 12px;
      border-radius: 999px;
      background: #1e293b;
      color: #bfdbfe;
      font-size: 13px;
      font-weight: bold;
      margin-bottom: 18px;
    }

    .status.SUCCESS {
      background: rgba(22, 163, 74, 0.18);
      color: #86efac;
    }

    .status.FAILED,
    .status.EXPIRED,
    .status.CANCELLED {
      background: rgba(220, 38, 38, 0.18);
      color: #fca5a5;
    }

    .amount {
      font-size: 36px;
      font-weight: 800;
      margin: 10px 0 4px;
    }

    .subtitle {
      color: #94a3b8;
      margin-bottom: 24px;
    }

    .info {
      border-top: 1px solid #1f2937;
      border-bottom: 1px solid #1f2937;
      padding: 16px 0;
      margin: 18px 0;
    }

    .row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 9px 0;
      font-size: 14px;
    }

    .row span:first-child {
      color: #94a3b8;
    }

    .row span:last-child {
      color: #e5e7eb;
      text-align: right;
      word-break: break-word;
    }

    .actions {
      display: grid;
      gap: 10px;
      margin-top: 18px;
    }

    button, a.button-link {
      width: 100%;
      border: none;
      padding: 13px 14px;
      border-radius: 12px;
      color: white;
      font-weight: bold;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      display: block;
      font-size: 14px;
    }

    .success {
      background: #16a34a;
    }

    .success:hover {
      background: #15803d;
    }

    .failed {
      background: #dc2626;
    }

    .failed:hover {
      background: #b91c1c;
    }

    .pending {
      background: #334155;
    }

    .pending:hover {
      background: #475569;
    }

    .expired {
      background: #f97316;
    }

    .expired:hover {
      background: #ea580c;
    }

    .redirect {
      background: #2563eb;
    }

    .redirect:hover {
      background: #1d4ed8;
    }

    .note {
      margin-top: 18px;
      color: #94a3b8;
      font-size: 13px;
      line-height: 1.6;
      text-align: center;
    }

    .result {
      margin-top: 14px;
      background: #020617;
      border: 1px solid #1f2937;
      border-radius: 12px;
      padding: 12px;
      font-size: 13px;
      color: #cbd5e1;
      display: none;
      white-space: pre-wrap;
    }

    @media (max-width: 520px) {
      body {
        padding: 16px;
      }

      .card {
        padding: 20px;
      }

      .amount {
        font-size: 30px;
      }

      .row {
        flex-direction: column;
        gap: 4px;
      }

      .row span:last-child {
        text-align: left;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="brand">
      <h1>SandboxPay ID</h1>
      <p>Payment simulator untuk testing integrasi API. Tidak memproses uang asli.</p>
    </div>

    <div class="card">
      <div class="status ${transaction.status}">
        ${getStatusLabel(transaction.status)}
      </div>

      <div class="amount">${formatRupiah(transaction.amount)}</div>
      <div class="subtitle">Order ID: ${transaction.orderId}</div>

      <div class="info">
        <div class="row">
          <span>Transaction ID</span>
          <span>${transaction.transactionId}</span>
        </div>

        <div class="row">
          <span>Payment Method</span>
          <span>${getPaymentMethodLabel(transaction.paymentMethod)}</span>
        </div>

        <div class="row">
          <span>Customer</span>
          <span>${transaction.customerName || "-"}</span>
        </div>

        <div class="row">
          <span>Email</span>
          <span>${transaction.customerEmail || "-"}</span>
        </div>

        <div class="row">
          <span>Developer</span>
          <span>${transaction.user ? transaction.user.name : "-"}</span>
        </div>

        <div class="row">
          <span>Expired At</span>
          <span>${expiredAt}</span>
        </div>

        <div class="row">
          <span>Paid At</span>
          <span>${paidAt}</span>
        </div>
      </div>

      ${
        isFinalStatus
          ? `
            <div class="note">
              Transaksi ini sudah memiliki status final. Status tidak bisa diubah lagi melalui simulator.
            </div>

            ${
              transaction.redirectUrl
                ? `<a class="button-link redirect" href="${transaction.redirectUrl}">Kembali ke Website Developer</a>`
                : ""
            }
          `
          : `
            <div class="actions">
              <button class="success" onclick="simulatePayment('SUCCESS')">
                Simulasikan Pembayaran Berhasil
              </button>

              <button class="failed" onclick="simulatePayment('FAILED')">
                Simulasikan Pembayaran Gagal
              </button>

              <button class="pending" onclick="simulatePayment('PENDING')">
                Tetap Pending
              </button>

              <button class="expired" onclick="simulatePayment('EXPIRED')">
                Simulasikan Expired
              </button>
            </div>

            <div class="note">
              Ini hanya halaman simulator untuk testing. Tidak ada saldo, QR, bank, atau e-wallet asli yang diproses.
            </div>
          `
      }

      <div class="result" id="result"></div>
    </div>
  </div>

  <script>
    async function simulatePayment(status) {
      const resultBox = document.getElementById("result");

      resultBox.style.display = "block";
      resultBox.textContent = "Memproses simulasi pembayaran...";

      try {
        const response = await fetch("/pay/${transaction.transactionId}/simulate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status })
        });

        const data = await response.json();

        resultBox.textContent = JSON.stringify(data, null, 2);

        if (data.success) {
          setTimeout(() => {
            window.location.reload();
          }, 900);
        }
      } catch (error) {
        resultBox.textContent = error.message || String(error);
      }
    }
  </script>
</body>
</html>
    `);
  } catch (error) {
    next(error);
  }
}

async function simulatePayment(req, res, next) {
    try {
      const { transactionId } = req.params;
      const { status } = req.body;
  
      const allowedStatuses = ["SUCCESS", "FAILED", "PENDING", "EXPIRED"];
  
      if (!allowedStatuses.includes(status)) {
        return errorResponse(
          res,
          "Status simulasi tidak valid",
          400,
          "INVALID_SIMULATION_STATUS"
        );
      }
  
      const transaction = await prisma.transaction.findUnique({
        where: {
          transactionId,
        },
      });
  
      if (!transaction) {
        return errorResponse(
          res,
          "Transaction tidak ditemukan",
          404,
          "TRANSACTION_NOT_FOUND"
        );
      }
  
      if (transaction.status !== "PENDING") {
        return errorResponse(
          res,
          "Status transaksi sudah final dan tidak bisa diubah",
          400,
          "TRANSACTION_ALREADY_FINAL"
        );
      }
  
      const data = {
        status,
      };
  
      if (status === "SUCCESS") {
        data.paidAt = new Date();
      }
  
      const updatedTransaction = await prisma.transaction.update({
        where: {
          transactionId,
        },
        data,
      });
  
      const webhookResult = await sendPaymentWebhook(updatedTransaction);
  
      return successResponse(res, "Simulasi pembayaran berhasil diproses", {
        transaction: {
          transactionId: updatedTransaction.transactionId,
          orderId: updatedTransaction.orderId,
          amount: updatedTransaction.amount,
          paymentMethod: updatedTransaction.paymentMethod,
          status: updatedTransaction.status,
          paymentUrl: updatedTransaction.paymentUrl,
          redirectUrl: updatedTransaction.redirectUrl,
          expiredAt: updatedTransaction.expiredAt,
          paidAt: updatedTransaction.paidAt,
          updatedAt: updatedTransaction.updatedAt,
        },
        webhook: webhookResult,
      });
    } catch (error) {
      next(error);
    }
  }

module.exports = {
  showPaymentPage,
  simulatePayment,
};