import mongoose from "mongoose";

const echoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    content: { type: String, required: true },
    tags: [String],
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

const Echo = mongoose.model("Echo", echoSchema);
export default Echo;
