import express from 'express';
import {
  getDashboardAnalytics,
  getUsers,
  deleteUser,
  updateSubscription,
} from '../controllers/admin.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Admin'));

router.get('/analytics', getDashboardAnalytics);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/subscription', updateSubscription);

export default router;
