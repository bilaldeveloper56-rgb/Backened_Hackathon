import express from 'express';
import {
  registerPatient,
  bookAppointment,
  getAllAppointments,
  getAllPatients,
  getDoctors,
} from '../controllers/receptionist.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Receptionist', 'Admin'));

router.get('/patients', getAllPatients);
router.post('/patients', registerPatient);
router.get('/appointments', getAllAppointments);
router.post('/appointments', bookAppointment);
router.get('/doctors', getDoctors);

export default router;
