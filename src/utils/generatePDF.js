import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePrescriptionPDF = (prescription, patient, doctor, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-disposition', `attachment; filename=prescription-${prescription._id}.pdf`);
  res.setHeader('Content-type', 'application/pdf');

  doc.pipe(res);

  // Header
  doc
    .fillColor('#444444')
    .fontSize(20)
    .text('Smart Clinic SaaS', 50, 57)
    .fontSize(10)
    .text('123 Medical Center Drive', 200, 50, { align: 'right' })
    .text('New York, NY, 10025', 200, 65, { align: 'right' })
    .moveDown();

  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, 90).lineTo(550, 90).stroke();

  // Doctor Info
  doc
    .fillColor('#000000')
    .fontSize(12)
    .text(`Doctor: Dr. ${doctor.name}`, 50, 110)
    .text(`Email: ${doctor.email}`, 50, 125);

  // Patient Info
  doc
    .text(`Patient: ${patient.name}`, 350, 110)
    .text(`Age: ${patient.age} | Gender: ${patient.gender}`, 350, 125)
    .text(`Date: ${new Date(prescription.createdAt).toLocaleDateString()}`, 350, 140)
    .moveDown();

  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, 160).lineTo(550, 160).stroke();

  // Medicines Table Header
  doc.fontSize(14).text('Prescription Details', 50, 180).moveDown();
  
  let y = 210;
  doc.fontSize(10).font('Helvetica-Bold');
  doc.text('Medicine', 50, y);
  doc.text('Dosage', 250, y);
  doc.text('Frequency', 350, y);
  doc.text('Duration', 450, y);
  
  doc.strokeColor('#dddddd').lineWidth(1).moveTo(50, y + 15).lineTo(550, y + 15).stroke();

  // Medicines List
  doc.font('Helvetica');
  y += 25;
  prescription.medicines.forEach(med => {
    doc.text(med.name, 50, y);
    doc.text(med.dosage, 250, y);
    doc.text(med.frequency, 350, y);
    doc.text(med.duration, 450, y);
    y += 20;
  });

  doc.moveDown(2);
  
  // Instructions
  doc.font('Helvetica-Bold').text('Instructions:', 50, y + 20);
  doc.font('Helvetica').text(prescription.instructions || 'None', 50, y + 35);

  // Footer
  doc.fontSize(10).text(
    'This is an AI generated prescription. Please consult your doctor for further verification.',
    50,
    700,
    { align: 'center', width: 500 }
  );

  doc.end();
};
