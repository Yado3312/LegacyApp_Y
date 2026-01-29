import User from "../models/User.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, active: true });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  res.json({
    message: "Login exitoso",
    user: {
      id: user._id,
      username: user.username,
      role: user.role
    }
  });
};

export const logout = (req, res) => {
  res.json({ message: "Logout exitoso" });
};
