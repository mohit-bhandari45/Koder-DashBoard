import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../../utils/jwt.util";

export function authCheck(req: Request, res: Response, next: NextFunction) {
  let token: string | undefined;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const user = verifyAccessToken(token);
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
