import { Router } from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  searchTasks
} from "../controllers/task.controller.js";

const router = Router();

// La ruta de búsqueda debe ir ANTES de /:id para que no se confunda
router.get("/search", searchTasks);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
