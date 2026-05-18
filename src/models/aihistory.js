import mongoose from 'mongoose';

const aiHistorySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
  },
  symptoms: {
    type: String,
    required: true,
  },
  patientData: {
    age: Number,
    gender: String,
    medicalHistory: [String],
  },
  aiResponse: {
    possibleConditions: [String],
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
    },
    suggestedTests: [String],
    recommendations: String,
  },
}, {
  timestamps: true,
});

const AIHistory = mongoose.model('AIHistory', aiHistorySchema);
export default AIHistory;
