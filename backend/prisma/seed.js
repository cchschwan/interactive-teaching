const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


async function main() {
  console.log('Starte Datenbank-Befüllung...');

  // 1. Studenten erstellen
  const student1 = await prisma.student.create({
    data: {
      qrCodeIdentifier: 'QR-2024-001',
      className: 'Klasse 10A',
    },
  });

  const student2 = await prisma.student.create({
    data: {
      qrCodeIdentifier: 'QR-2024-002',
      className: 'Klasse 10A',
    },
  });

  const student3 = await prisma.student.create({
    data: {
      qrCodeIdentifier: 'QR-2024-003',
      className: 'Klasse 10B',
    },
  });

  console.log('✅ Studenten erstellt:', student1.id, student2.id, student3.id);

  // 2. Übungen erstellen
  const exercise1 = await prisma.exercise.create({
    data: {
      title: 'Grundrechenarten - Addition',
      topic: 'Mathematik',
      questionJson: {
        type: 'multiple-choice',
        question: 'Was ist 15 + 27?',
        options: ['40', '42', '45', '52'],
      },
      solutionJson: {
        correctAnswer: '42',
        explanation: '15 + 27 = 42',
      },
    },
  });

  const exercise2 = await prisma.exercise.create({
    data: {
      title: 'Deutsche Grammatik - Artikel',
      topic: 'Deutsch',
      questionJson: {
        type: 'fill-in-blank',
        question: 'Ergänze den Artikel: ___ Sonne scheint.',
        blanks: ['Die'],
      },
      solutionJson: {
        correctAnswer: 'Die',
        explanation: 'Die Sonne ist feminin (die)',
      },
    },
  });

  const exercise3 = await prisma.exercise.create({
    data: {
      title: 'Englisch Vokabeln - Farben',
      topic: 'Englisch',
      questionJson: {
        type: 'translation',
        question: 'Übersetze: Blau',
        language: 'de-en',
      },
      solutionJson: {
        correctAnswer: 'blue',
        alternatives: ['Blue'],
      },
    },
  });

  console.log('✅ Übungen erstellt:', exercise1.id, exercise2.id, exercise3.id);

  // 3. Ergebnisse erstellen (Beispiel-Submissions)
  await prisma.result.create({
    data: {
      studentId: student1.id,
      exerciseId: exercise1.id,
      submittedAnswerJson: {
        answer: '42',
      },
      score: 10.0,
      feedbackText: 'Perfekt! Richtige Antwort.',
      durationSeconds: 45,
    },
  });

  await prisma.result.create({
    data: {
      studentId: student1.id,
      exerciseId: exercise2.id,
      submittedAnswerJson: {
        answer: 'Die',
      },
      score: 10.0,
      feedbackText: 'Sehr gut!',
      durationSeconds: 30,
    },
  });

  await prisma.result.create({
    data: {
      studentId: student2.id,
      exerciseId: exercise1.id,
      submittedAnswerJson: {
        answer: '40',
      },
      score: 0.0,
      feedbackText: 'Leider falsch. Die richtige Antwort ist 42.',
      durationSeconds: 60,
    },
  });

  await prisma.result.create({
    data: {
      studentId: student3.id,
      exerciseId: exercise3.id,
      submittedAnswerJson: {
        answer: 'blue',
      },
      score: 10.0,
      feedbackText: 'Ausgezeichnet!',
      durationSeconds: 25,
    },
  });

  console.log('✅ Ergebnisse erstellt');
  console.log('🎉 Datenbank erfolgreich befüllt!');
}

main()
  .catch((e) => {
    console.error('❌ Fehler beim Befüllen:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });