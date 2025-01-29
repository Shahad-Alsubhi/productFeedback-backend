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
exports.signin = void 0;
const User_1 = __importDefault(require("../models/User"));
const tokenUtils_1 = require("../utils/tokenUtils");
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, sub: googleId, email, picture } = req.DecodedIdToken;
        let user = yield User_1.default.findOne({ email });
        if (!user) {
            user = yield new User_1.default({
                name,
                googleId,
                email,
                picture,
                username: name.split(" ")[0] + parseFloat(Math.random().toFixed(3)) * 1000,
            }).save();
        }
        const { refreshToken, accessToken } = (0, tokenUtils_1.generateTokens)(user.id);
        (0, tokenUtils_1.setRefreshToken)(res, refreshToken);
        res.status(201).json({
            message: "User signin successfully",
            accessToken,
        });
    }
    catch (e) {
        console.error("signin error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.signin = signin;
