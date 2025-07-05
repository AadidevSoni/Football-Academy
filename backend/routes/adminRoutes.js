import express from 'express';
import {createPlayer,getAllPlayers,updateMonthlyPayment,loginAdmin,logoutCurrentUser,updatePlayer
} from '../controllers/playerController.js';

import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/auth', loginAdmin);
router.post('/logout', logoutCurrentUser);

router.route('/players')
  .post(authenticate, createPlayer)     
  .get(authenticate, getAllPlayers);     

router.put('/players/:playerId/payment', authenticate, updateMonthlyPayment);

router.put('/players/:id', authenticate, updatePlayer);

export default router;