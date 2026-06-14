const crypto = require("crypto");

function generateRandomToken(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

function generateApiKey() {
  const rawKey = `sk_test_${generateRandomToken(24)}`;
  const prefix = rawKey.slice(0, 16);

  return {
    rawKey,
    prefix,
  };
}

function hashValue(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function generateTransactionId() {
  return `trx_${generateRandomToken(12)}`;
}

function createWebhookSignature(payload, secret) {
  const stringPayload =
    typeof payload === "string" ? payload : JSON.stringify(payload);

  return crypto
    .createHmac("sha256", secret)
    .update(stringPayload)
    .digest("hex");
}

module.exports = {
  generateRandomToken,
  generateApiKey,
  hashValue,
  generateTransactionId,
  createWebhookSignature,
};