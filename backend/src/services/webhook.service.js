const axios = require("axios");

const prisma = require("../config/prisma");
const { createWebhookSignature } = require("../utils/crypto");

function getEventNameByStatus(status) {
  const events = {
    PENDING: "payment.pending",
    SUCCESS: "payment.success",
    FAILED: "payment.failed",
    EXPIRED: "payment.expired",
    CANCELLED: "payment.cancelled",
  };

  return events[status] || "payment.updated";
}

function buildWebhookPayload(transaction) {
  return {
    event: getEventNameByStatus(transaction.status),
    transaction_id: transaction.transactionId,
    order_id: transaction.orderId,
    amount: transaction.amount,
    payment_method: transaction.paymentMethod,
    status: transaction.status,
    customer_name: transaction.customerName,
    customer_email: transaction.customerEmail,
    paid_at: transaction.paidAt,
    expired_at: transaction.expiredAt,
    created_at: transaction.createdAt,
    updated_at: transaction.updatedAt,
  };
}

async function sendPaymentWebhook(transaction, attempt = 1) {
  if (!transaction.callbackUrl) {
    return {
      sent: false,
      message: "Callback URL tidak tersedia",
    };
  }

  const payload = buildWebhookPayload(transaction);
  const signature = createWebhookSignature(
    payload,
    process.env.WEBHOOK_SECRET || "dev_webhook_secret_sandboxpay"
  );

  try {
    const response = await axios.post(transaction.callbackUrl, payload, {
      timeout: 8000,
      headers: {
        "Content-Type": "application/json",
        "X-Sandboxpay-Event": payload.event,
        "X-Sandboxpay-Signature": signature,
      },
      validateStatus: () => true,
    });

    const isSuccess = response.status >= 200 && response.status < 300;

    await prisma.webhookLog.create({
      data: {
        userId: transaction.userId,
        transactionId: transaction.transactionId,
        eventName: payload.event,
        callbackUrl: transaction.callbackUrl,
        payload,
        responseStatus: response.status,
        responseBody:
          typeof response.data === "string"
            ? response.data
            : JSON.stringify(response.data),
        status: isSuccess ? "SUCCESS" : "FAILED",
        attempt,
        errorMessage: isSuccess ? null : "Webhook returned non-2xx response",
      },
    });

    return {
      sent: true,
      success: isSuccess,
      status: response.status,
      event: payload.event,
    };
  } catch (error) {
    await prisma.webhookLog.create({
      data: {
        userId: transaction.userId,
        transactionId: transaction.transactionId,
        eventName: payload.event,
        callbackUrl: transaction.callbackUrl,
        payload,
        responseStatus: null,
        responseBody: null,
        status: "FAILED",
        attempt,
        errorMessage: error.message,
      },
    });

    return {
      sent: true,
      success: false,
      event: payload.event,
      error: error.message,
    };
  }
}

module.exports = {
  sendPaymentWebhook,
  buildWebhookPayload,
  getEventNameByStatus,
};