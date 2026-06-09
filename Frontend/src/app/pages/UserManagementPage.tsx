import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, Department } from '../types';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useNavigate } from 'react-router';

export function UserManagementPage() {
  const { currentUser, users, departments, createUser, updateUser, deleteUser } = useAuth();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userSearch, setUserSearch] = useState('');

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const emp = (u.employeeId || '').toLowerCase();
      const nm = (u.name || '').toLowerCase();
      return emp.includes(q) || nm.includes(q);
    });
  }, [users, userSearch]);

  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    phone: '',
    role: 'STAFF' as UserRole,
    department: 'VAT' as Department,
  });

  if (!currentUser || currentUser.role !== 'ADMIN') {
    navigate('/dashboard');
    return null;
  }

  const handleCreateUser = async () => {
    // Client-side validation: Check if HOD already exists for the department
    if (formData.role === 'HOD') {
      const existingHod = users.find(
        (u) => u.role === 'HOD' && u.department === formData.department && u.isActive
      );
      if (existingHod) {
        alert(
          `A Head of Department (HOD) already exists for ${formData.department} department.\n\n` +
          `Existing HOD: ${existingHod.name} (${existingHod.employeeId})\n\n` +
          `Each department can only have one HOD.`
        );
        return;
      }
    }
    
    try {
      await createUser(formData);
      setIsCreateDialogOpen(false);
      setFormData({
        employeeId: '',
        name: '',
        email: '',
        phone: '',
        role: 'STAFF',
        department: 'VAT',
      });
    } catch (error) {
      // Error is already handled by AuthContext with toast
      console.error('Create user error:', error);
    }
  };

  const handleUpdateUser = async () => {
    if (editingUser) {
      // Client-side validation: Check if HOD already exists for the department
      if (formData.role === 'HOD') {
        const existingHod = users.find(
          (u) => 
            u.role === 'HOD' && 
            u.department === formData.department && 
            u.isActive &&
            u.id !== editingUser.id // Exclude the user being edited
        );
        if (existingHod) {
          alert(
            `A Head of Department (HOD) already exists for ${formData.department} department.\n\n` +
            `Existing HOD: ${existingHod.name} (${existingHod.employeeId})\n\n` +
            `Each department can only have one HOD.`
          );
          return;
        }
      }
      
      try {
        await updateUser(editingUser.id, formData);
        setEditingUser(null);
        setFormData({
          employeeId: '',
          name: '',
          email: '',
          phone: '',
          role: 'STAFF',
          department: 'VAT',
        });
      } catch (error) {
        // Error is already handled by AuthContext with toast
        console.error('Update user error:', error);
      }
    }
  };

  const handleEditClick = (user: any) => {
    setEditingUser(user);
    setFormData({
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
    });
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await deleteUser(userId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">User Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage system users and permissions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-[#20603D] hover:bg-[#1a4d31] h-8">
              <Plus className="w-3 h-3 mr-1" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-base">Create New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Employee ID</Label>
                <Input
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  placeholder="EMP001"
                  className="mt-1 h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="mt-1 h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Email Address</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.doe@rra.gov.rw"
                  className="mt-1 h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Phone Number</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+250788123456"
                  className="mt-1 h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Role</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as UserRole })}>
                  <SelectTrigger className="mt-1 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="HOD">Head of Department</SelectItem>
                    <SelectItem value="STAFF">Staff</SelectItem>
                  </SelectContent>
                </Select>
                {formData.role === 'HOD' && (
                  <p className="text-xs text-amber-600 mt-1 flex items-start gap-1">
                    <span className="font-semibold">⚠️</span>
                    <span>Only one HOD is allowed per department. If an HOD already exists, creation will be blocked.</span>
                  </p>
                )}
              </div>
              <div>
                <Label className="text-xs">Department</Label>
                <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v as Department })}>
                  <SelectTrigger className="mt-1 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="p-2 bg-blue-50 rounded text-xs text-blue-900">
                <p>A temporary password will be sent to the user's email. They must change it on first login.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={() => setIsCreateDialogOpen(false)} className="h-8 text-sm">
                Cancel
              </Button>
              <Button size="sm" onClick={handleCreateUser} className="bg-[#20603D] hover:bg-[#1a4d31] h-8 text-sm">
                Create User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-3">
        <Label className="text-xs text-gray-600">Search users</Label>
        <div className="relative mt-1 max-w-md">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            type="search"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Search by employee ID or full name..."
            className="pl-9 h-9 text-sm"
          />
        </div>
        {userSearch.trim() && (
          <p className="text-[11px] text-gray-500 mt-2">
            Showing <span className="font-medium text-gray-700">{filteredUsers.length}</span> of {users.length} users
          </p>
        )}
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3">
          <p className="text-xs text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-gray-600">Admins</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {users.filter((u) => u.role === 'ADMIN').length}
          </p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-gray-600">HODs</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {users.filter((u) => u.role === 'HOD').length}
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Employee ID</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Name</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Email</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Phone</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Role</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Department</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-mono">{user.employeeId}</td>
                  <td className="px-3 py-2 font-medium">{user.name}</td>
                  <td className="px-3 py-2 text-gray-600">{user.email}</td>
                  <td className="px-3 py-2 text-gray-600">{user.phone}</td>
                  <td className="px-3 py-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        user.role === 'ADMIN'
                          ? 'bg-blue-100 text-blue-700 border-blue-200'
                          : user.role === 'HOD'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-3 py-2">{user.department}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(user)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-base">Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Employee ID</Label>
              <Input
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="mt-1 h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Full Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Email Address</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Phone Number</Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+250788123456"
                className="mt-1 h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Role</Label>
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as UserRole })}>
                <SelectTrigger className="mt-1 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="HOD">Head of Department</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                </SelectContent>
              </Select>
              {formData.role === 'HOD' && (
                <p className="text-xs text-amber-600 mt-1 flex items-start gap-1">
                  <span className="font-semibold">⚠️</span>
                  <span>Only one HOD is allowed per department. If an HOD already exists, update will be blocked.</span>
                </p>
              )}
            </div>
            <div>
              <Label className="text-xs">Department</Label>
              <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v as Department })}>
                <SelectTrigger className="mt-1 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" onClick={() => setEditingUser(null)} className="h-8 text-sm">
              Cancel
            </Button>
            <Button size="sm" onClick={handleUpdateUser} className="bg-[#20603D] hover:bg-[#1a4d31] h-8 text-sm">
              Update User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
