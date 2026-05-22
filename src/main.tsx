import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css'; // Caricherà la grafica e Tailwind

// Inizializzazione temporanea della UI in attesa dello sviluppo delle schermate
const AppMock = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', textAlign: 'center', padding: '20px' }}>
    <div>
      <h1 style={{ color: '#10b981' }}>🚀 ZeroFila Foundation V1</h1>
      <p style={{ color: '#64748b' }}>Il Core stabile e le configurazioni sono pronte al 100%.</p>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppMock />
  </React.StrictMode>
);
