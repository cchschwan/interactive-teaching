import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Exercises.css';

function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/');
          return;
        }

        const baseUrl = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${baseUrl}/api/exercises`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received exercises:', data);
        setExercises(data);
      } catch (err) {
        console.error('Failed to fetch exercises:', err);
        setError('Fehler beim Laden der Übungen: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [navigate]);

  if (loading) return <div>Lade Übungen...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!exercises.length) return <div>Keine Übungen verfügbar.</div>;

  return (
    <div className="exercises-container">
      <h1>Verfügbare Übungen</h1>
      <div className="exercises-list">
        {exercises.map(exercise => (
          <div key={exercise.id} className="exercise-card">
            <h2>{exercise.title}</h2>
            <p className="topic">{exercise.topic}</p>
            
            <div className="question-container">
              <p className="question-text">{exercise.questionJson.question}</p>
              
              {exercise.questionJson.type === 'multiple-choice' ? (
                <div className="multiple-choice">
                  {exercise.questionJson.options.map((option, index) => (
                    <label key={index} className="option-label">
                      <input
                        type="radio"
                        name={`exercise-${exercise.id}`}
                        value={option}
                        checked={answers[exercise.id] === option}
                        onChange={(e) => handleAnswerChange(exercise.id, e.target.value)}
                      />
                      <span className="option-text">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="fill-in-blank">
                  <input
                    type="text"
                    className="blank-input"
                    value={answers[exercise.id] || ''}
                    onChange={(e) => handleAnswerChange(exercise.id, e.target.value)}
                    placeholder="Deine Antwort..."
                  />
                </div>
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