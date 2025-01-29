import mongoose from "mongoose";

export interface IUser {
  email: string;
  picture: string;
  name: string;
  googleId: string;
  username:string
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    trim: true,
  },
  picture: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
    required: true,
  },
});

const User = mongoose.model<IUser>("user", userSchema);
export default User;
