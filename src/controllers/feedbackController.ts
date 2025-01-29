import { Request, Response } from "express";
import Feedback from "../models/Feedback";
import mongoose from "mongoose";

export const addFeedback = async (req: Request, res: Response) => {
  try {
    const { title, detail, category } = req.body;
    const userId = req.userId;
    await Feedback.create({ userId, title, detail, category });
    res.status(200).json({ message: "the feedback was added successfully" });
  } catch (e) {
    console.error(e);
    if (e instanceof mongoose.Error.ValidationError)
      res.status(400).json({ message: e.message });
    else res.status(500).json({ message: "Internal server error" });
  }
};

export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const { excludeSuggestion} = req.query;
    const filter =
      excludeSuggestion === "true"
        ? {
            update_status: { $ne: "Suggestion" },
          }
        : { update_status: { $in: "Suggestion" } }
    const feedbacks = await Feedback.find(filter).populate({
      path: "comments.created_by",
      select: "-googleId",

    });
    res.status(200).json({ feedbacks });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFeedbackById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findById(id).populate({
      path: "comments.created_by",
      select: "-googleId",
    });
    res.status(200).json({ feedback });
  } catch (e) {
    if (e instanceof mongoose.Error.CastError)
      res.status(400).json({ message: e.message });
    else res.status(500).json({ message: "Internal server error" });
  }
};

export const editFeedback = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id: feedback_id } = req.params;
    const { title, detail, category, update_status } = req.body;
    const feedback = await Feedback.findById(feedback_id);
    if (!feedback) {
      res.status(404).json({ message: "Document not found" });
      return;
    }
    if (feedback?.userId !== userId) {
      res.status(401).json({ message: "not authorized" });
      return;
    }
    if (!title || !detail || !category || !update_status) {
      res.status(400).json({ message: "all fields required" });
      return;
    }
    await Feedback.findByIdAndUpdate(
      feedback_id,
      {
        title,
        detail,
        category,
        update_status,
      },
      { runValidators: true }
    );
    res.status(200).json({ message: "Feedback updated successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addComment = async (req: Request, res: Response) => {
  try {
    const { text, replay_to, parent_comment, feedback_id } = req.body;
    const userId = req.userId;
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      feedback_id,
      {
        $push: {
          comments: { created_by: userId, replay_to, parent_comment, text },
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedFeedback) {
      res.status(404).json({ message: "Document not found" });
      return;
    }
    res.status(200).json({ message: "the comment was added successfully" });
  } catch (e) {
    console.error(e);
    if (e instanceof mongoose.Error.ValidationError)
      res.status(400).json({ message: e.message });
    else res.status(500).json({ message: "Internal server error" });
  }
};
