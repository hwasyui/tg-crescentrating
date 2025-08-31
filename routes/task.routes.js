import express from "express";
import taskController from "../controllers/task.controller.js";
import { validate } from "../middleware/error.middleware.js";
import { createTaskSchema, updateTaskSchema } from "../validators/task.validator.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - category
 *         - priority
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the task
 *           example: "60d0fe4f5311236168a109ca"
 *         title:
 *           type: string
 *           description: Task title
 *           example: "Complete project proposal"
 *           minLength: 1
 *           maxLength: 200
 *         description:
 *           type: string
 *           description: Task description
 *           example: "Write a comprehensive project proposal for the new client"
 *           maxLength: 1000
 *         category:
 *           type: string
 *           enum: [Work, Personal, Shopping, Health, Education, Other]
 *           description: Task category
 *           example: "Work"
 *         priority:
 *           type: string
 *           enum: [Low, Medium, High]
 *           description: Task priority level
 *           example: "High"
 *         deadline:
 *           type: string
 *           format: date-time
 *           description: Task deadline
 *           example: "2025-12-31T23:59:59.000Z"
 *         completed:
 *           type: boolean
 *           description: Task completion status
 *           example: false
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Task creation timestamp
 *           example: "2024-01-15T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Task last update timestamp
 *           example: "2024-01-15T10:30:00.000Z"
 *     
 *     CreateTaskRequest:
 *       type: object
 *       required:
 *         - title
 *         - category
 *         - priority
 *       properties:
 *         title:
 *           type: string
 *           description: Task title
 *           example: "Complete project proposal"
 *           minLength: 1
 *           maxLength: 200
 *         description:
 *           type: string
 *           description: Task description
 *           example: "Write a comprehensive project proposal for the new client"
 *           maxLength: 1000
 *         category:
 *           type: string
 *           enum: [Work, Personal, Shopping, Health, Education, Other]
 *           description: Task category
 *           example: "Work"
 *         priority:
 *           type: string
 *           enum: [Low, Medium, High]
 *           description: Task priority level
 *           example: "High"
 *         deadline:
 *           type: string
 *           format: date-time
 *           description: Task deadline
 *           example: "2025-12-31T23:59:59.000Z"
 *
 *     UpdateTaskRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Task title
 *           example: "Updated project proposal"
 *           minLength: 1
 *           maxLength: 200
 *         description:
 *           type: string
 *           description: Task description
 *           example: "Updated description for the project proposal"
 *           maxLength: 1000
 *         category:
 *           type: string
 *           enum: [Work, Personal, Shopping, Health, Education, Other]
 *           description: Task category
 *           example: "Work"
 *         priority:
 *           type: string
 *           enum: [Low, Medium, High]
 *           description: Task priority level
 *           example: "Medium"
 *         deadline:
 *           type: string
 *           format: date-time
 *           description: Task deadline
 *           example: "2025-12-31T23:59:59.000Z"
 *         completed:
 *           type: boolean
 *           description: Task completion status
 *           example: true
 *
 *     TaskStats:
 *       type: object
 *       properties:
 *         total:
 *           type: number
 *           description: Total number of tasks
 *           example: 25
 *         completed:
 *           type: number
 *           description: Number of completed tasks
 *           example: 10
 *         pending:
 *           type: number
 *           description: Number of pending tasks
 *           example: 15
 *         overdue:
 *           type: number
 *           description: Number of overdue tasks
 *           example: 3
 *         byCategory:
 *           type: object
 *           description: Task count by category
 *           example:
 *             Work: 10
 *             Personal: 8
 *             Shopping: 4
 *             Health: 2
 *             Education: 1
 *         byPriority:
 *           type: object
 *           description: Task count by priority
 *           example:
 *             High: 5
 *             Medium: 12
 *             Low: 8
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *           example: "Task not found"
 *         message:
 *           type: string
 *           description: Detailed error message
 *           example: "The requested task with ID 60d0fe4f5311236168a109ca was not found"
 *         status:
 *           type: number
 *           description: HTTP status code
 *           example: 404
 *
 *     ValidationError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Validation failed"
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: "title"
 *               message:
 *                 type: string
 *                 example: "Title is required"
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: Creates a new task with the provided details
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskRequest'
 *           examples:
 *             workTask:
 *               summary: Work task example
 *               value:
 *                 title: "Complete project proposal"
 *                 description: "Write a comprehensive project proposal for the new client"
 *                 category: "Work"
 *                 priority: "High"
 *                 deadline: "2025-12-31T23:59:59.000Z"
 *             personalTask:
 *               summary: Personal task example
 *               value:
 *                 title: "Buy groceries"
 *                 description: "Weekly grocery shopping"
 *                 category: "Shopping"
 *                 priority: "Medium"
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *             example:
 *               _id: "60d0fe4f5311236168a109ca"
 *               title: "Complete project proposal"
 *               description: "Write a comprehensive project proposal for the new client"
 *               category: "Work"
 *               priority: "High"
 *               deadline: "2025-12-31T23:59:59.000Z"
 *               completed: false
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *               updatedAt: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example:
 *               error: "Validation failed"
 *               details:
 *                 - field: "title"
 *                   message: "Title is required"
 *                 - field: "category"
 *                   message: "Category must be one of: Work, Personal, Shopping, Health, Education, Other"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", validate(createTaskSchema), taskController.createTask);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks with optional filtering and sorting
 *     description: Retrieve all tasks with optional filtering by category, priority, completion status, and deadline range. Results can be sorted by various fields.
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Work, Personal, Shopping, Health, Education, Other]
 *         description: Filter tasks by category
 *         example: "Work"
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [Low, Medium, High]
 *         description: Filter tasks by priority level
 *         example: "High"
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Filter tasks by completion status
 *         example: false
 *       - in: query
 *         name: deadlineFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tasks with deadline from this date (inclusive)
 *         example: "2024-01-01"
 *       - in: query
 *         name: deadlineTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tasks with deadline until this date (inclusive)
 *         example: "2024-12-31"
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, deadline, priority, title]
 *         description: Field to sort by
 *         example: "deadline"
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending)
 *         example: "asc"
 *         default: "desc"
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *             example:
 *               - _id: "60d0fe4f5311236168a109ca"
 *                 title: "Complete project proposal"
 *                 description: "Write a comprehensive project proposal for the new client"
 *                 category: "Work"
 *                 priority: "High"
 *                 deadline: "2025-12-31T23:59:59.000Z"
 *                 completed: false
 *                 createdAt: "2024-01-15T10:30:00.000Z"
 *                 updatedAt: "2024-01-15T10:30:00.000Z"
 *               - _id: "60d0fe4f5311236168a109cb"
 *                 title: "Buy groceries"
 *                 description: "Weekly grocery shopping"
 *                 category: "Shopping"
 *                 priority: "Medium"
 *                 deadline: "2025-01-20T18:00:00.000Z"
 *                 completed: true
 *                 createdAt: "2024-01-14T09:15:00.000Z"
 *                 updatedAt: "2024-01-16T14:20:00.000Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", taskController.getTasks);

