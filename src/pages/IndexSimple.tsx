const IndexSimple = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: 'white',
      padding: '40px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>✅ React is Working!</h1>
      <p style={{ fontSize: '18px', marginBottom: '10px' }}>If you can see this, React is rendering correctly.</p>
      <p style={{ fontSize: '18px', marginBottom: '10px' }}>The problem is in one of the components on the Index page.</p>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Next Steps:</h2>
        <ol style={{ fontSize: '16px', lineHeight: '1.8' }}>
          <li>Check the browser console (F12) for errors</li>
          <li>Look for red error messages</li>
          <li>Send the error message to me</li>
        </ol>
      </div>

      <div style={{ marginTop: '20px' }}>
        <a href="/blog" style={{ color: '#f59e0b', fontSize: '18px' }}>Go to Blog (this works) →</a>
      </div>
    </div>
  );
};

export default IndexSimple;
