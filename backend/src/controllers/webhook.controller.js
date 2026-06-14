const prisma = require("../config/prisma");
const { successResponse, errorResponse } = require("../utils/response");
const { sendPaymentWebhook } = require("../services/webhook.service");

async function listWebhookLogs(req, res, next) {
  try {
    const logs = await prisma.webhookLog.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        transactionId: true,
        eventName: true,
        callbackUrl: true,
        responseStatus: true,
        responseBody: true,
        status: true,
        attempt: true,
        errorMessage: true,
        createdAt: true,
      },
    });

    return successResponse(res, "Webhook logs berhasil diambil", {
      logs,
    });
  } catch (error) {
    next(error);
  }
}

async function getWebhookLogDetail(req, res, next) {
  try {
    const { id } = req.params;

    const log = await prisma.webhookLog.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!log) {
      return errorResponse(
        res,
        "Webhook log tidak ditemukan",
        404,
        "WEBHOOK_LOG_NOT_FOUND"
      );
    }

    return successResponse(res, "Webhook log detail berhasil diambil", {
      log,
    });
  } catch (error) {
    next(error);
  }
}

async function retryWebhook(req, res, next) {
  try {
    const { id } = req.params;

    const log = await prisma.webhookLog.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
      include: {
        transaction: true,
      },
    });

    if (!log) {
      return errorResponse(
        res,
        "Webhook log tidak ditemukan",
        404,
        "WEBHOOK_LOG_NOT_FOUND"
      );
    }

    const webhookResult = await sendPaymentWebhook(
      log.transaction,
      log.attempt + 1
    );

    return successResponse(res, "Webhook retry sudah diproses", {
      webhook: webhookResult,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listWebhookLogs,
  getWebhookLogDetail,
  retryWebhook,
};