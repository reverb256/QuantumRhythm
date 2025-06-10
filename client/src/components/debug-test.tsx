export function DebugTest() {
  return (
    <div style={{
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <h1>Quantum AI Trading Platform</h1>
      <p>Application loaded successfully</p>
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => alert('App is working!')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Interaction
        </button>
      </div>
    </div>
  );
}