import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/config/api';

const LoginFixed = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting login with:', { email, password: '***' });

      // Clear any old tokens first
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');

      const response = await api.post('/api/auth/login', { email, password });

      console.log('Login successful:', response.data);

      if (response.data.data?.accessToken) {
        localStorage.setItem('token', response.data.data.accessToken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        toast.success('Welcome back!');

        // Force page reload to reset auth context
        window.location.href = '/admin';
      } else {
        toast.error('No token received from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">
            AI <span className="text-gradient">Studio</span>
          </h1>
          <p className="font-body text-muted-foreground">Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <h2 className="font-display text-2xl font-bold mb-6 text-center">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="font-body text-sm text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Email
              </label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-border focus:border-primary"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="font-body text-sm text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-border focus:border-primary"
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="font-body text-xs text-center text-muted-foreground">
              Default credentials: admin@example.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFixed;
