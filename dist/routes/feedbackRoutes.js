"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const feedbackController_1 = require("../controllers/feedbackController");
const router = express_1.default.Router();
router.post("/new", authMiddleware_1.requireLogin, feedbackController_1.addFeedback);
router.get("", feedbackController_1.getFeedbacks);
router.get("/:id", feedbackController_1.getFeedbackById);
router.patch("/:id", authMiddleware_1.requireLogin, feedbackController_1.editFeedback);
router.post("/comment", authMiddleware_1.requireLogin, feedbackController_1.addComment);
exports.default = router;
