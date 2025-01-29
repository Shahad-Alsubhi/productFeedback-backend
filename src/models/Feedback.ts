import mongoose from "mongoose";
import { IUser } from "./User";

interface IComment {
  created_by: IUser;
  text: string;
  replay_to?: string;
  parent_comment?: string;
}
export interface IFeedback {
  userId: string;
  title: string;
  detail: string;
  category: "UX" | "UI" | "Feature" | "Bug" | "Enhancement";
  update_status: "In-progress" | "Live" | "Planned" | "Suggestion";
  Upvotes: number;
  comments: IComment[];
}

const CommentSchema = new mongoose.Schema<IComment>({
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
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

const FeedbackSchema = new mongoose.Schema<IFeedback>({
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

const Feedback = mongoose.model<IFeedback>("feedback", FeedbackSchema);
export default Feedback;
