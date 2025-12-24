import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from '../controllers/task.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
