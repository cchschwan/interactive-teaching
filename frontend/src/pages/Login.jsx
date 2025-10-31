// src/pages/Login.jsx
import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCodeIdentifier: qrCode }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('studentId', data.studentId);
        // Successful login - no navigation
      } else {
        setError(data.message || 'Login fehlgeschlagen');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Verbindungsfehler zum Server');
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