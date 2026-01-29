import express from "express";
import { getCommentsByTask, createComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/:taskId", getCommentsByTask);  // Obtener comentarios por tarea
router.post("/", createComment);             // Agregar comentario

export default router;
