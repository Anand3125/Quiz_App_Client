import React from 'react';
import '../styles/index.css';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        width: '90%'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '1rem'
        }}>
          Quiz Platform
        </h1>
        <p style={{
          color: '#666',
          fontSize: '1.2rem',
          marginBottom: '2rem'
        }}>
          Frontend is working! Ready to build the full app.
        </p>
        <button style={{
          background: '#667eea',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'background 0.3s'
        }}>
          Test Button
        </button>
      </div>
    </div>
  );
}

export default App;
