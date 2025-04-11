// models/PDFReport.js
import mongoose from 'mongoose';

const PDFReportSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: [true, 'Patient ID is required']
  },
  fileName: {
    type: String,
    required: [true, 'File name is required']
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required']
  },
  downloadUrl: {
    type: String,
    required: [true, 'Download URL is required']
  },
  reportType: {
    type: String,
    enum: ['lab', 'diagnosis', 'prescription', 'other'],
    default: 'other'
  },
  uploadedBy: {
    type: String
  }
}, { timestamps: true });

export default mongoose.models.PDFReport || mongoose.model('PDFReport', PDFReportSchema);