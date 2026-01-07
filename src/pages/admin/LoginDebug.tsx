import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LoginDebug = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin123');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const testLogin = async () => {
    setResponse(null);
    setError(null);

    try {
      console.log('🔍 Testing login...');
      console.log('API URL:', import.meta.env.VITE_API_URL);

      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);

      if (res.ok) {
        setResponse(data);
      } else {
        setError(data);
      }
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError({ message: err.message, type: 'Network Error' });
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#1a1a1a', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Login Debug</h1>

      <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
        <p><strong>API URL:</strong> {import.meta.env.VITE_API_URL || 'NOT SET'}</p>
        <p><strong>Mode:</strong> {import.meta.env.MODE}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <Button onClick={testLogin}>Test Login</Button>
      </div>

      {response && (
        <div style={{ padding: '20px', backgroundColor: '#2d5016', borderRadius: '8px', marginBottom: '20px' }}>
          <h3 style={{ color: '#4ade80', marginBottom: '10px' }}>✅ Success!</h3>
          <pre style={{ overflow: 'auto', fontSize: '12px' }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div style={{ padding: '20px', backgroundColor: '#5c1a1a', borderRadius: '8px' }}>
          <h3 style={{ color: '#ef4444', marginBottom: '10px' }}>❌ Error!</h3>
          <pre style={{ overflow: 'auto', fontSize: '12px' }}>
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        <p style={{ fontSize: '14px', color: '#888' }}>
          Abra o Console do navegador (F12) para ver os logs detalhados
        </p>
      </div>
    </div>
  );
};

export default LoginDebug;
