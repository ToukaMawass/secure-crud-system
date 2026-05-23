import jwt from "jsonwebtoken";
import { UserRole } from "@/lib/users";

export type JwtPayload = {
  username: string;
  role: UserRole;
};

export function createToken(payload: JwtPayload) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing.");
  }

  return jwt.sign(payload, secret, {
    expiresIn: "1h",
  });
}

export function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing.");
  }

  return jwt.verify(token, secret) as JwtPayload;
}