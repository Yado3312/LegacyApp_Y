import Task from "../models/Task.js";
import Project from "../models/Project.js";

// Obtener todas las tareas
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("project", "name")
      .populate("assignedTo", "username");
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener tareas" });
  }
};

// Obtener tarea por ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "name")
      .populate("assignedTo", "username");

    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la tarea" });
  }
};

// Crear nueva tarea
export const createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la tarea" });
  }
};

// Actualizar tarea
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la tarea" });
  }
};

// Eliminar tarea
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

// Búsqueda avanzada de tareas
// GET /api/tasks/search?text=&status=&priority=&project=
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
    if (project) filter.project = project; // debe ser el _id del proyecto

    const tasks = await Task.find(filter)
      .populate("project", "name")
      .populate("assignedTo", "username");

    // Mapear para frontend
    const results = tasks.map(t => ({
      _id: t._id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      projectName: t.project ? t.project.name : "",
      assignedTo: t.assignedTo ? t.assignedTo.username : ""
    }));

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar tareas" });
  }
};
