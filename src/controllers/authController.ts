import { Request, Response } from "express";
import User from "../models/User";
import { generateTokens, setRefreshToken } from "../utils/tokenUtils";

const signin = async (req: Request, res: Response) => {
  try {
    const { name, sub: googleId, email, picture } = req.DecodedIdToken;
    let user = await User.findOne({ email });
    if (!user) {
      user = await new User({
        name,
        googleId,
        email,
        picture,
        username:
          name.split(" ")[0] + parseFloat(Math.random().toFixed(3)) * 1000,
      }).save();
    }
    const { refreshToken, accessToken } = generateTokens(user.id);
    setRefreshToken(res, refreshToken);

    res.status(201).json({
      message: "User signin successfully",
      accessToken,
    });
  } catch (e) {
    console.error("signin error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { signin };