/**
 * @swagger
 * /tasks/stats:
 *   get:
 *     summary: Get task statistics
 *     description: Retrieve statistical information about tasks including total count, completion status, and distribution by category and priority
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Task statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskStats'
 *             example:
 *               total: 25
 *               completed: 10
 *               pending: 15
 *               overdue: 3
 *               byCategory:
 *                 Work: 10
 *                 Personal: 8
 *                 Shopping: 4
 *                 Health: 2
 *                 Education: 1
 *               byPriority:
 *                 High: 5
 *                 Medium: 12
 *                 Low: 8
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/stats", taskController.getTaskStats);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a specific task by ID
 *     description: Retrieve a single task by its unique identifier
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the task
 *         example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *             example:
 *               _id: "60d0fe4f5311236168a109ca"
 *               title: "Complete project proposal"
 *               description: "Write a comprehensive project proposal for the new client"
 *               category: "Work"
 *               priority: "High"
 *               deadline: "2025-12-31T23:59:59.000Z"
 *               completed: false
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *               updatedAt: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Invalid task ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Invalid ID format"
 *               message: "Task ID must be a valid MongoDB ObjectId"
 *               status: 400
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Task not found"
 *               message: "No task found with the provided ID"
 *               status: 404
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", taskController.getTaskById);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     description: Update an existing task with new information. All fields are optional.
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the task to update
 *         example: "60d0fe4f5311236168a109ca"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskRequest'
 *           examples:
 *             updateTitle:
 *               summary: Update only title
 *               value:
 *                 title: "Updated project proposal"
 *             markCompleted:
 *               summary: Mark task as completed
 *               value:
 *                 completed: true
 *             fullUpdate:
 *               summary: Update multiple fields
 *               value:
 *                 title: "Updated project proposal"
 *                 description: "Updated description with new requirements"
 *                 priority: "Medium"
 *                 completed: true
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *             example:
 *               _id: "60d0fe4f5311236168a109ca"
 *               title: "Updated project proposal"
 *               description: "Updated description with new requirements"
 *               category: "Work"
 *               priority: "Medium"
 *               deadline: "2025-12-31T23:59:59.000Z"
 *               completed: true
 *               createdAt: "2024-01-15T10:30:00.000Z"
 *               updatedAt: "2024-01-16T15:45:00.000Z"
 *       400:
 *         description: Validation error or invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationError'
 *                 - $ref: '#/components/schemas/Error'
 *             examples:
 *               validationError:
 *                 summary: Validation error
 *                 value:
 *                   error: "Validation failed"
 *                   details:
 *                     - field: "priority"
 *                       message: "Priority must be one of: Low, Medium, High"
 *               invalidId:
 *                 summary: Invalid ID format
 *                 value:
 *                   error: "Invalid ID format"
 *                   message: "Task ID must be a valid MongoDB ObjectId"
 *                   status: 400
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Task not found"
 *               message: "No task found with the provided ID"
 *               status: 404
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", validate(updateTaskSchema), taskController.updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Permanently delete a task by its ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the task to delete
 *         example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task deleted successfully"
 *                 deletedTask:
 *                   $ref: '#/components/schemas/Task'
 *             example:
 *               message: "Task deleted successfully"
 *               deletedTask:
 *                 _id: "60d0fe4f5311236168a109ca"
 *                 title: "Complete project proposal"
 *                 category: "Work"
 *                 priority: "High"
 *                 completed: false
 *       400:
 *         description: Invalid task ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Invalid ID format"
 *               message: "Task ID must be a valid MongoDB ObjectId"
 *               status: 400
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Task not found"
 *               message: "No task found with the provided ID"
 *               status: 404
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", taskController.deleteTask);

export default router;