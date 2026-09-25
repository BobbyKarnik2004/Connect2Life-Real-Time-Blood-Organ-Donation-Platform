import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { PasswordStrengthMeter } from '../components/ui/password-strength';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  
  const { login, verify2FA, requires2FA } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load saved credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (show2FA) {
        await verify2FA(twoFACode);
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        toast({
          title: 'Login successful',
          description: 'You have been successfully logged in.',
        });
        navigate('/dashboard');
      } else {
        // Store remember me preference before login
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }

        const response = await login(email, password);
        if (response.requires2FA) {
          setShow2FA(true);
        } else {
          if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
          } else {
            localStorage.removeItem('rememberedEmail');
          }
          
          toast({
            title: 'Login successful',
            description: 'You have been successfully logged in.',
          });
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth URL
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  if (show2FA) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Two-Factor Authentication</CardTitle>
            <CardDescription className="text-center">
              Enter the 6-digit code from your authenticator app
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  placeholder="123456"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShow2FA(false)}
                disabled={isLoading}
              >
                Back to Login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Log in to your Connect2Life account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <PasswordStrengthMeter password={password} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked: boolean) => setRememberMe(checked)}
              />
              <Label htmlFor="remember" className="text-sm font-medium leading-none">
                Remember me
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in with Email'}
            </Button>
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center space-x-2"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path
                    fill="#4285F4"
                    d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.28426 53.749 C -8.52426 55.229 -9.21677 56.479 -10.0802 57.329 L -10.082 57.329 L -6.617 60.137 L -6.573 60.137 C -4.182 57.949 -2.924 54.999 -2.924 51.509 C -2.924 51.009 -2.954 50.509 -3.024 50.029 L -3.264 51.509 Z"
                  />
                  <path
                    fill="#34A853"
                    d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.573 60.137 L -10.082 57.329 C -11.182 58.269 -12.643 58.819 -14.254 58.819 C -17.204 58.819 -19.704 56.729 -20.414 53.999 L -24.826 53.999 L -24.826 56.959 L -24.826 57.059 C -23.096 60.539 -19.254 63.239 -14.754 63.239 Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M -20.414 53.999 C -20.704 53.039 -20.864 52.019 -20.864 50.999 C -20.864 49.979 -20.704 48.959 -20.304 47.999 L -20.304 45.039 L -24.826 42.259 C -25.876 44.499 -26.424 46.989 -26.424 49.499 C -26.424 52.009 -25.876 54.499 -24.826 56.739 L -24.826 56.739 L -20.304 53.999 L -20.414 53.999 Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M -14.754 40.179 C -12.514 40.179 -10.504 40.949 -8.89397 42.469 L -6.60396 40.199 C -8.78396 38.199 -11.574 37.239 -14.754 37.239 C -19.254 37.239 -23.096 39.939 -24.826 43.259 L -20.304 46.039 C -19.594 43.309 -17.094 41.219 -14.144 41.219 C -12.964 41.219 -11.864 41.539 -10.894 42.089 C -9.924 42.639 -9.154 43.449 -8.644 44.439 C -8.134 45.429 -7.894 46.549 -7.954 47.679 C -8.014 48.809 -8.374 49.899 -8.994 50.819 L -8.994 50.819 L -4.954 53.469 C -4.024 51.789 -3.524 49.899 -3.524 47.939 C -3.524 45.979 -4.024 44.089 -4.954 42.409 C -5.884 40.729 -7.214 39.319 -8.834 38.319 C -10.454 37.319 -12.304 36.779 -14.194 36.779 L -14.754 36.779 L -14.754 40.179 Z"
                  />
                </g>
              </svg>
              <span>Sign in with Google</span>
            </Button>
          </CardFooter>
        </form>
        <div className="px-6 pb-6 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
