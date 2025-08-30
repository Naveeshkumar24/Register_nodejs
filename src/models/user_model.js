import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  lastLogin: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
