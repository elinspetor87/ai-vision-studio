import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import api from '@/config/api';

const LoginDebugV3 = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<any>(null);

  const testProxyLogin = async () => {
    try {
      console.log('Testing login through proxy with:', { email, password });

      // Use the configured api instance (with proxy)
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });

      console.log('Proxy login response:', response.data);
      setResult({ success: true, data: response.data });
    } catch (error: any) {
      console.error('Proxy login error:', error);
      setResult({
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
        }
      });
    }
  };

  const testDirectLogin = async () => {
    try {
      console.log('Testing direct login (no proxy) with:', { email, password });

      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Direct login response:', response.data);
      setResult({ success: true, data: response.data, method: 'direct' });
    } catch (error: any) {
      console.error('Direct login error:', error);
      setResult({
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status,
        method: 'direct'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-2xl space-y-6">
        <div className="bg-card border border-border rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-6">Login Debug V3 - Proxy Test</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Email:</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-mono"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Password:</label>
              <Input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button onClick={testProxyLogin} className="w-full" variant="default">
                Test Through Proxy
              </Button>
              <Button onClick={testDirectLogin} className="w-full" variant="outline">
                Test Direct (No Proxy)
              </Button>
            </div>
          </div>

          {result && (
            <div className="mt-6 p-4 bg-secondary rounded-lg">
              <h3 className="font-semibold mb-2">
                {result.success ? '✅ Success' : '❌ Error'}
                {result.method && ` (${result.method})`}
              </h3>
              <pre className="text-xs overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <h2 className="font-semibold mb-2">Debug Info:</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Frontend URL: {window.location.origin}</li>
            <li>Backend URL: http://localhost:5000</li>
            <li>Proxy configured: /api → http://127.0.0.1:5000</li>
            <li>API base URL: {import.meta.env.MODE === 'development' ? '(using proxy)' : import.meta.env.VITE_API_URL || 'http://localhost:5000'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginDebugV3;
