import JWT from "jsonwebtoken";
import { JWTPayload } from "./types";
import { serialize } from "cookie";

export default function generateToken(jwtPayload: JWTPayload): string {
  const token = JWT.sign(jwtPayload, process.env.JWT_KEY as string, {
    expiresIn: "1d",
  });
  return token;
}

export function setCookie(jwtPayload: JWTPayload): string {
  const token = generateToken(jwtPayload);
  const cookie = serialize("jwtToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", //development = http, production = https
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return cookie;
}
