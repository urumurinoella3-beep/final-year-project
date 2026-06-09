import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { ArrowLeft, Mail } from 'lucide-react';
import rraLogo from '../../assets/e686ed0804a4cc454121e4635af36398ddb2058a.png';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await resetPassword(email);
    if (success) {
      setSubmitted(true);
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
              className="h-20 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot Password?</h1>
          <p className="text-sm text-gray-600">Enter your email to receive a password reset link</p>
        </div>

        {!submitted ? (
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

            <Button type="submit" className="w-full bg-[#20603D] hover:bg-[#1a4d31] h-9 text-sm">
              Send Reset Link
            </Button>

            <Link to="/login">
              <Button type="button" variant="ghost" className="w-full h-9 text-sm">
                <ArrowLeft className="w-3 h-3 mr-2" />
                Back to Login
              </Button>
            </Link>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                Password reset instructions have been sent to <strong>{email}</strong>
              </p>
              <p className="text-xs text-green-600 mt-2">
                Please check your email and follow the link to reset your password.
              </p>
            </div>
            <Link to="/login">
              <Button variant="outline" className="w-full h-9 text-sm">
                <ArrowLeft className="w-3 h-3 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
