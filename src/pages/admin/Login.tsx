import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back, Felipe!');
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Helmet>
        <title>Admin Login | Felipe Almeida Studio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">
            Felipe <span className="text-gradient">Almeida</span>
          </h1>
          <p className="font-body text-muted-foreground uppercase tracking-widest text-xs">Portfolio Administration</p>
        </div>

        {/* Login Card */}
        <div className="bg-card border-2 border-primary/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-3 rounded-full">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h2 className="font-display text-2xl font-bold mb-2 text-center">
            Secure Admin Access
          </h2>
          <p className="font-body text-xs text-muted-foreground text-center mb-8">
            This area is restricted to authorized personnel only.
          </p>

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
              Contact your administrator if you need access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
