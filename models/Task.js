import mongoose from "mongoose";
const { Schema } = mongoose;

const TaskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,

  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed", "Blocked", "Cancelled"],
    default: "Pending"
  },

  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Critical"],
    default: "Medium"
  },

  project: {
    type: Schema.Types.ObjectId,
    ref: "Project"
  },

  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  dueDate: Date,

  estimatedHours: {
    type: Number,
    min: 0
  },

  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

export default mongoose.model("Task", TaskSchema);
