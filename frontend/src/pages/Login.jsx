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
      console.log('Sending request to:', `${baseUrl}/api/login`);
      const response = await fetch(`${baseUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCodeIdentifier: qrCode }),
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const text = await response.text();
      console.log('Raw response:', text);

      if (!text) {
        throw new Error('Leere Antwort vom Server');
      }

      try {
        const data = JSON.parse(text);
        console.log('Parsed response:', data);

        if (response.ok && data.token) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('studentId', data.studentId);
          window.location.href = '/exercises';
        } else {
          setError(data.message || 'Login fehlgeschlagen');
        }
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error(`Ungültige Server-Antwort: ${text}`);
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