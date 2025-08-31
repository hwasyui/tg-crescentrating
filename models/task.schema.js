import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    enum: ["Work", "Personal", "Shopping", "Health", "Education", "Other"],
    required: true,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    required: true,
  },
  deadline: {
    type: Date,
    default: null,
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

TaskSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

TaskSchema.set("toObject", { virtuals: true });
TaskSchema.set("toJSON", { virtuals: true });

const Task = mongoose.model("Task", TaskSchema);
export default Task;
