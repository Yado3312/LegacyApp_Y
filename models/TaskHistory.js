import mongoose from "mongoose";
const { Schema } = mongoose;

const TaskHistorySchema = new Schema({
  task: {
    type: Schema.Types.ObjectId,
    ref: "Task",
    required: true
  },

  action: {
    type: String,
    required: true
    // Ej: CREATED, UPDATED, STATUS_CHANGE, DELETED
  },

  oldValue: String,
  newValue: String,

  changedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

export default mongoose.model("TaskHistory", TaskHistorySchema);
