import express from 'express';
import {
  getAppointments,
  getPatients,
  addPrescription,
  getPrescriptions,
  downloadPrescriptionPDF,
} from '../controllers/doctor.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Doctor'));

router.get('/appointments', getAppointments);
router.get('/patients', getPatients);
router.post('/prescription', addPrescription);
router.get('/prescriptions', getPrescriptions);
router.get('/prescription/:id/pdf', downloadPrescriptionPDF);

export default router;
