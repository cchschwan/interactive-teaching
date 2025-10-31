import React, { useEffect, useState } from 'react';
import './Exercises.css';

function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem('authToken');
        console.log('Token:', token); // Debug log

        const baseUrl = import.meta.env.VITE_API_URL || '';
        const url = `${baseUrl}/api/exercises`;
        console.log('Fetching from:', url); // Debug log

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status); // Debug log
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw exercise data:', data); // Debug log
        
        if (!Array.isArray(data)) {
          throw new Error('Expected array of exercises but got: ' + typeof data);
        }

        setExercises(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const handleAnswerChange = (exerciseId, value) => {
    setAnswers(prev => ({
      ...prev,
      [exerciseId]: value
    }));
    // Clear feedback when answer changes
    setFeedback(prev => ({
      ...prev,
      [exerciseId]: null
    }));
  };

  const checkAnswer = async (exercise) => {
    const answer = answers[exercise.id];
    const isCorrect = exercise.solutionJson.correctAnswer === answer;
    
    setFeedback(prev => ({
      ...prev,
      [exercise.id]: {
        isCorrect,
        message: isCorrect 
          ? `Richtig! ${exercise.solutionJson.explanation}`
          : 'Leider falsch. Versuche es noch einmal!'
      }
    }));
  };

  if (loading) return <div>Loading exercises...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!exercises.length) return <div>No exercises found</div>;

  return (
    <div className="exercises-container">
      <h1>Übungen</h1>
      <div className="exercises-list">
        {exercises.map(exercise => (
          <div key={exercise.id} className="exercise-card">
            <h2>{exercise.title}</h2>
            <p className="topic">{exercise.topic}</p>
            
            <div className="question-section">
              <h3>Frage:</h3>
              <p className="question-text">{exercise.questionJson.question}</p>
              
              {exercise.questionJson.type === 'multiple-choice' ? (
                <div className="options-list">
                  {exercise.questionJson.options.map((option, index) => (
                    <label key={index} className="option-item">
                      <div className="option-content">
                        <input
                          type="radio"
                          name={`exercise-${exercise.id}`}
                          value={option}
                          checked={answers[exercise.id] === option}
                          onChange={(e) => handleAnswerChange(exercise.id, e.target.value)}
                        />
                        <span className="option-text">{option}</span>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  className="text-input"
                  value={answers[exercise.id] || ''}
                  onChange={(e) => handleAnswerChange(exercise.id, e.target.value)}
                  placeholder="Deine Antwort..."
                />
              )}

              <button 
                className="check-button"
                onClick={() => checkAnswer(exercise)}
                disabled={!answers[exercise.id]}
              >
                Antwort prüfen
              </button>

              {feedback[exercise.id] && (
                <div className={`feedback ${feedback[exercise.id].isCorrect ? 'correct' : 'incorrect'}`}>
                  {feedback[exercise.id].message}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Exercises;