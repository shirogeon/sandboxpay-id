function successResponse(res, message, data = null, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function errorResponse(res, message, statusCode = 500, errorCode = "SERVER_ERROR") {
  return res.status(statusCode).json({
    success: false,
    message,
    error_code: errorCode,
  });
}

module.exports = {
  successResponse,
  errorResponse,
};