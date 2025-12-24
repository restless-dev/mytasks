import { Router } from 'express';
import { login, signin } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', login);
router.post('/signin', signin);

export default router;
