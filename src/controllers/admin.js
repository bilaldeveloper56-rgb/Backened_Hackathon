import User from '../models/user.js';
import Appointment from '../models/appointment.js';
import Patient from '../models/patient.js';
import AIHistory from '../models/aihistory.js';

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getDashboardAnalytics = async (req, res) => {
  try {
    const totalDoctors = await User.countDocuments({ role: 'Doctor' });
    const totalPatients = await Patient.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const totalAIUses = await AIHistory.countDocuments();
    const completedAppointments = await Appointment.countDocuments({ status: 'Completed' });
    const totalRevenue = completedAppointments * 50; // $50 simulated per completed appointment

    const monthlyAppointments = await Appointment.aggregate([
      {
        $group: {
          _id: { $month: '$date' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalDoctors,
      totalPatients,
      totalAppointments,
      totalAIUses,
      totalRevenue,
      monthlyAppointments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// @desc    Update user subscription
// @route   PUT /api/admin/users/:id/subscription
// @access  Private/Admin
export const updateSubscription = async (req, res) => {
  const { subscriptionPlan } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { subscriptionPlan },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating subscription' });
  }
};
