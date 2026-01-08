const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const signRoutes = require('./routes/signRoutes');
const documentRoutes = require("./routes/documentRoutes");

const app = express();

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));
app.use('/api', signRoutes);
app.use('/api/auth', require('./routes/authRoutes'));
app.use("/api/documents", documentRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () =>
      console.log("MongoDB Connected & Server running on port 5000")
    );
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
