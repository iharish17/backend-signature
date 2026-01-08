const express = require("express");
const router = express.Router();

const {
  uploadDocument,
  getUserDocuments,
  downloadDocument
} = require("../controllers/documentController");

const auth = require("../middleware/auth");
const upload = require("../utils/multerConfig");

router.post("/uploads", auth, upload.single("pdf"), uploadDocument);
router.get("/mine", auth, getUserDocuments);
router.get("/download/:id", auth, downloadDocument);

module.exports = router;
