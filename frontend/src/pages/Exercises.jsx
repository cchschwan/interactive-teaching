import React, { useEffect, useState } from 'react';
import './Exercises.css';

function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/exercises', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setExercises(data);
        } else {
          setError('Fehler beim Laden der Übungen');
        }
      } catch (err) {
        setError('Verbindungsfehler');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  if (loading) return <div>Lade Übungen...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="exercises-container">
      <h1>Übungen</h1>
      <div className="exercises-list">
        {exercises.map(exercise => (
          <div key={exercise.id} className="exercise-card">
            <h2>{exercise.title}</h2>
            <p>{exercise.topic}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Exercises;