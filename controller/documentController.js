const Document = require('../models/documentModel');
const cloudinary = require('cloudinary').v2;

const uploadDocument = async (req, res) => {
  try {
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "auto" });

    // Create new document
    const document = new Document({
      fileName: req.file.originalname,
      fileUrl: result.secure_url,
      public_id: result.public_id,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      user: req.user._id // Set the user ID to the logged in user's ID
    });

    // Save document to database
    await document.save();

    res.status(201).json(document);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, user: req.user._id });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete file from Cloudinary
    const public_id = document.public_id;
    await cloudinary.uploader.destroy(public_id);

    // Delete document from database
    await Document.deleteOne({ _id: req.params.id });

    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserDocuments = async (req, res) => {
  try {
    const userDocuments = await Document.find({ user: req.user._id });
    res.json(userDocuments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const https = require('https');

const downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if the logged in user is authorized to download the document
    if (!document.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'User is not authorized to download this document' });
    }

    const fileUrl = document.fileUrl;

    // Set response headers
    res.setHeader('Content-disposition', 'attachment; filename=' + document.fileName);

    // Download file from URL and pipe to response
    https.get(fileUrl, (response) => {
      response.pipe(res);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  uploadDocument, deleteDocument, getUserDocuments, downloadDocument
};
