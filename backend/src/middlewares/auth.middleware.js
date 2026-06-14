const jwt = require("jsonwebtoken");

const prisma = require("../config/prisma");
const { errorResponse } = require("../utils/response");

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(
        res,
        "Token tidak ditemukan",
        401,
        "TOKEN_REQUIRED"
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return errorResponse(
        res,
        "User tidak ditemukan",
        401,
        "USER_NOT_FOUND"
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(
      res,
      "Token tidak valid atau sudah expired",
      401,
      "INVALID_TOKEN"
    );
  }
}

module.exports = authMiddleware;