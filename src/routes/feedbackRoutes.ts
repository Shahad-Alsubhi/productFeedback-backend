import express from "express";
import { requireLogin } from "../middleware/authMiddleware";
import { addFeedback,editFeedback,getFeedbacks,addComment,getFeedbackById } from "../controllers/feedbackController";

const router = express.Router();

router.post("/new", requireLogin, addFeedback);
router.get("",getFeedbacks)
router.get("/:id", getFeedbackById) 
router.patch("/:id",requireLogin,editFeedback)
router.post("/comment",requireLogin,addComment)

export default router;
