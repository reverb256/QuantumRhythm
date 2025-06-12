import React from 'react';

export default function TestHome() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'black',
      color: 'white',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>
        VIBECODING PORTFOLIO TEST
      </h1>
      <p style={{ fontSize: '1.5rem', color: '#cyan' }}>
        This is the actual home page component loading correctly
      </p>
      <div style={{ marginTop: '2rem', color: '#888' }}>
        If you see this, React routing is working properly
      </div>
    </div>
  );
}