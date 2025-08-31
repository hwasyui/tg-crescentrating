import taskService from "../services/task.service.js";

class TaskController {
  async createTask(req, res, next) {
    try {
      const task = await taskService.createTask(req.body);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  }

  async getTasks(req, res, next) {
    try {
      const { 
        category, 
        priority, 
        completed, 
        sortBy, 
        sortOrder = 'desc',
        deadlineFrom, 
        deadlineTo 
      } = req.query;

      const filter = {};
      const sort = {};

      if (category) filter.category = category;
      if (priority) filter.priority = priority;
      if (completed !== undefined) filter.completed = completed === 'true';
      
      if (deadlineFrom || deadlineTo) {
        filter.deadline = {};
        if (deadlineFrom) filter.deadline.$gte = new Date(deadlineFrom);
        if (deadlineTo) filter.deadline.$lte = new Date(deadlineTo);
      }
      if (sortBy) {
        const order = sortOrder === 'asc' ? 1 : -1;
        sort[sortBy] = order;
      } else {
        sort.createdAt = -1; 
      }

      const tasks = await taskService.getTasks(filter, sort);
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  }

  async getTaskById(req, res, next) {
    try {
      const { id } = req.params;
      
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ 
          error: "Invalid ID format",
          message: "Task ID must be a valid MongoDB ObjectId",
          status: 400
        });
      }

      const task = await taskService.getTaskById(id);
      if (!task) {
        return res.status(404).json({ 
          error: "Task not found",
          message: "No task found with the provided ID",
          status: 404
        });
      }
      
      res.json(task);
    } catch (err) {
      next(err);
    }
  }

  async updateTask(req, res, next) {
    try {
      const { id } = req.params;
      
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ 
          error: "Invalid ID format",
          message: "Task ID must be a valid MongoDB ObjectId",
          status: 400
        });
      }

      const task = await taskService.updateTask(id, req.body);
      if (!task) {
        return res.status(404).json({ 
          error: "Task not found",
          message: "No task found with the provided ID",
          status: 404
        });
      }
      
      res.json(task);
    } catch (err) {
      next(err);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const { id } = req.params;
      
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ 
          error: "Invalid ID format",
          message: "Task ID must be a valid MongoDB ObjectId",
          status: 400
        });
      }

      const task = await taskService.deleteTask(id);
      if (!task) {
        return res.status(404).json({ 
          error: "Task not found",
          message: "No task found with the provided ID",
          status: 404
        });
      }
      
      res.json({ 
        message: "Task deleted successfully",
        deletedTask: {
          _id: task._id,
          title: task.title,
          category: task.category,
          priority: task.priority,
          completed: task.completed
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async getTaskStats(req, res, next) {
    try {
      const stats = await taskService.getTaskStats();
      res.json(stats);
    } catch (err) {
      next(err);
    }
  }
}

export default new TaskController();