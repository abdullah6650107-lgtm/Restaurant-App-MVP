const jwt = require("jsonwebtoken");
const User = require("../models/User");

function generateToken(user) {
  return jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET || "development-secret", {
    expiresIn: "1d",
  });
}

function safeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long." });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "Email already registered." });
    }

    const user = await User.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      password,
      role: "customer",
    });

    const token = generateToken(user);

    return res.status(201).json({
      token,
      user: safeUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(String(password));
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = generateToken(user);

    return res.json({
      token,
      user: safeUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

async function profile(req, res) {
  return res.json({ user: safeUser(req.user) });
}

async function logout(req, res) {
  return res.json({ success: true, message: "Logged out." });
}

module.exports = { register, login, profile, logout };
