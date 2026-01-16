import { Router } from 'express';
import {
  createColumn,
  deleteColumn,
  updateColumn,
} from '../controllers/column.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.post('/', createColumn);
router.put('/:id', updateColumn);
router.delete('/:id', deleteColumn);

export default router;
