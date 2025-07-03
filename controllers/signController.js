const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const Document = require('../models/Document');

exports.signDocument = async (req, res) => {
  try {
    const { docId } = req.params;
    const doc = await Document.findById(docId);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const pdfBytes = fs.readFileSync(doc.filePath);
    const signatureBytes = fs.readFileSync(doc.signatureImagePath);
    const ext = path.extname(doc.signatureImagePath).toLowerCase().replace('.', ''); // 'png' or 'jpg'

    const pdfDoc = await PDFDocument.load(pdfBytes);
    let signatureImage;

    if (ext === 'png') {
      signatureImage = await pdfDoc.embedPng(signatureBytes);
    } else {
      signatureImage = await pdfDoc.embedJpg(signatureBytes);
    }

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    firstPage.drawImage(signatureImage, {
      x: width - 150,
      y: 50,
      width: 120,
      height: 50,
    });

    const signedPdfBytes = await pdfDoc.save();
    const outputPath = `uploads/signed-${Date.now()}.pdf`;
    fs.writeFileSync(outputPath, signedPdfBytes);

    res.download(outputPath, 'signed-document.pdf', () => {
      fs.unlinkSync(outputPath); 
    });
  } catch (err) {
    console.error('Signing error:', err);
    res.status(500).json({ message: 'Failed to sign PDF' });
  }
};
