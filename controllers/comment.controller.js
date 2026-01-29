import Comment from "../models/Comment.js";


export const getCommentsByTask = async (req, res) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId })
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener comentarios" });
  }
};


export const createComment = async (req, res) => {
  try {
    const { task, comment } = req.body;

    if (!task || !comment) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const newComment = new Comment({ task, comment });
    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear comentario" });
  }
};
