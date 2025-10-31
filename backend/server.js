const express = require('express');
const app = express();
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

// Umgebungsvariablen laden (optional, aber nützlich für lokale Entwicklung)
require('dotenv').config();

// Prisma Client initialisieren
const prisma = new PrismaClient();

// Render stellt den Port als Umgebungsvariable bereit
const PORT = process.env.PORT || 3001; 
// Add CORS before other middleware
app.use(cors());
app.use(express.json()); // Für das Parsen von JSON-Anfragen

// Einfacher Test-Endpunkt
app.get('/api/status', (req, res) => {
  res.json({ message: "API is running!", environment: process.env.NODE_ENV });
});

// Beispiel-Endpunkt: Ruft alle Übungen ab (funktioniert erst nach Prisma Migration!)
app.get('/api/exercises', async (req, res) => {
  try {
    const exercises = await prisma.exercise.findMany();
    res.json(exercises);
  } catch (error) {
    console.error('Failed to fetch exercises:', error);
    res.status(500).json({ error: 'Could not fetch exercises' });
  }
});

// Add JWT secret to your environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Add login endpoint
app.post('/api/login', async (req, res) => {
  console.log('Login request received:', req.body); // Debug log

  const { qrCodeIdentifier } = req.body;

  if (!qrCodeIdentifier) {
    console.log('Missing qrCodeIdentifier'); // Debug log
    return res.status(400).json({ message: 'QR-Code Identifikator fehlt' });
  }

  try {
    const student = await prisma.student.findUnique({
      where: { qrCodeIdentifier },
    });

    console.log('Found student:', student); // Debug log

    if (!student) {
      return res.status(401).json({ message: 'Ungültiger QR-Code' });
    }

    const token = jwt.sign(
      { studentId: student.id },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '8h' }
    );

    return res.json({
      token,
      studentId: student.id,
      message: 'Login erfolgreich'
    });
  } catch (error) {
    console.error('Server error:', error); // Debug log
    return res.status(500).json({ message: 'Server-Fehler beim Login' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});