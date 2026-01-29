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
    enum: ["Pendiente", "En Progreso", "Completada", "Bloqueada", "Cancelada"],
    default: "Pendiente"
  },

  priority: {
    type: String,
    enum: ["Baja", "Media", "Alta", "Crítica"],
    default: "Media"
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
