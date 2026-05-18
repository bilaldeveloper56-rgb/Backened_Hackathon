import express from 'express';
import { getMyAppointments, getMyPrescriptions, getMyAIHistory } from '../controllers/patient.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Patient'));

router.get('/appointments', getMyAppointments);
router.get('/prescriptions', getMyPrescriptions);
router.get('/ai-history', getMyAIHistory);

export default router;
