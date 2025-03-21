export const DOMAIN: string =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:5000"
    : "https://mecca-system.vercel.app";
