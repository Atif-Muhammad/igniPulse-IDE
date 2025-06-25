import crypto from "crypto"
import { normalizeCode } from "./normalizeCode.js";

export function hashCode(code) {
  const normalized = normalizeCode(code);
  return crypto.createHash("sha256").update(normalized).digest("hex");
}