import { Router } from "express";
import {
  taskReport,
  projectReport,
  userReport
} from "../controllers/report.controller.js";

const router = Router();

router.get("/tasks", taskReport);
router.get("/projects", projectReport);
router.get("/users", userReport);

export default router;
