const path = require('path');
const Document = require('../models/Document');

// ✅ Upload signed document
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newDoc = new Document({
      fileName: req.file.originalname,
      filePath: req.file.path,
      user: req.user.id,
    });

    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

// ✅ Get all user documents
const getUserDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching documents', error: err.message });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    res.download(path.resolve(doc.filePath)); 
  } catch (err) {
    res.status(500).json({ message: 'Download failed', error: err.message });
  }
};

module.exports = {
  uploadDocument,
  getUserDocuments,
  downloadDocument
};
