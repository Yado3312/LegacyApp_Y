import Task from "../models/Task.js";
import Project from "../models/Project.js";

const formatTask = (t) => ({
  _id: t._id,
  title: t.title,
  description: t.description || "",
  status: t.status,
  priority: t.priority,
  projectName: t.project ? t.project.name : "",
  assignedTo: t.assignedTo ? t.assignedTo.username : "",
  dueDate: t.dueDate,
  estimatedHours: t.estimatedHours || 0
});

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("project", "name")
      .populate("assignedTo", "username");

    const formatted = tasks.map(formatTask);
    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener tareas" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "name")
      .populate("assignedTo", "username");

    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    res.json(formatTask(task));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la tarea" });
  }
};

export const createTask = async (req, res) => {
  try {
    if (!req.body.project) req.body.project = null;

    const task = new Task(req.body);
    await task.save();

    await task.populate("project", "name").populate("assignedTo", "username");
    res.status(201).json(formatTask(task));
  } catch (error) {
    console.error("Error en createTask:", error.message);
    res.status(500).json({ message: "Error al crear la tarea" });
  }
};


export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("project", "name")
      .populate("assignedTo", "username");

    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    res.json(formatTask(task));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la tarea" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    res.json({ message: "Tarea eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la tarea" });
  }
};

export const searchTasks = async (req, res) => {
  try {
    const { text, status, priority, project } = req.query;

    const filter = {};

    if (text) {
      filter.$or = [
        { title: { $regex: text, $options: "i" } },
        { description: { $regex: text, $options: "i" } }
      ];
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (project) filter.project = project;

    const tasks = await Task.find(filter)
      .populate("project", "name")
      .populate("assignedTo", "username");

    const results = tasks.map(formatTask);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar tareas" });
  }
};
