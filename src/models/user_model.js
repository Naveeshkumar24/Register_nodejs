import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true }
});

export default mongoose.model("User", userSchema);
