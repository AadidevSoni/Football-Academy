import Player from '../models/playerModel.js';
import Admin from '../models/adminModel.js';
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Utility to create JWT token and send in cookie
const createToken = (res, adminId) => {
  const token = jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// Admin login
export const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (admin && (await bcrypt.compare(password, admin.password))) {
    createToken(res, admin._id);
    res.status(200).json({ message: "Logged in successfully" });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});

// Admin logout
export const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// Add new player (admin-only)
export const createPlayer = asyncHandler(async (req, res) => {
  const { playerId, name, email, phone, fees } = req.body;
  const existing = await Player.findOne({ playerId });
  if (existing) {
    res.status(400);
    throw new Error('Player ID already exists');
  }
  const player = await Player.create({ playerId, name, email, phone, fees });
  res.status(201).json(player);
});

// Get all players
export const getAllPlayers = asyncHandler(async (req, res) => {
  const players = await Player.find();
  res.json(players);
});

// Update monthly payment status
export const updateMonthlyPayment = asyncHandler(async (req, res) => {
  const { month, status } = req.body;
  const player = await Player.findOne({ playerId: req.params.playerId }); 
  if (!player) {
    res.status(404);
    throw new Error('Player not found');
  }
  player.paymentStatus[month] = status;
  await player.save();
  res.json(player);
});

