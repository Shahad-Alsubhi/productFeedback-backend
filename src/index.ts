import express from "express";
import cors from "cors";
import connectDB from "./config/DB";
import authRoutes from "./routes/authRoutes"
import feedbackRoutes from "./routes/feedbackRoutes"


const app = express();
connectDB;
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://product-feedback-amber.vercel.app"
    ],
    // credentials: true,
  })
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/users/auth",authRoutes)
app.use("/feedback",feedbackRoutes)

