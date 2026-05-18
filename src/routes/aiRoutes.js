import express from 'express';
import { getSmartDiagnosis } from '../controllers/ai.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/diagnosis', protect, authorize('Doctor'), getSmartDiagnosis);

export default router;
