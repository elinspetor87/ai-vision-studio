import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';

const LoginDebugV2 = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [result, setResult] = useState<any>(null);

  const testLogin = async () => {
    try {
      console.log('Sending login request with:', { email, password });

      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Login response:', response.data);
      setResult({ success: true, data: response.data });
    } catch (error: any) {
      console.error('Login error:', error);
      setResult({
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-2xl space-y-6">
        <div className="bg-card border border-border rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-6">Login Debug V2</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Email:</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Length: {email.length} | Value: "{email}"
              </p>
            </div>

            <div>
              <label className="block text-sm mb-2">Password:</label>
              <Input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Length: {password.length} | Value: "{password}"
              </p>
            </div>

            <Button onClick={testLogin} className="w-full">
              Test Direct Login (Bypass Proxy)
            </Button>
          </div>

          {result && (
            <div className="mt-6 p-4 bg-secondary rounded-lg">
              <h3 className="font-semibold mb-2">
                {result.success ? '✅ Success' : '❌ Error'}
              </h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <h2 className="font-semibold mb-2">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Make sure email is: <code className="bg-secondary px-1">admin@example.com</code></li>
            <li>Make sure password is: <code className="bg-secondary px-1">admin123</code></li>
            <li>Click "Test Direct Login"</li>
            <li>If this works, the issue is with the proxy or frontend auth flow</li>
            <li>If this fails, check the browser console for details</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default LoginDebugV2;
