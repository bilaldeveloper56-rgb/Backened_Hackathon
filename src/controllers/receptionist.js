import Patient from '../models/patient.js';
import Appointment from '../models/appointment.js';
import User from '../models/user.js';

// @desc    Register a new patient
// @route   POST /api/receptionist/patients
// @access  Private/Receptionist
export const registerPatient = async (req, res) => {
  const { name, age, gender, contact, bloodGroup, medicalHistory } = req.body;
  try {
    const patient = await Patient.create({
      name,
      age,
      gender,
      contact,
      bloodGroup,
      medicalHistory: medicalHistory || [],
      createdBy: req.user._id,
    });
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error registering patient' });
  }
};

// @desc    Book an appointment
// @route   POST /api/receptionist/appointments
// @access  Private/Receptionist
export const bookAppointment = async (req, res) => {
  const { patientId, doctorId, date, timeSlot, reason } = req.body;
  try {
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      timeSlot,
      reason,
      status: 'Scheduled',
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error booking appointment' });
  }
};

// @desc    Get all appointments (for receptionist)
// @route   GET /api/receptionist/appointments
// @access  Private/Receptionist
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('patientId', 'name age gender contact')
      .populate('doctorId', 'name email');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
};

// @desc    Get all patients
// @route   GET /api/receptionist/patients
// @access  Private/Receptionist
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({}).sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients' });
  }
};

// @desc    Get all doctors
// @route   GET /api/receptionist/doctors
// @access  Private/Receptionist
export const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'Doctor' }).select('name email _id subscriptionPlan');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors' });
  }
};
