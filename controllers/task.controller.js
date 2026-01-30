import Task from "../models/Task.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

const formatTask = (t) => ({
  _id: t._id,
  title: t.title,
  description: t.description || "",
  status: t.status,
  priority: t.priority,
  projectId: t.project ? t.project._id : null,
  projectName: t.project ? t.project.name : "",
  assignedToId: t.assignedTo ? t.assignedTo._id : null,
  assignedTo: t.assignedTo ? t.assignedTo.username : "",
  dueDate: t.dueDate,
  estimatedHours: t.estimatedHours || 0
});

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("project", "_id name")
      .populate("assignedTo", "_id username");

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
      .populate("project", "_id name")
      .populate("assignedTo", "_id username");

    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    res.json(formatTask(task));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la tarea" });
  }
};


export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, estimatedHours, project } = req.body;

    if (!title) return res.status(400).json({ message: "Título obligatorio" });

    // Buscar el usuario admin (sin validación de error)
    let adminUser = await User.findOne({ username: "admin" });
    
    // Si no existe, crear un usuario admin vacío (solo para que tenga un ID)
    if (!adminUser) {
      adminUser = new User({
        username: "admin",
        password: "admin",
        role: "admin"
      });
      await adminUser.save();
    }

    const task = new Task({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      estimatedHours: estimatedHours || 0,
      project: project || null,
      assignedTo: adminUser._id
    });

    await task.save();
    
    // Poblar antes de responder
    await task.populate("project", "_id name");
    await task.populate("assignedTo", "_id username");

    res.status(201).json(formatTask(task));
  } catch (error) {
    console.error("ERROR CREATE TASK:", error);
    res.status(500).json({ message: "Error al crear la tarea: " + error.message });
  }
};
export const updateTask = async (req, res) => {
  try {
    // Buscar el usuario admin
    let adminUser = await User.findOne({ username: "admin" });
    
    // Si no existe, crear un usuario admin vacío
    if (!adminUser) {
      adminUser = new User({
        username: "admin",
        password: "admin",
        role: "admin"
      });
      await adminUser.save();
    }

    // Asegurarse de que assignedTo siempre sea admin
    const updateData = { ...req.body, assignedTo: adminUser._id };
    
    const task = await Task.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate("project", "_id name")
      .populate("assignedTo", "_id username");

    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    res.json(formatTask(task));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la tarea: " + error.message });
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
      .populate("project", "_id name")
      .populate("assignedTo", "_id username");

    const results = tasks.map(formatTask);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar tareas" });
  }
};
