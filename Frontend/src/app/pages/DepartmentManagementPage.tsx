import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Department } from '../types';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Building2, Users, Plus, Trash2, ClipboardList, Search } from 'lucide-react';
import { useNavigate } from 'react-router';

export function DepartmentManagementPage() {
  const { currentUser, users, issues, departments, addDepartment, removeDepartment, updateIssue } = useAuth();
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [staffSearch, setStaffSearch] = useState('');

  const isHodPage = !!currentUser && currentUser.role === 'HOD';
  const hodDepartmentStaff = useMemo(() => {
    if (!currentUser || !isHodPage) return [];
    return users.filter((u) => u.department === currentUser.department && u.role === 'STAFF');
  }, [currentUser?.id, currentUser?.department, currentUser?.role, users, isHodPage]);

  const hodStaffFiltered = useMemo(() => {
    const q = staffSearch.trim().toLowerCase();
    if (!q) return hodDepartmentStaff;
    return hodDepartmentStaff.filter((u) =>
      [u.name, u.email, u.employeeId, u.phone]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q)),
    );
  }, [hodDepartmentStaff, staffSearch]);

  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'HOD')) {
    navigate('/dashboard');
    return null;
  }

  const isAdmin = currentUser.role === 'ADMIN';
  const viewableDepartments = isAdmin ? departments : [currentUser.department];

  const handleAddDepartment = () => {
    if (newDeptName.trim()) {
      addDepartment(newDeptName.toUpperCase() as Department);
      setNewDeptName('');
      setIsAddDialogOpen(false);
    }
  };

  const handleRemoveDepartment = (dept: Department) => {
    if (confirm(`Are you sure you want to delete ${dept} department?`)) {
      removeDepartment(dept);
    }
  };

  const departmentStats = viewableDepartments.map((dept) => ({
    name: dept,
    totalUsers: users.filter((u) => u.department === dept).length,
    hods: users.filter((u) => u.department === dept && u.role === 'HOD').length,
    members: users.filter((u) => u.department === dept && u.role === 'STAFF').length,
    totalIssues: issues.filter((i) => i.department === dept).length,
    openIssues: issues.filter((i) => i.department === dept && i.status === 'OPEN').length,
  }));

  const handleAssignIssue = async (issueId: string, userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      await updateIssue(issueId, {
        assignedTo: userId,
        assignedToName: user.name,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Department Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {isAdmin ? 'Manage RRA departments and assignments' : `Manage ${currentUser.department} department members and issues`}
          </p>
        </div>
        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#20603D] hover:bg-[#1a4d31] h-8">
                <Plus className="w-3 h-3 mr-1" />
                Add Department
              </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-base">Add New Department</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Department Name</Label>
                <Input
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  placeholder="e.g., TAX COMPLIANCE"
                  className="mt-1 h-8 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={() => setIsAddDialogOpen(false)} className="h-8 text-sm">
                Cancel
              </Button>
              <Button size="sm" onClick={handleAddDepartment} className="bg-[#20603D] hover:bg-[#1a4d31] h-8 text-sm">
                Add Department
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {isAdmin ? (
          <>
            <Card className="p-3">
              <p className="text-xs text-gray-600">Total Departments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{departments.length}</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{users.length}</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-gray-600">Active Issues</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {issues.filter((i) => i.status !== 'CLOSED').length}
              </p>
            </Card>
          </>
        ) : (
          <>
            <Card className="p-3 border-[#20603D]/20">
              <p className="text-xs text-gray-600">Your department</p>
              <p className="text-lg font-bold text-gray-900 mt-1 leading-tight">{currentUser.department}</p>
              <p className="text-[10px] text-gray-500 mt-2">Issues and staff below belong to this unit</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-gray-600">Staff in department</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {users.filter((u) => u.department === currentUser.department && u.role === 'STAFF').length}
              </p>
              <p className="text-[10px] text-gray-500 mt-2">Members you can assign work to</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-gray-600">Open cases (issues)</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {issues.filter((i) => i.department === currentUser.department && i.status === 'OPEN').length}
              </p>
              <p className="text-[10px] text-gray-500 mt-2">Use “View Issues” or Issue Management</p>
            </Card>
          </>
        )}
      </div>

      {!isAdmin && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b bg-gray-50/80 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#20603D]" />
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Department staff directory</h2>
                <p className="text-xs text-gray-500">Search by name, email, employee ID, or phone</p>
              </div>
            </div>
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                value={staffSearch}
                onChange={(e) => setStaffSearch(e.target.value)}
                placeholder="Quick search…"
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-100 border-b text-left text-gray-600">
                <tr>
                  <th className="px-3 py-2 font-semibold">Name</th>
                  <th className="px-3 py-2 font-semibold">Employee ID</th>
                  <th className="px-3 py-2 font-semibold">Email</th>
                  <th className="px-3 py-2 font-semibold">Phone</th>
                  <th className="px-3 py-2 font-semibold">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {hodStaffFiltered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/80">
                    <td className="px-3 py-2 font-medium text-gray-900">{u.name}</td>
                    <td className="px-3 py-2 font-mono text-gray-700">{u.employeeId}</td>
                    <td className="px-3 py-2 text-gray-700">{u.email}</td>
                    <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{u.phone || '—'}</td>
                    <td className="px-3 py-2">
                      <Badge variant="outline" className="text-[10px]">
                        {u.role === 'STAFF' ? 'Member' : u.role}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {hodStaffFiltered.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8 px-3">No staff match your search.</p>
          )}
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        {departmentStats.map((dept) => (
          <Card key={dept.name} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#20603D] to-[#00A1DE] rounded flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{dept.name}</h3>
                  <p className="text-xs text-gray-500">{dept.totalUsers} staff members</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {dept.openIssues} open
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDepartment(dept.name as Department)}
                  className="h-6 px-2 text-xs"
                >
                  <ClipboardList className="w-3 h-3 mr-1" />
                  View Issues
                </Button>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveDepartment(dept.name as Department)}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">HODs</span>
                <span className="font-medium">{dept.hods}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Staffs</span>
                <span className="font-medium">{dept.members}</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t">
                <span className="text-gray-600">Total Issues</span>
                <span className="font-medium">{dept.totalIssues}</span>
              </div>
            </div>

            {isAdmin && (
              <div className="mt-3 pt-3 border-t">
                <h4 className="text-xs font-semibold mb-2">Staff (preview)</h4>
                <div className="space-y-1">
                  {users
                    .filter((u) => u.department === dept.name)
                    .slice(0, 3)
                    .map((user) => (
                      <div key={user.id} className="flex items-center gap-2 text-xs">
                        <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-[10px] font-medium">{user.name.charAt(0)}</span>
                        </div>
                        <span className="flex-1">{user.name}</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {user.role}
                        </Badge>
                      </div>
                    ))}
                  {users.filter((u) => u.department === dept.name).length > 3 && (
                    <p className="text-xs text-gray-500 pl-7">
                      +{users.filter((u) => u.department === dept.name).length - 3} more
                    </p>
                  )}
                </div>
              </div>
            )}
            {!isAdmin && (
              <p className="mt-3 pt-3 border-t text-xs text-gray-500">
                Full staff list and search are in the directory above.
              </p>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedDepartment} onOpenChange={() => setSelectedDepartment(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">{selectedDepartment} Department Issues</DialogTitle>
          </DialogHeader>
          {selectedDepartment && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-3">
                  <p className="text-xs text-gray-600">Total Issues</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {issues.filter((i) => i.department === selectedDepartment).length}
                  </p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-gray-600">Open Issues</p>
                  <p className="text-xl font-bold text-red-600 mt-1">
                    {issues.filter((i) => i.department === selectedDepartment && i.status === 'OPEN').length}
                  </p>
                </Card>
                <Card className="p-3">
                  <p className="text-xs text-gray-600">Department Staff</p>
                  <p className="text-xl font-bold text-blue-600 mt-1">
                    {users.filter((u) => u.department === selectedDepartment && u.role === 'STAFF').length}
                  </p>
                </Card>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">ID</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">Title</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">Priority</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">Assigned To</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {issues
                      .filter((i) => i.department === selectedDepartment)
                      .map((issue) => (
                        <tr key={issue.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 font-mono">#{issue.id}</td>
                          <td className="px-3 py-2 font-medium">{issue.title}</td>
                          <td className="px-3 py-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                issue.status === 'OPEN'
                                  ? 'bg-red-100 text-red-700 border-red-200'
                                  : issue.status === 'IN_PROGRESS'
                                  ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                  : issue.status === 'RESOLVED'
                                  ? 'bg-green-100 text-green-700 border-green-200'
                                  : 'bg-gray-100 text-gray-700 border-gray-200'
                              }`}
                            >
                              {issue.status.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="px-3 py-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                issue.priority === 'HIGH'
                                  ? 'bg-red-100 text-red-700 border-red-200'
                                  : issue.priority === 'MEDIUM'
                                  ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                  : 'bg-green-100 text-green-700 border-green-200'
                              }`}
                            >
                              {issue.priority}
                            </Badge>
                          </td>
                          <td className="px-3 py-2">
                            <Select
                              value={issue.assignedTo || ''}
                              onValueChange={(v) => handleAssignIssue(issue.id, v)}
                            >
                              <SelectTrigger className="h-6 text-xs w-40">
                                <SelectValue placeholder="Assign to..." />
                              </SelectTrigger>
                              <SelectContent>
                                {users
                                  .filter((u) => u.department === selectedDepartment && u.role === 'STAFF')
                                  .map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                      {user.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
