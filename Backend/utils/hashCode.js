// import crypto from "crypto"
const crypto = require("crypto")
// import { normalizeCode } from "./normalizeCode.js";
const {normalizeCode} = require("./normalizeCode")

exports.hashCode = function(code) {
  const normalized = normalizeCode(code);
  return crypto.createHash("sha256").update(normalized).digest("hex");
}