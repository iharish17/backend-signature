const Document = require("../models/Document");
const path = require("path");

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { filename, path: filePath } = req.file;

    const document = new Document({
      user: req.user.id,
      filename,
      filePath
    });

    await document.save();

    res.status(201).json({ message: "Document uploaded successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.download(path.resolve(doc.filePath));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  uploadDocument,
  getUserDocuments,
  downloadDocument
};
