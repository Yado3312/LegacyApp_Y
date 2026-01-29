import mongoose from "mongoose";
const { Schema } = mongoose;

const NotificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  message: {
    type: String,
    required: true
  },

  read: {
    type: Boolean,
    default: false
  },

  relatedTask: {
    type: Schema.Types.ObjectId,
    ref: "Task"
  }
}, { timestamps: true });

export default mongoose.model("Notification", NotificationSchema);
