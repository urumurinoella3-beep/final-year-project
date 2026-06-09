import React, { useState } from 'react';
import { User, UserRole, Department } from '@/app/App';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import logoImage from 'figma:asset/e686ed0804a4cc454121e4635af36398ddb2058a.png';
import { toast } from 'sonner';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

// Mock user database for authentication
const MOCK_USERS: { [key: string]: { password: string; name: string; email: string; role: UserRole; department: Department } } = {
  // Admin users
  'admin': { password: 'admin123', name: 'Marie Noella Urumuri', email: 'marie.urumuri@rra.gov.rw', role: 'admin', department: 'IT' },
  
  // HOD users (one per department)
  'hod.domestictax': { password: 'hod123', name: 'Jean Pierre Habimana', email: 'jean.habimana@rra.gov.rw', role: 'hod', department: 'DOMESTIC TAX' },
  'hod.it': { password: 'hod123', name: 'Emmanuel Mugisha', email: 'emmanuel.mugisha@rra.gov.rw', role: 'hod', department: 'IT' },
  'hod.customs': { password: 'hod123', name: 'Robert Gasana', email: 'robert.gasana@rra.gov.rw', role: 'hod', department: 'CUSTOMS' },
  'hod.taxinv': { password: 'hod123', name: 'David Uwizeye', email: 'david.uwizeye@rra.gov.rw', role: 'hod', department: 'TAX INVESTIGATIONS' },
  'hod.hr': { password: 'hod123', name: 'Samuel Mugabo', email: 'samuel.mugabo@rra.gov.rw', role: 'hod', department: 'HR' },
  'hod.finance': { password: 'hod123', name: 'Eric Niyonzima', email: 'eric.niyonzima@rra.gov.rw', role: 'hod', department: 'FINANCE' },
  
  // Secretary users
  'secretary.domestictax': { password: 'sec123', name: 'Grace Uwera', email: 'grace.uwera@rra.gov.rw', role: 'secretary', department: 'DOMESTIC TAX' },
  'secretary.it': { password: 'sec123', name: 'Yvonne Uwase', email: 'yvonne.uwase@rra.gov.rw', role: 'secretary', department: 'IT' },
  'secretary.customs': { password: 'sec123', name: 'Claudine Mukamana', email: 'claudine.mukamana@rra.gov.rw', role: 'secretary', department: 'CUSTOMS' },
  
  // Staff users
  'member.domestictax': { password: 'member123', name: 'Patrick Nkusi', email: 'patrick.nkusi@rra.gov.rw', role: 'member', department: 'DOMESTIC TAX' },
  'member.it': { password: 'member123', name: 'Alice Mutesi', email: 'alice.mutesi@rra.gov.rw', role: 'member', department: 'IT' },
  'member.customs': { password: 'member123', name: 'Sarah Kamanzi', email: 'sarah.kamanzi@rra.gov.rw', role: 'member', department: 'CUSTOMS' },
  'member.taxinv': { password: 'member123', name: 'Claudine Mukamana', email: 'claudine.m@rra.gov.rw', role: 'member', department: 'TAX INVESTIGATIONS' },
  'member.hr': { password: 'member123', name: 'Diane Mukeshimana', email: 'diane.mukeshimana@rra.gov.rw', role: 'member', department: 'HR' },
  'member.finance': { password: 'member123', name: 'Eric Niyonzima', email: 'eric.n@rra.gov.rw', role: 'member', department: 'FINANCE' },
};

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Administrator', description: 'Full system access' },
  { value: 'hod', label: 'Head of Department (HOD)', description: 'Department management' },
  { value: 'secretary', label: 'HOD Secretary', description: 'Administrative support' },
  { value: 'member', label: 'Department Staff', description: 'Regular staff' },
];

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      toast.error('Please select your role');
      return;
    }

    if (!username || !password) {
      toast.error('Please enter username and password');
      return;
    }

    // Check authentication
    const userKey = username.toLowerCase();
    const userRecord = MOCK_USERS[userKey];

    if (!userRecord) {
      toast.error('Invalid username or password');
      return;
    }

    if (userRecord.password !== password) {
      toast.error('Invalid username or password');
      return;
    }

    if (userRecord.role !== selectedRole) {
      toast.error(`This account is not registered as ${selectedRole.toUpperCase()}`);
      return;
    }

    // Successful login
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userRecord.name,
      email: userRecord.email,
      role: userRecord.role,
      department: userRecord.department,
    };

    toast.success(`Welcome, ${user.name}!`);
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#20603D]/5 via-[#00A1DE]/5 to-[#E5BE01]/5 relative">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <img src={logoImage} alt="RRA Watermark" className="w-[600px] h-auto" />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-[#20603D] relative z-10">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="flex justify-center mb-4">
            <img src={logoImage} alt="RRA Logo" className="w-24 h-24" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-[#20603D]">
              DQIMS
            </CardTitle>
            <p className="text-sm font-semibold text-gray-700 mt-1">
              Data Quality Issues Management System
            </p>
          </div>
          <div className="text-center text-xs text-gray-600 border-t border-b py-3 bg-gray-50">
            <p className="font-semibold">Rwanda Revenue Authority (RRA)</p>
            <p className="text-[10px] mt-1">Taxes for Growth and Development</p>
          </div>
          <CardDescription className="text-sm">
            Please login with your credentials
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 pt-6">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                Select Your Role <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Choose your role..." />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{role.label}</span>
                        <span className="text-xs text-gray-500">{role.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Login Button */}
            <Button 
              type="submit"
              className="w-full bg-[#20603D] hover:bg-[#20603D]/90 text-white font-medium py-6"
              size="lg"
            >
              Login to DQIMS
            </Button>
          </form>

          <div className="text-center space-y-2">
            <a href="#" className="text-sm text-[#00A1DE] hover:underline">
              Forgot your password?
            </a>
            <p className="text-xs text-gray-500 pt-2 border-t">
              Need access? Contact IT Department
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs space-y-2">
            <p className="font-semibold text-blue-900">📝 Demo Credentials for Testing:</p>
            <div className="space-y-1 text-blue-800">
              <p>• <strong>Admin:</strong> username: <code className="bg-blue-100 px-1 rounded">admin</code>, password: <code className="bg-blue-100 px-1 rounded">admin123</code></p>
              <p>• <strong>HOD (Domestic Tax):</strong> username: <code className="bg-blue-100 px-1 rounded">hod.domestictax</code>, password: <code className="bg-blue-100 px-1 rounded">hod123</code></p>
              <p>• <strong>Secretary (Domestic Tax):</strong> username: <code className="bg-blue-100 px-1 rounded">secretary.domestictax</code>, password: <code className="bg-blue-100 px-1 rounded">sec123</code></p>
              <p>• <strong>Staff (Domestic Tax):</strong> username: <code className="bg-blue-100 px-1 rounded">member.domestictax</code>, password: <code className="bg-blue-100 px-1 rounded">member123</code></p>
            </div>
            <p className="text-[10px] text-blue-700 mt-2 pt-2 border-t border-blue-200">
              Select the role matching your account, then enter credentials above.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 py-3 text-center text-xs text-gray-600">
        <p className="font-semibold text-red-600">⚠️ Internal Use Only – Confidential RRA Data</p>
        <p className="mt-1">© 2025-2026 AUCA Final Project – DQIMS for RRA | Developed by URUMURI GASANA Marie Noella</p>
      </div>
    </div>
  );
}