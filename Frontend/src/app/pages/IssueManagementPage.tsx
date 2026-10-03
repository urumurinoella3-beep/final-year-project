import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Issue, IssueStatus, IssuePriority } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Plus, LayoutGrid, List, MessageSquare, User, Upload, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function IssueManagementPage() {
  const { currentUser, issues, users, departments, createIssue, updateIssue } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    source: 'VAT',
    issueType: 'MISSING',
    priority: 'MEDIUM',
    department: currentUser?.department || departments[0] || 'Finance',
    isDelegated: false,
    delegatedFrom: '',
    attachments: [] as string[],
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  if (!currentUser) return null;

  const filteredIssues = currentUser.role === 'ADMIN'
    ? issues
    : currentUser.role === 'HOD'
    ? issues.filter((i) => i.department === currentUser.department)
    : issues.filter((i) => i.assignedTo === currentUser.id || i.reportedBy === currentUser.id);

  const departmentStaffs = currentUser.role === 'HOD' 
    ? users.filter((u) => u.department === currentUser.department && u.role === 'STAFF')
    : users.filter((u) => u.role === 'STAFF');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(files);
      setFormData({
        ...formData,
        attachments: files.map((f) => f.name),
      });
    }
  };

  const handleCreateIssue = async () => {
    await createIssue({
      ...formData,
      reportedBy: currentUser.id,
      reportedByName: currentUser.name,
      status: 'OPEN',
    });
    setIsCreateDialogOpen(false);
    setFormData({
      title: '',
      description: '',
      source: 'VAT',
      issueType: 'MISSING',
      priority: 'MEDIUM',
      department: currentUser.department || departments[0] || 'Finance',
      isDelegated: false,
      delegatedFrom: '',
      attachments: [],
    });
    setUploadedFiles([]);
  };

  const handleAssignIssue = async (issueId: string, userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      await updateIssue(issueId, {
        assignedTo: userId,
        assignedToName: user.name,
      });
    }
  };

  const handleChangePriority = async (issueId: string, priority: IssuePriority) => {
    await updateIssue(issueId, { priority });
  };

  const handleChangeStatus = async (issueId: string, status: IssueStatus) => {
    await updateIssue(issueId, { status });
  };

  const kanbanColumns = [
    { status: 'OPEN', title: 'Open', color: 'bg-red-100 border-red-200' },
    { status: 'IN_PROGRESS', title: 'In Progress', color: 'bg-yellow-100 border-yellow-200' },
    { status: 'RESOLVED', title: 'Resolved', color: 'bg-green-100 border-green-200' },
    { status: 'CLOSED', title: 'Closed', color: 'bg-gray-100 border-gray-200' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Issue Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {currentUser.role === 'ADMIN' && 'All system issues'}
            {currentUser.role === 'HOD' && `${currentUser.department} department issues`}
            {currentUser.role === 'STAFF' && 'Your assigned issues'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('table')}
            className="h-8"
          >
            <List className="w-3 h-3 mr-1" />
            Table
          </Button>
          <Button
            variant={view === 'kanban' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('kanban')}
            className="h-8"
          >
            <LayoutGrid className="w-3 h-3 mr-1" />
            Kanban
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#20603D] hover:bg-[#1a4d31] h-8">
                <Plus className="w-3 h-3 mr-1" />
                Report Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle className="text-base">Report New Issue</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Brief description of the issue"
                    className="mt-1 h-8 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Source</Label>
                    <Select value={formData.source} onValueChange={(v) => setFormData({ ...formData, source: v as any })}>
                      <SelectTrigger className="mt-1 h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VAT">VAT</SelectItem>
                        <SelectItem value="CUSTOMS">Customs</SelectItem>
                        <SelectItem value="TAXPAYER_SYSTEM">Taxpayer System</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Department</Label>
                    <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
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
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Issue Type</Label>
                    <Select value={formData.issueType} onValueChange={(v) => setFormData({ ...formData, issueType: v as any })}>
                      <SelectTrigger className="mt-1 h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DUPLICATE">Duplicate</SelectItem>
                        <SelectItem value="MISSING">Missing</SelectItem>
                        <SelectItem value="INCORRECT">Incorrect</SelectItem>
                        <SelectItem value="INCONSISTENT">Inconsistent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Priority</Label>
                    <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v as any })}>
                      <SelectTrigger className="mt-1 h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="LOW">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed description of the issue..."
                    className="mt-1 min-h-[80px] text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Attachments (Optional)</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <label htmlFor="file-upload" className="cursor-pointer flex-1">
                      <div className="border-2 border-dashed border-gray-300 rounded px-3 py-2 hover:border-gray-400 transition-colors">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Upload className="w-3 h-3" />
                          <span>{uploadedFiles.length > 0 ? `${uploadedFiles.length} file(s) selected` : 'Choose files...'}</span>
                        </div>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-xs bg-gray-50 px-2 py-1 rounded">
                          <span className="truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newFiles = uploadedFiles.filter((_, i) => i !== index);
                              setUploadedFiles(newFiles);
                              setFormData({
                                ...formData,
                                attachments: newFiles.map((f) => f.name),
                              });
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {(currentUser.role === 'HOD' || currentUser.role === 'ADMIN') && (
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                    <input
                      type="checkbox"
                      id="delegated"
                      checked={formData.isDelegated}
                      onChange={(e) => setFormData({ ...formData, isDelegated: e.target.checked })}
                      className="w-3 h-3"
                    />
                    <Label htmlFor="delegated" className="text-xs cursor-pointer">
                      Delegated Report (reporting on behalf of another department/user)
                    </Label>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setIsCreateDialogOpen(false)} className="h-8 text-sm">
                  Cancel
                </Button>
                <Button size="sm" onClick={handleCreateIssue} className="bg-[#20603D] hover:bg-[#1a4d31] h-8 text-sm">
                  Create Issue
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {view === 'table' ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">ID</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Title</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Priority</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Assigned To</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Department</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Created</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredIssues.map((issue) => (
                  <tr 
                    key={issue.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/issues/${issue.id}`)}
                  >
                    <td className="px-3 py-2 font-mono">#{issue.id}</td>
                    <td className="px-3 py-2 font-medium">{issue.title}</td>
                    <td className="px-3 py-2">
                      {currentUser.role === 'STAFF' ? (
                        <Select
                          value={issue.status}
                          onValueChange={(v) => handleChangeStatus(issue.id, v as IssueStatus)}
                        >
                          <SelectTrigger className="h-6 text-xs w-28" onClick={(e) => e.stopPropagation()}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="OPEN">Open</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : currentUser.role === 'HOD' ? (
                        <Select
                          value={issue.status}
                          onValueChange={(v) => handleChangeStatus(issue.id, v as IssueStatus)}
                        >
                          <SelectTrigger className="h-6 text-xs w-28" onClick={(e) => e.stopPropagation()}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="OPEN">Open</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                            <SelectItem value="CLOSED">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
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
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {currentUser.role === 'HOD' ? (
                        <Select
                          value={issue.priority}
                          onValueChange={(v) => handleChangePriority(issue.id, v as IssuePriority)}
                        >
                          <SelectTrigger className="h-6 text-xs w-24" onClick={(e) => e.stopPropagation()}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="LOW">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
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
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {currentUser.role === 'HOD' ? (
                        <Select
                          value={issue.assignedTo || ''}
                          onValueChange={(v) => handleAssignIssue(issue.id, v)}
                        >
                          <SelectTrigger className="h-6 text-xs w-32" onClick={(e) => e.stopPropagation()}>
                            <SelectValue placeholder="Assign..." />
                          </SelectTrigger>
                          <SelectContent>
                            {departmentStaffs.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span>{issue.assignedToName || 'Unassigned'}</span>
                      )}
                    </td>
                    <td className="px-3 py-2">{issue.department}</td>
                    <td className="px-3 py-2 text-gray-500">
                      {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                    </td>
                    <td className="px-3 py-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/issues/${issue.id}#comments`);
                        }}
                        className="h-6 text-xs text-[#20603D] hover:text-[#1a4d31] hover:bg-[#20603D]/10"
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Comments
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {kanbanColumns.map((column) => (
            <div key={column.status} className="space-y-2">
              <div className={`p-2 rounded border ${column.color}`}>
                <h3 className="text-xs font-semibold text-gray-700">
                  {column.title} ({filteredIssues.filter((i) => i.status === column.status).length})
                </h3>
              </div>
              <div className="space-y-2">
                {filteredIssues
                  .filter((i) => i.status === column.status)
                  .map((issue) => (
                    <Card 
                      key={issue.id} 
                      className="p-3 space-y-2 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/issues/${issue.id}`)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-medium flex-1">{issue.title}</h4>
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 ${
                            issue.priority === 'HIGH'
                              ? 'bg-red-100 text-red-700 border-red-200'
                              : issue.priority === 'MEDIUM'
                              ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                              : 'bg-green-100 text-green-700 border-green-200'
                          }`}
                        >
                          {issue.priority}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-gray-600 line-clamp-2">{issue.description}</p>
                      <div className="flex items-center justify-between text-[10px] text-gray-500">
                        <span>{issue.department}</span>
                        {issue.assignedToName && (
                          <div className="flex items-center gap-1">
                            <User className="w-2.5 h-2.5" />
                            <span>{issue.assignedToName}</span>
                          </div>
                        )}
                      </div>
                      {(currentUser.role === 'STAFF' && issue.assignedTo === currentUser.id) && (
                        <Select
                          value={issue.status}
                          onValueChange={(v) => handleChangeStatus(issue.id, v as IssueStatus)}
                        >
                          <SelectTrigger className="h-6 text-xs mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="OPEN">Open</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      {currentUser.role === 'HOD' && (
                        <>
                          <Select
                            value={issue.status}
                            onValueChange={(v) => handleChangeStatus(issue.id, v as IssueStatus)}
                          >
                            <SelectTrigger className="h-6 text-xs mt-2" onClick={(e) => e.stopPropagation()}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OPEN">Open</SelectItem>
                              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                              <SelectItem value="RESOLVED">Resolved</SelectItem>
                              <SelectItem value="CLOSED">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                          <div onClick={(e) => e.stopPropagation()} className="mt-2">
                            <Label className="text-[10px] text-gray-500">Assign to staff</Label>
                            <Select
                              value={issue.assignedTo || ''}
                              onValueChange={(v) => handleAssignIssue(issue.id, v)}
                            >
                              <SelectTrigger className="h-7 text-[10px] mt-0.5">
                                <SelectValue placeholder="Unassigned" />
                              </SelectTrigger>
                              <SelectContent>
                                {departmentStaffs.map((u) => (
                                  <SelectItem key={u.id} value={u.id}>
                                    {u.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
