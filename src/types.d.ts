import * as express from "express";


interface DecodedToken {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

declare global {
  namespace Express {
    export interface Request {
      DecodedIdToken?: DecodedIdToken;
      userId:String
    }
  }
}
