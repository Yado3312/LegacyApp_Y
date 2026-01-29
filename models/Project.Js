import mongoose from "mongoose";
const { Schema } = mongoose;

const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

export default mongoose.model("Project", ProjectSchema);
