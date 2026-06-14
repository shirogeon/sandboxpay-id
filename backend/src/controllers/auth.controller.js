const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

const prisma = require("../config/prisma");
const { successResponse, errorResponse } = require("../utils/response");

const registerSchema = z.object({
  name: z.string().min(3, "Name minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

async function register(req, res, next) {
  try {
    const body = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      return errorResponse(
        res,
        "Email sudah terdaftar",
        409,
        "EMAIL_ALREADY_EXISTS"
      );
    }

    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const token = generateToken(user);

    return successResponse(
      res,
      "Register berhasil",
      {
        user,
        token,
      },
      201
    );
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const body = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      return errorResponse(
        res,
        "Email atau password salah",
        401,
        "INVALID_CREDENTIALS"
      );
    }

    const isPasswordValid = await bcrypt.compare(
      body.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return errorResponse(
        res,
        "Email atau password salah",
        401,
        "INVALID_CREDENTIALS"
      );
    }

    const token = generateToken(user);

    return successResponse(res, "Login berhasil", {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
}

async function getProfile(req, res, next) {
  try {
    return successResponse(res, "Profile berhasil diambil", {
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getProfile,
};