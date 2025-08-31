import Joi from "joi";

export const createTaskSchema = Joi.object({
  title: Joi.string().min(1).required(),
  description: Joi.string().allow(""),
  category: Joi.string().valid("Work", "Personal", "Shopping", "Health", "Education", "Other").required(),
  priority: Joi.string().valid("Low", "Medium", "High").required(),
  deadline: Joi.date().greater("now").allow(null),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(1),
  description: Joi.string().allow(""),
  category: Joi.string().valid("Work", "Personal", "Shopping", "Health", "Education", "Other"),
  priority: Joi.string().valid("Low", "Medium", "High"),
  deadline: Joi.date().greater("now").allow(null),
  completed: Joi.boolean(),
});
