import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library";


const client = new OAuth2Client();
const verifyGoogleToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { credential } = req.body;  
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    req.DecodedIdToken=payload

    next()
  } catch (e) {
    res.status(400).json({ "Error verifying ID token": e });
  }
};

const requireLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    res.status(401).json({ message: "authorization token required" });
    return;
  }

  const token = authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "authorization token required" });
    return;
  }

  try {    
    const { userId } = jwt.verify(token!, process.env.ACCESS_TOKEN_SECRET!) as {
      userId: string;
    };
    req.userId = userId;
    console.log(userId, typeof req.userId);

    next();
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid Token" });
    } else {
      console.error(e);
      res
        .status(500)
        .json({ message: "Internal server error" });
    }
  }
};
export { verifyGoogleToken,requireLogin };
