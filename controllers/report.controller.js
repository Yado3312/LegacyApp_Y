import Task from "../models/Task.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

export const taskReport = async (req, res) => {
  const total = await Task.countDocuments();
  const completed = await Task.countDocuments({ status: "Completada" });

  res.json({
    totalTasks: total,
    completedTasks: completed,
    pendingTasks: total - completed
  });
};

export const projectReport = async (req, res) => {
  const projects = await Project.find().countDocuments();
  res.json({ totalProjects: projects });
};

export const userReport = async (req, res) => {
  const users = await User.find({ active: true }).countDocuments();
  res.json({ activeUsers: users });
};
