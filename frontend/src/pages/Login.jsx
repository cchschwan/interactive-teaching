// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const baseUrl = import.meta.env.VITE_API_URL || '';
    
    try {
      const response = await fetch(`${baseUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCodeIdentifier: qrCode }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('studentId', data.studentId);
        navigate('/exercises'); // Use React Router navigation
      } else {
        setError(data.message || 'Login fehlgeschlagen');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError(`Verbindungsfehler: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Anmeldung zur Lern-App</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="qrCode">Dein QR-Code-Identifikator:</label>
          <input
            id="qrCode"
            type="text"
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
            disabled={isLoading}
            placeholder="z.B. QZ-2025-001"
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Melde an...' : 'Starten'}
        </button>
      </form>
    </div>
  );
}

export default Login;