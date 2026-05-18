import { GoogleGenerativeAI } from '@google/generative-ai';
import AIHistory from '../models/aihistory.js';

// @desc    Get Smart Diagnosis from AI
// @route   POST /api/ai/diagnosis
// @access  Private/Doctor
export const getSmartDiagnosis = async (req, res) => {
  const { symptoms, patientData, patientId } = req.body;

  if (!symptoms) {
    return res.status(400).json({ message: 'Symptoms are required' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' }); // Using appropriate model

    const prompt = `
      You are an expert medical AI assistant.
      Patient details:
      Age: ${patientData?.age || 'Unknown'}
      Gender: ${patientData?.gender || 'Unknown'}
      Medical History: ${patientData?.medicalHistory?.join(', ') || 'None'}
      Symptoms: ${symptoms}

      Provide a structured JSON response with the following keys:
      - possibleConditions: Array of strings (possible diagnoses)
      - riskLevel: String (one of: 'Low', 'Medium', 'High', 'Critical')
      - suggestedTests: Array of strings (recommended lab tests)
      - recommendations: String (general advice/next steps for the doctor)

      Output ONLY valid JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up markdown code blocks if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const aiResponse = JSON.parse(text);

    // Save history
    const history = await AIHistory.create({
      doctorId: req.user._id,
      patientId: patientId || null,
      symptoms,
      patientData,
      aiResponse,
    });

    res.json({ diagnosis: aiResponse, historyId: history._id });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ message: 'Failed to generate diagnosis' });
  }
};
