import Task from "../models/task.schema.js";

class TaskService {
  async createTask(data) {
    return await Task.create(data);
  }

  async getTasks(filter = {}, sort = {}) {
    return await Task.find(filter).sort(sort);
  }

  async getTaskById(id) {
    return await Task.findById(id);
  }

  async updateTask(id, data) {
    return await Task.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteTask(id) {
    return await Task.findByIdAndDelete(id);
  }

  async getTaskStats() {
    const now = new Date();
    
    const allTasks = await Task.find({});
    
    const total = allTasks.length;
    const completed = allTasks.filter(task => task.completed).length;
    const pending = total - completed;
    const overdue = allTasks.filter(task => 
      !task.completed && task.deadline && new Date(task.deadline) < now
    ).length;

    const byCategory = allTasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {});

    const byPriority = allTasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      completed,
      pending,
      overdue,
      byCategory,
      byPriority
    };
  }
}

export default new TaskService();