import User from "../models/User.js";

export const getUsers = async (req, res) => {
  const users = await User.find({ active: true }).select("-password");
  res.json(users);
};

export const createUser = async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
};

export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(user);
};

export const deactivateUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { active: false });
  res.json({ message: "Usuario desactivado" });
};
