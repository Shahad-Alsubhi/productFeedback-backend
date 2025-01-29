import jwt from "jsonwebtoken";
import { Response } from "express";


export const generateTokens = (userId: string) => {
    const accessToken = jwt.sign(
      {  userId :userId},
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "5h",
      }
    );
    const refreshToken = jwt.sign(
      {  userId:userId },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "2d",
      }
    );
    return { accessToken, refreshToken };
  };
  
  export const setRefreshToken = (res: Response, refreshToken: string) => {
    res.cookie("refreshToken", refreshToken, {
      maxAge: 172800000, //2d
      httpOnly: true, 
      sameSite:"none",
      secure:true
    });
  };