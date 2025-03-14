import { NextRequest } from "next/server";
import JWT from "jsonwebtoken";
import { JWTPayload } from "./types";

export function verifyToken(request: NextRequest): JWTPayload | null {
  try {
    const authToken = request.cookies.get("jwtToken");
    const token = authToken?.value as string;
    if (!token) return null;
    const privateKey = process.env.JWT_KEY as string;
    const userPayload = JWT.verify(token, privateKey) as JWTPayload;
    return userPayload;
  } catch (error) {
    return null;
  }
}

export function verifyTokenForPage(token: string): JWTPayload | null {
  try {
    if (!token) return null;
    const privateKey = process.env.JWT_KEY as string;
    const userPayload = JWT.verify(token, privateKey) as JWTPayload;
    if (!userPayload) return null;
    return userPayload;
  } catch (error) {
    return null;
  }
}
