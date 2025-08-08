import jwt from "jsonwebtoken";

const accessSecret = process.env.ACCESS_TOKEN_SECRET || "access_secret";

export function verifyAccessToken(token: string): any {
    return jwt.verify(token, accessSecret);
}