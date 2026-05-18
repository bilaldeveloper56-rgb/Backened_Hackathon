import Appointment from '../models/appointment.js';
import Prescription from '../models/prescription.js';
import AIHistory from '../models/aihistory.js';
import Patient from '../models/patient.js';

// @desc    Get patient's appointments
// @route   GET /api/patient/appointments
// @access  Private/Patient
export const getMyAppointments = async (req, res) => {
  try {
    // Find patient profile linked to this user
    const patientProfile = await Patient.findOne({ userId: req.user._id });
    if (!patientProfile) return res.json([]); // Return empty array if no profile yet

    const appointments = await Appointment.find({ patientId: patientProfile._id })
      .populate('doctorId', 'name email')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
};

// @desc    Get patient's prescriptions
// @route   GET /api/patient/prescriptions
// @access  Private/Patient
export const getMyPrescriptions = async (req, res) => {
  try {
    const patientProfile = await Patient.findOne({ userId: req.user._id });
    if (!patientProfile) return res.json([]);

    const prescriptions = await Prescription.find({ patientId: patientProfile._id })
      .populate('doctorId', 'name email')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions' });
  }
};

// @desc    Get patient's AI history
// @route   GET /api/patient/ai-history
// @access  Private/Patient
export const getMyAIHistory = async (req, res) => {
  try {
    const patientProfile = await Patient.findOne({ userId: req.user._id });
    if (!patientProfile) return res.json([]);

    const history = await AIHistory.find({ patientId: patientProfile._id })
      .populate('doctorId', 'name')
      .sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching AI history' });
  }
};
