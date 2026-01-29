import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.params.userId })
    .sort({ createdAt: -1 });

  res.json(notifications);
};

export const markAsRead = async (req, res) => {
  await Notification.updateMany(
    { user: req.params.userId, read: false },
    { read: true }
  );

  res.json({ message: "Notificaciones marcadas como leídas" });
};
