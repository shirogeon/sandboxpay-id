const { z } = require("zod");

const prisma = require("../config/prisma");
const { successResponse, errorResponse } = require("../utils/response");
const { generateTransactionId } = require("../utils/crypto");
const { sendPaymentWebhook } = require("../services/webhook.service");

const createTransactionSchema = z.object({
  order_id: z.string().min(3, "Order ID minimal 3 karakter"),
  amount: z.number().int().min(1000, "Amount minimal 1000"),
  customer_name: z.string().optional(),
  customer_email: z.string().email("Email customer tidak valid").optional(),
  payment_method: z
    .enum(["MOCK_EWALLET", "MOCK_QR", "MOCK_VA", "MOCK_RETAIL"])
    .default("MOCK_EWALLET"),
  callback_url: z.string().url("Callback URL tidak valid").optional(),
  redirect_url: z.string().url("Redirect URL tidak valid").optional(),
});

function getPaymentUrl(transactionId) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
  return `${backendUrl}/pay/${transactionId}`;
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

async function createTransaction(req, res, next) {
  try {
    const body = createTransactionSchema.parse(req.body);

    const duplicateOrder = await prisma.transaction.findFirst({
      where: {
        userId: req.developer.id,
        orderId: body.order_id,
      },
    });

    if (duplicateOrder) {
      return errorResponse(
        res,
        "Order ID sudah pernah digunakan",
        409,
        "ORDER_ID_ALREADY_EXISTS"
      );
    }

    const transactionId = generateTransactionId();
    const expiredAt = addMinutes(new Date(), 30);
    const paymentUrl = getPaymentUrl(transactionId);

    const transaction = await prisma.transaction.create({
      data: {
        userId: req.developer.id,
        transactionId,
        orderId: body.order_id,
        amount: body.amount,
        customerName: body.customer_name || null,
        customerEmail: body.customer_email || null,
        paymentMethod: body.payment_method,
        callbackUrl: body.callback_url || null,
        redirectUrl: body.redirect_url || null,
        expiredAt,
        paymentUrl,
      },
      select: {
        transactionId: true,
        orderId: true,
        amount: true,
        customerName: true,
        customerEmail: true,
        paymentMethod: true,
        status: true,
        paymentUrl: true,
        callbackUrl: true,
        redirectUrl: true,
        expiredAt: true,
        createdAt: true,
      },
    });

    return successResponse(
      res,
      "Transaction berhasil dibuat",
      {
        transaction,
      },
      201
    );
  } catch (error) {
    next(error);
  }
}

async function listTransactions(req, res, next) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.developer.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        transactionId: true,
        orderId: true,
        amount: true,
        paymentMethod: true,
        status: true,
        paymentUrl: true,
        expiredAt: true,
        paidAt: true,
        cancelledAt: true,
        createdAt: true,
      },
    });

    return successResponse(res, "Transaction list berhasil diambil", {
      transactions,
    });
  } catch (error) {
    next(error);
  }
}

async function getTransactionDetail(req, res, next) {
  try {
    const { transactionId } = req.params;

    const transaction = await prisma.transaction.findFirst({
      where: {
        transactionId,
        userId: req.developer.id,
      },
      select: {
        transactionId: true,
        orderId: true,
        amount: true,
        customerName: true,
        customerEmail: true,
        paymentMethod: true,
        status: true,
        paymentUrl: true,
        callbackUrl: true,
        redirectUrl: true,
        expiredAt: true,
        paidAt: true,
        cancelledAt: true,
        createdAt: true,
        updatedAt: true,
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

    return successResponse(res, "Transaction detail berhasil diambil", {
      transaction,
    });
  } catch (error) {
    next(error);
  }
}

async function cancelTransaction(req, res, next) {
    try {
      const { transactionId } = req.params;
  
      const transaction = await prisma.transaction.findFirst({
        where: {
          transactionId,
          userId: req.developer.id,
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
          "Hanya transaksi pending yang bisa dibatalkan",
          400,
          "TRANSACTION_CANNOT_BE_CANCELLED"
        );
      }
  
      const updatedTransaction = await prisma.transaction.update({
        where: {
          transactionId,
        },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
        },
      });
  
      const webhookResult = await sendPaymentWebhook(updatedTransaction);
  
      return successResponse(res, "Transaction berhasil dibatalkan", {
        transaction: {
          transactionId: updatedTransaction.transactionId,
          orderId: updatedTransaction.orderId,
          amount: updatedTransaction.amount,
          paymentMethod: updatedTransaction.paymentMethod,
          status: updatedTransaction.status,
          cancelledAt: updatedTransaction.cancelledAt,
          updatedAt: updatedTransaction.updatedAt,
        },
        webhook: webhookResult,
      });
    } catch (error) {
      next(error);
    }
  }

module.exports = {
  createTransaction,
  listTransactions,
  getTransactionDetail,
  cancelTransaction,
};