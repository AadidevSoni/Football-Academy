import express from 'express';
import {
  createPlayer,
  getAllPlayers,
  updateMonthlyPayment,
  loginAdmin,
  logoutCurrentUser,
} from '../controllers/playerController.js';

import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin login/logout
router.post('/login', loginAdmin);
router.post('/logout', logoutCurrentUser);

// Admin-protected routes
router.route('/players')
  .post(authenticate, createPlayer)      // Add player
  .get(authenticate, getAllPlayers);     // View all players

router.put('/players/:playerId/payment', authenticate, updateMonthlyPayment);

export default router;