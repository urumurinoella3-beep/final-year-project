import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import rraLogo from '../../assets/e686ed0804a4cc454121e4635af36398ddb2058a.png';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#20603D] via-[#00A1DE] to-[#E5BE01] p-4">
      <Card className="w-full max-w-md p-6 bg-white">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <img 
              src={rraLogo} 
              alt="Rwanda Revenue Authority Logo" 
              className="h-24 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">DQIMS</h1>
          <p className="text-sm text-gray-600">Data Quality Issues Management System</p>
          <p className="text-xs text-gray-500 mt-1">Rwanda Revenue Authority</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@rra.gov.rw"
              required
              className="mt-1 h-9 text-sm"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="mt-1 h-9 text-sm"
            />
          </div>

          <Button type="submit" className="w-full bg-[#20603D] hover:bg-[#1a4d31] h-9 text-sm">
            Sign In
          </Button>

          <div className="text-center">
            <Link to="/forgot-password" className="text-xs text-[#00A1DE] hover:underline">
              Forgot your password?
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
