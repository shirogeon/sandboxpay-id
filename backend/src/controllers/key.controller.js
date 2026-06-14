const prisma = require("../config/prisma");
const { successResponse, errorResponse } = require("../utils/response");
const { generateApiKey, hashValue } = require("../utils/crypto");

function hashApiKey(rawKey) {
  return hashValue(`${rawKey}.${process.env.API_KEY_SECRET}`);
}

async function getApiKeys(req, res, next) {
  try {
    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        keyPrefix: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true,
      },
    });

    return successResponse(res, "API key berhasil diambil", {
      apiKeys,
    });
  } catch (error) {
    next(error);
  }
}

async function generateNewApiKey(req, res, next) {
  try {
    const activeKey = await prisma.apiKey.findFirst({
      where: {
        userId: req.user.id,
        isActive: true,
      },
    });

    if (activeKey) {
      return errorResponse(
        res,
        "Kamu masih punya API key aktif. Reset API key jika ingin membuat yang baru.",
        409,
        "ACTIVE_API_KEY_EXISTS"
      );
    }

    const { rawKey, prefix } = generateApiKey();
    const keyHash = hashApiKey(rawKey);

    const apiKey = await prisma.apiKey.create({
      data: {
        userId: req.user.id,
        keyPrefix: prefix,
        keyHash,
      },
      select: {
        id: true,
        keyPrefix: true,
        isActive: true,
        createdAt: true,
      },
    });

    return successResponse(
      res,
      "API key berhasil dibuat. Simpan API key ini karena hanya ditampilkan sekali.",
      {
        apiKey,
        secretKey: rawKey,
      },
      201
    );
  } catch (error) {
    next(error);
  }
}

async function resetApiKey(req, res, next) {
  try {
    await prisma.apiKey.updateMany({
      where: {
        userId: req.user.id,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    const { rawKey, prefix } = generateApiKey();
    const keyHash = hashApiKey(rawKey);

    const apiKey = await prisma.apiKey.create({
      data: {
        userId: req.user.id,
        keyPrefix: prefix,
        keyHash,
      },
      select: {
        id: true,
        keyPrefix: true,
        isActive: true,
        createdAt: true,
      },
    });

    return successResponse(res, "API key berhasil di-reset", {
      apiKey,
      secretKey: rawKey,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getApiKeys,
  generateNewApiKey,
  resetApiKey,
};