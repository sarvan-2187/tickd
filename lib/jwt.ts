import jwt from "jsonwebtoken";

export interface JWTPayload {
  userId: string;
  email: string;
}

const SECRET = process.env.JWT_SECRET!;
const EXPIRY = "24h";

export function signToken(payload: JWTPayload): string {
  if (!SECRET) throw new Error("JWT_SECRET is not set.");
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRY });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    if (!SECRET) throw new Error("JWT_SECRET is not set.");
    return jwt.verify(token, SECRET) as JWTPayload;
  } catch {
    return null;
  }
}
