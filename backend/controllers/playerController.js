import Player from '../models/playerModel.js';
import Admin from '../models/adminModel.js';
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const createToken = (res, adminId) => {
  const token = jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// Admin login
export const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  console.log('LOGIN ATTEMPT →', username);

  const admin = await Admin.findOne({ username });
  if (!admin) {
    console.log('Admin not found');
    res.status(401);
    throw new Error("Invalid username or password");
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    console.log('Password incorrect');
    res.status(401);
    throw new Error("Invalid username or password");
  }

  createToken(res, admin._id);
  console.log('Login success');
  res.status(200).json({ message: "Logged in successfully" });
});

export const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

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

export const getAllPlayers = asyncHandler(async (req, res) => {
  const players = await Player.find();
  res.json(players);
});

// controllers/playerController.js

export const updatePlayerById = asyncHandler(async (req, res) => {
  const player = await Player.findById(req.params.id);

  if (!player) {
    res.status(404);
    throw new Error('Player not found');
  }

  const { playerId, name, email, phone, fees, paymentStatus } = req.body;

  // ✅ Update playerId (if not conflicting with existing ones)
  if (playerId && playerId !== player.playerId) {
    const existing = await Player.findOne({ playerId });
    if (existing && existing._id.toString() !== player._id.toString()) {
      res.status(400);
      throw new Error('Player ID already exists');
    }
    player.playerId = playerId;
  }

  player.name = name || player.name;
  player.email = email || player.email;
  player.phone = phone || player.phone;
  player.fees = fees || player.fees;

  if (paymentStatus && typeof paymentStatus === 'object') {
    const months = Object.keys(player.paymentStatus);
    months.forEach(month => {
      if (paymentStatus.hasOwnProperty(month)) {
        player.paymentStatus[month] = paymentStatus[month];
      }
    });
  }

  const updatedPlayer = await player.save();
  res.json(updatedPlayer);
});

export const deletePlayerById = asyncHandler(async (req, res) => {
  const player = await Player.findById(req.params.id);

  if (!player) {
    res.status(404);
    throw new Error('Player not found');
  }

  await player.deleteOne();
  res.status(200).json({ message: 'Player deleted successfully' });
});

export const getPlayerById = asyncHandler(async (req, res) => {
  const player = await Player.findById(req.params.id);

  if (!player) {
    res.status(404);
    throw new Error('Player not found');
  }

  res.status(200).json(player);
});