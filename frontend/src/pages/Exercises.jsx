import React, { useEffect, useState } from 'react';
import './Exercises.css';

function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const baseUrl = import.meta.env.VITE_API_URL || '';
        console.log('Using API URL:', baseUrl); // Debug log

        const response = await fetch(`${baseUrl}/api/exercises`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status); // Debug log
        const data = await response.json();
        console.log('Exercises data:', data); // Debug log
        setExercises(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(`Failed to load exercises: ${err.message}`);
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

  const checkAnswer = (exercise) => {
    const userAnswer = answers[exercise.id];
    const isCorrect = exercise.questionJson.type === 'multiple-choice' 
      ? userAnswer === exercise.solutionJson.correctAnswer
      : userAnswer?.toLowerCase() === exercise.solutionJson.correctAnswer.toLowerCase();

    setFeedback(prev => ({
      ...prev,
      [exercise.id]: {
        isCorrect,
        message: isCorrect 
          ? 'Richtig! ' + exercise.solutionJson.explanation
          : 'Leider falsch. Versuche es noch einmal!'
      }
    }));
  };

  if (loading) return <div>Lade Übungen...</div>;
  if (error) return <div className="error">{error}</div>;

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