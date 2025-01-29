import express from "express";
import { verifyGoogleToken } from "../middleware/authMiddleware";
import { signin } from "../controllers/authController";

const router = express.Router();

router.post("/signin", verifyGoogleToken,signin);


export default router;
