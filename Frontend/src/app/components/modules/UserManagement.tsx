import React, { useState } from 'react';
import { User, UserRole, Department } from '@/app/App';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Users, UserPlus, Edit, Trash2, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface UserManagementProps {
  user: User;
}

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  status: 'active' | 'inactive';
}

const MOCK_USERS: SystemUser[] = [
  { id: '1', name: 'Marie Noella Urumuri', email: 'marie.urumuri@rra.gov.rw', role: 'admin', department: 'IT', status: 'active' },
  { id: '2', name: 'Jean Pierre Habimana', email: 'jean.habimana@rra.gov.rw', role: 'hod', department: 'DOMESTIC TAX', status: 'active' },
  { id: '3', name: 'Grace Uwera', email: 'grace.uwera@rra.gov.rw', role: 'secretary', department: 'DOMESTIC TAX', status: 'active' },
  { id: '4', name: 'Patrick Nkusi', email: 'patrick.nkusi@rra.gov.rw', role: 'member', department: 'DOMESTIC TAX', status: 'active' },
  { id: '5', name: 'Emmanuel Mugisha', email: 'emmanuel.mugisha@rra.gov.rw', role: 'hod', department: 'IT', status: 'active' },
  { id: '6', name: 'Alice Mutesi', email: 'alice.mutesi@rra.gov.rw', role: 'member', department: 'IT', status: 'active' },
  { id: '7', name: 'Robert Gasana', email: 'robert.gasana@rra.gov.rw', role: 'hod', department: 'CUSTOMS', status: 'active' },
  { id: '8', name: 'Sarah Kamanzi', email: 'sarah.kamanzi@rra.gov.rw', role: 'member', department: 'CUSTOMS', status: 'active' },
];

const DEPARTMENTS: Department[] = ['DOMESTIC TAX', 'IT', 'CUSTOMS', 'TAX INVESTIGATIONS', 'HR', 'FINANCE'];
const ROLES: UserRole[] = ['admin', 'hod', 'secretary', 'member'];

const PERMISSIONS = [
  { id: 'view_own_dept', label: 'View Own Department Issues', admin: true, hod: true, secretary: true, member: true },
  { id: 'view_all_dept', label: 'View All Departments', admin: true, hod: false, secretary: false, member: false },
  { id: 'create_issues', label: 'Create Issues', admin: true, hod: true, secretary: true, member: true },
  { id: 'assign_issues', label: 'Assign Issues', admin: true, hod: true, secretary: false, member: false },
  { id: 'resolve_issues', label: 'Resolve Issues', admin: true, hod: true, secretary: false, member: true },
  { id: 'manage_users', label: 'Manage Users', admin: true, hod: true, secretary: false, member: false },
  { id: 'manage_departments', label: 'Manage Departments', admin: true, hod: false, secretary: false, member: false },
  { id: 'run_validation', label: 'Run Data Validation', admin: true, hod: true, secretary: true, member: true },
  { id: 'generate_reports', label: 'Generate Reports', admin: true, hod: true, secretary: true, member: false },
  { id: 'access_audit_logs', label: 'Access Audit Logs', admin: true, hod: true, secretary: false, member: false },
];

export function UserManagement({ user }: UserManagementProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDepartmentDialog, setShowDepartmentDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [users, setUsers] = useState<SystemUser[]>(MOCK_USERS);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '' as UserRole | '',
    department: '' as Department | '',
  });
  const [newDepartment, setNewDepartment] = useState('');

  const isAdmin = user.role === 'admin';
  const canManageUsers = isAdmin || user.role === 'hod';

  if (!canManageUsers) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600">You don't have permission to access User Management.</p>
            <p className="text-sm text-gray-500 mt-2">Contact your administrator if you need access.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.department) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const newSystemUser: SystemUser = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as UserRole,
      department: newUser.department as Department,
      status: 'active',
    };
    
    setUsers([...users, newSystemUser]);
    toast.success(`User ${newUser.name} added successfully`);
    setShowAddDialog(false);
    setNewUser({ name: '', email: '', role: '', department: '' });
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    setUsers(users.filter(u => u.id !== selectedUser.id));
    toast.success(`User ${selectedUser.name} deleted successfully`);
    setShowDeleteDialog(false);
    setSelectedUser(null);
  };

  const openDeleteDialog = (userToDelete: SystemUser) => {
    setSelectedUser(userToDelete);
    setShowDeleteDialog(true);
  };

  const handleAddDepartment = () => {
    if (!newDepartment.trim()) {
      toast.error('Please enter department name');
      return;
    }
    toast.success('Department added successfully');
    setShowDepartmentDialog(false);
    setNewDepartment('');
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-red-500 text-white';
      case 'hod': return 'bg-blue-500 text-white';
      case 'secretary': return 'bg-purple-500 text-white';
      case 'member': return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User & Role Management</h1>
        <p className="text-gray-600 mt-1">Manage system users, roles, and departments</p>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#20603D]" />
              System Users
            </CardTitle>
            <Button onClick={() => setShowAddDialog(true)} className="bg-[#20603D] hover:bg-[#20603D]/90">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-sm text-gray-600">{u.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(u.role)}>
                        {u.role.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{u.department}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={u.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                        {u.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {u.id !== user.id && (
                          <Button variant="ghost" size="sm" className="text-red-600" onClick={() => openDeleteDialog(u)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Permission Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#00A1DE]" />
            Role Permissions Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Permission</TableHead>
                  <TableHead className="text-center font-semibold">Admin</TableHead>
                  <TableHead className="text-center font-semibold">HOD</TableHead>
                  <TableHead className="text-center font-semibold">Secretary</TableHead>
                  <TableHead className="text-center font-semibold">Staff</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PERMISSIONS.map((perm) => (
                  <TableRow key={perm.id}>
                    <TableCell className="font-medium">{perm.label}</TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={perm.admin} className="mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={perm.hod} className="mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={perm.secretary} className="mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={perm.member} className="mx-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Department Management */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Department Management</CardTitle>
              <Button onClick={() => setShowDepartmentDialog(true)} variant="outline" className="border-[#00A1DE] text-[#00A1DE]">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Department
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {DEPARTMENTS.map((dept) => (
                <div key={dept} className="p-4 border-2 rounded-lg flex items-center justify-between hover:bg-gray-50">
                  <span className="font-medium text-sm">{dept}</span>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new system user account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                placeholder="Enter full name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email"
                type="email"
                placeholder="user@rra.gov.rw"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value as UserRole })}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>{role.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={newUser.department} onValueChange={(value) => setNewUser({ ...newUser, department: value as Department })}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleAddUser} className="flex-1 bg-[#20603D] hover:bg-[#20603D]/90">
                Add User
              </Button>
              <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>Are you sure you want to delete this user?</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedUser && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  placeholder="Enter full name"
                  value={selectedUser.name}
                  readOnly
                />
              </div>
            )}
            <div className="flex gap-3">
              <Button onClick={handleDeleteUser} className="flex-1 bg-red-500 hover:bg-red-500/90">
                Delete User
              </Button>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Department Dialog */}
      <Dialog open={showDepartmentDialog} onOpenChange={setShowDepartmentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>Create a new department in the system</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newDept">Department Name</Label>
              <Input 
                id="newDept"
                placeholder="Enter department name"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAddDepartment} className="flex-1 bg-[#20603D] hover:bg-[#20603D]/90">
                Add Department
              </Button>
              <Button variant="outline" onClick={() => setShowDepartmentDialog(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}