// src/pages/Login.jsx
import React, { useState } from 'react';
import './Login.css';
// Annahme: Du hast einen Router (wie react-router-dom) installiert
// import { useNavigate } from 'react-router-dom';

function Login() {
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // const navigate = useNavigate(); // Für die Weiterleitung

  // Diese Funktion wird beim Absenden des Formulars aufgerufen
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (qrCode.trim() === '') {
      setError('Bitte gib deinen QR-Code-Identifikator ein.');
      setIsLoading(false);
      return;
    }

    try {
      // 1. API-Aufruf an den Backend-Login-Endpoint
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCodeIdentifier: qrCode }),
      });

      const data = await response.json();

      if (response.ok) {
        // 2. Erfolg: Speichere wichtige Daten
        // Das Backend sollte hier den Token und ggf. die studentId zurückgeben!
        
        // **WICHTIG:** Speichere den Token (JWT) für die Authentifizierung zukünftiger Anfragen
        localStorage.setItem('authToken', data.token); 
        
        // Optional: Speichere die studentId
        localStorage.setItem('studentId', data.studentId);
        
        // 3. Weiterleitung zur Übungsübersicht
        console.log('Anmeldung erfolgreich! Token gespeichert.');
        // navigate('/exercises'); // <--- Hierhin leiten wir weiter!

      } else {
        // 4. Fehlerbehandlung
        setError(data.message || 'Anmeldung fehlgeschlagen. Ungültiger Code?');
      }

    } catch (err) {
      console.error('Login-Fehler:', err);
      setError('Es gab ein Problem bei der Verbindung zum Server.');
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