"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireLogin = exports.verifyGoogleToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client();
const verifyGoogleToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { credential } = req.body;
        const ticket = yield client.verifyIdToken({
            idToken: credential,
            audience: process.env.CLIENT_ID,
        });
        const payload = ticket.getPayload();
        req.DecodedIdToken = payload;
        next();
    }
    catch (e) {
        res.status(400).json({ "Error verifying ID token": e });
    }
});
exports.verifyGoogleToken = verifyGoogleToken;
const requireLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorization = req.headers["authorization"];
    if (!authorization) {
        res.status(401).json({ message: "authorization token required" });
        return;
    }
    const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "authorization token required" });
        return;
    }
    try {
        const { userId } = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = userId;
        console.log(userId, typeof req.userId);
        next();
    }
    catch (e) {
        if (e instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({ message: "Invalid Token" });
        }
        else {
            console.error(e);
            res
                .status(500)
                .json({ message: "Internal server error" });
        }
    }
});
exports.requireLogin = requireLogin;
