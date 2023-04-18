const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const https = require('https');


const cloudinary = require('cloudinary').v2;
const Document = require('../models/documentModel');
const requireAuth = require('../middleware/requireAuth');

const {uploadDocument,deleteDocument, getUserDocuments, downloadDocument} = require("../controller/documentController")

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Configure Multer storage engine
// const storage = multer.diskStorage({
//   filename: function(req, file, cb) {s
//     cb(null, file.originalname);
//   }
// });
// const upload = multer({ storage });
const upload = multer({ dest: 'uploads/' });


// Upload document
router.post('/upload', requireAuth, upload.single('document'), uploadDocument);

// Delete document for logged-in user
router.delete('/documents/:id', requireAuth, deleteDocument);


// Get documents for logged-in user
router.get('/documents', requireAuth, getUserDocuments);

// Download document
router.get('/documents/:id/download', requireAuth, downloadDocument);


module.exports = router;
