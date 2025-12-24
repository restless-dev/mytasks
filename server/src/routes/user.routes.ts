import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import {
  deleteUser,
  getAllUsers,
  updateUser,
} from '../controllers/user.controller.js';

const router = Router();

router.get('/', getAllUsers);

router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

export default router;
