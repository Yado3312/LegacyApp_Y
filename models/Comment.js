import mongoose from "mongoose";
const { Schema } = mongoose;

const CommentSchema = new Schema({
  task: {
    type: Schema.Types.ObjectId,
    ref: "Task",
    required: true
  },
  comment: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Comment", CommentSchema);
