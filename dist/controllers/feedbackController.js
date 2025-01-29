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
exports.addComment = exports.editFeedback = exports.getFeedbackById = exports.getFeedbacks = exports.addFeedback = void 0;
const Feedback_1 = __importDefault(require("../models/Feedback"));
const mongoose_1 = __importDefault(require("mongoose"));
const addFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, detail, category } = req.body;
        const userId = req.userId;
        yield Feedback_1.default.create({ userId, title, detail, category });
        res.status(200).json({ message: "the feedback was added successfully" });
    }
    catch (e) {
        console.error(e);
        if (e instanceof mongoose_1.default.Error.ValidationError)
            res.status(400).json({ message: e.message });
        else
            res.status(500).json({ message: "Internal server error" });
    }
});
exports.addFeedback = addFeedback;
const getFeedbacks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { excludeSuggestion } = req.query;
        const filter = excludeSuggestion === "true"
            ? {
                update_status: { $ne: "Suggestion" },
            }
            : { update_status: { $in: "Suggestion" } };
        const feedbacks = yield Feedback_1.default.find(filter).populate({
            path: "comments.created_by",
            select: "-googleId",
        });
        console.log(feedbacks);
        res.status(200).json({ feedbacks });
    }
    catch (e) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getFeedbacks = getFeedbacks;
const getFeedbackById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const feedback = yield Feedback_1.default.findById(id).populate({
            path: "comments.created_by",
            select: "-googleId",
        });
        res.status(200).json({ feedback });
    }
    catch (e) {
        if (e instanceof mongoose_1.default.Error.CastError)
            res.status(400).json({ message: e.message });
        else
            res.status(500).json({ message: "Internal server error" });
    }
});
exports.getFeedbackById = getFeedbackById;
const editFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { id: feedback_id } = req.params;
        const { title, detail, category, update_status } = req.body;
        const feedback = yield Feedback_1.default.findById(feedback_id);
        if (!feedback) {
            res.status(404).json({ message: "Document not found" });
            return;
        }
        if ((feedback === null || feedback === void 0 ? void 0 : feedback.userId) !== userId) {
            res.status(401).json({ message: "not authorized" });
            return;
        }
        if (!title || !detail || !category || !update_status) {
            res.status(400).json({ message: "all fields required" });
            return;
        }
        yield Feedback_1.default.findByIdAndUpdate(feedback_id, {
            title,
            detail,
            category,
            update_status,
        }, { runValidators: true });
        res.status(200).json({ message: "Feedback updated successfully" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.editFeedback = editFeedback;
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text, replay_to, parent_comment, feedback_id } = req.body;
        const userId = req.userId;
        const updatedFeedback = yield Feedback_1.default.findByIdAndUpdate(feedback_id, {
            $push: {
                comments: { created_by: userId, replay_to, parent_comment, text },
            },
        }, { new: true, runValidators: true });
        if (!updatedFeedback) {
            res.status(404).json({ message: "Document not found" });
            return;
        }
        res.status(200).json({ message: "the comment was added successfully" });
    }
    catch (e) {
        console.error(e);
        if (e instanceof mongoose_1.default.Error.ValidationError)
            res.status(400).json({ message: e.message });
        else
            res.status(500).json({ message: "Internal server error" });
    }
});
exports.addComment = addComment;
