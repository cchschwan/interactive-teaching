const express = require('express');
const app = express();
const { PrismaClient } = require('@prisma/client');

// Umgebungsvariablen laden (optional, aber nützlich für lokale Entwicklung)
require('dotenv').config();

// Prisma Client initialisieren
const prisma = new PrismaClient();

// Render stellt den Port als Umgebungsvariable bereit
const PORT = process.env.PORT || 3001; 

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
    // Gibt einen Fehler aus, wenn die Datenbank noch nicht migriert ist
    console.error("Database query failed:", error.message); 
    res.status(500).json({ error: "Could not fetch exercises. Is the database migrated?" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});