import express from "express";
import taskController from "../controllers/task.controller.js";
import { validate } from "../middleware/error.middleware.js";
import { createTaskSchema, updateTaskSchema } from "../validators/task.validator.js";

const router = express.Router();

router.post("/", validate(createTaskSchema), taskController.createTask);
router.get("/", taskController.getTasks);
router.get("/stats", taskController.getTaskStats);
router.get("/:id", taskController.getTaskById);
router.put("/:id", validate(updateTaskSchema), taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;