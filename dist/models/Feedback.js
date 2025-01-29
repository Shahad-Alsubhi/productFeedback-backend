"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommentSchema = new mongoose_1.default.Schema({
    created_by: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    replay_to: {
        type: String,
    },
    parent_comment: {
        type: String,
    },
});
const FeedbackSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    detail: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ["UX", "UI", "Feature", "Bug", "Enhancement"],
        required: true,
    },
    update_status: {
        type: String,
        enum: ["In-progress", "Live", "Planned", "Suggestion"],
        default: "Suggestion",
    },
    Upvotes: {
        type: Number,
        default: 0,
    },
    comments: { type: [CommentSchema] },
});
const Feedback = mongoose_1.default.model("feedback", FeedbackSchema);
exports.default = Feedback;
