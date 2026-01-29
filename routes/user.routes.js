import { Router } from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deactivateUser
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deactivateUser);

export default router;
