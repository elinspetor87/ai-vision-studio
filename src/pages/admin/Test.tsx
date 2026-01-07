const Test = () => {
  return (
    <div style={{ padding: '40px', backgroundColor: '#1a1a1a', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Admin Test Page</h1>
      <p>If you can see this, the routing is working!</p>
      <ul style={{ marginTop: '20px' }}>
        <li>✅ React is rendering</li>
        <li>✅ Routes are configured</li>
        <li>✅ Admin pages are accessible</li>
      </ul>
      <div style={{ marginTop: '40px' }}>
        <a href="/" style={{ color: '#f59e0b', textDecoration: 'underline' }}>Go to Homepage</a>
        <br />
        <a href="/admin/login" style={{ color: '#f59e0b', textDecoration: 'underline', marginTop: '10px', display: 'inline-block' }}>Go to Login</a>
      </div>
    </div>
  );
};

export default Test;
