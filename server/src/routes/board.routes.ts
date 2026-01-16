import { Router } from 'express';
import {
  createBoard,
  deleteBoard,
  getBoards,
  updateBoard,
} from '../controllers/board.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getBoards);
router.post('/', createBoard);
router.put('/:id', updateBoard);
router.delete('/:id', deleteBoard);

export default router;
