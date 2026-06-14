const prisma = require("../config/prisma");
const { errorResponse } = require("../utils/response");
const { hashValue } = require("../utils/crypto");

function hashApiKey(rawKey) {
  return hashValue(`${rawKey}.${process.env.API_KEY_SECRET}`);
}

async function apiKeyMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(
        res,
        "API key tidak ditemukan",
        401,
        "API_KEY_REQUIRED"
      );
    }

    const rawKey = authHeader.split(" ")[1];

    if (!rawKey || !rawKey.startsWith("sk_test_")) {
      return errorResponse(
        res,
        "Format API key tidak valid",
        401,
        "INVALID_API_KEY_FORMAT"
      );
    }

    const keyHash = hashApiKey(rawKey);

    const apiKey = await prisma.apiKey.findFirst({
      where: {
        keyHash,
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!apiKey) {
      return errorResponse(
        res,
        "API key tidak valid atau sudah tidak aktif",
        401,
        "INVALID_API_KEY"
      );
    }

    await prisma.apiKey.update({
      where: {
        id: apiKey.id,
      },
      data: {
        lastUsedAt: new Date(),
      },
    });

    req.apiKey = apiKey;
    req.developer = apiKey.user;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = apiKeyMiddleware;