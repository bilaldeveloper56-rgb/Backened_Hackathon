import Appointment from '../models/appointment.js';
import Patient from '../models/patient.js';
import Prescription from '../models/prescription.js';
import User from '../models/user.js';
import { generatePrescriptionPDF } from '../utils/generatePDF.js';

// @desc    Get doctor's appointments
// @route   GET /api/doctor/appointments
// @access  Private/Doctor
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user._id })
      .populate('patientId', 'name age gender contact bloodGroup medicalHistory')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
};

// @desc    Get doctor's patients (unique patients with appointments)
// @route   GET /api/doctor/patients
// @access  Private/Doctor
export const getPatients = async (req, res) => {
  try {
    const patientIds = await Appointment.find({ doctorId: req.user._id }).distinct('patientId');
    const patients = await Patient.find({ _id: { $in: patientIds } });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients' });
  }
};

// @desc    Add prescription
// @route   POST /api/doctor/prescription
// @access  Private/Doctor
export const addPrescription = async (req, res) => {
  const { patientId, appointmentId, medicines, instructions } = req.body;
  try {
    const prescription = await Prescription.create({
      doctorId: req.user._id,
      patientId,
      appointmentId,
      medicines,
      instructions,
    });

    // Mark appointment as completed
    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, { status: 'Completed' });
    }

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating prescription' });
  }
};

// @desc    Download prescription PDF
// @route   GET /api/doctor/prescription/:id/pdf
// @access  Private/Doctor
export const downloadPrescriptionPDF = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });

    const patient = await Patient.findById(prescription.patientId);
    const doctor = await User.findById(prescription.doctorId).select('name email');

    generatePrescriptionPDF(prescription, patient, doctor, res);
  } catch (error) {
    res.status(500).json({ message: 'Error generating PDF' });
  }
};

// @desc    Get all prescriptions by doctor
// @route   GET /api/doctor/prescriptions
// @access  Private/Doctor
export const getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctorId: req.user._id })
      .populate('patientId', 'name age gender')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions' });
  }
};
