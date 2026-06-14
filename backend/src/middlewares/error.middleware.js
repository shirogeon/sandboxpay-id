const { errorResponse } = require("../utils/response");

function notFoundHandler(req, res) {
  return errorResponse(
    res,
    `Route ${req.originalUrl} not found`,
    404,
    "ROUTE_NOT_FOUND"
  );
}

function errorHandler(err, req, res, next) {
  console.error("Unhandled error:", err);

  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      error_code: "VALIDATION_ERROR",
      errors: err.errors,
    });
  }

  return errorResponse(
    res,
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
    err.statusCode || 500,
    err.errorCode || "SERVER_ERROR"
  );
}

module.exports = {
  notFoundHandler,
  errorHandler,
};