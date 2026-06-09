import React, { useState } from 'react';
import { User } from '@/app/App';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';
import { Clock, User as UserIcon, MessageSquare, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface IssueTrackingProps {
  user: User;
}

interface Issue {
  id: string;
  title: string;
  department: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  assignee: string;
  dueDate: string;
  status: 'reported' | 'assigned' | 'in-progress' | 'resolved' | 'closed';
}

const MOCK_ISSUES: Issue[] = [
  { id: 'DQ-2024-089', title: 'Missing TIN numbers', department: 'DOMESTIC TAX', severity: 'critical', assignee: 'Patrick Nkusi', dueDate: '2026-01-22', status: 'reported' },
  { id: 'DQ-2024-088', title: 'Duplicate customs entries', department: 'CUSTOMS', severity: 'high', assignee: 'Sarah Kamanzi', dueDate: '2026-01-24', status: 'assigned' },
  { id: 'DQ-2024-087', title: 'Date format inconsistency', department: 'DOMESTIC TAX', severity: 'medium', assignee: 'Grace Uwera', dueDate: '2026-01-25', status: 'in-progress' },
  { id: 'DQ-2024-086', title: 'API timeout errors', department: 'IT', severity: 'high', assignee: 'Alice Mutesi', dueDate: '2026-01-23', status: 'in-progress' },
  { id: 'DQ-2024-085', title: 'Invalid email formats', department: 'DOMESTIC TAX', severity: 'low', assignee: 'Patrick Nkusi', dueDate: '2026-01-20', status: 'resolved' },
  { id: 'DQ-2024-084', title: 'Negative tax amounts', department: 'DOMESTIC TAX', severity: 'critical', assignee: 'Grace Uwera', dueDate: '2026-01-18', status: 'closed' },
];

const DEPARTMENT_MEMBERS = {
  'DOMESTIC TAX': ['Patrick Nkusi', 'Grace Uwera', 'Jean Pierre Habimana'],
  'IT': ['Alice Mutesi', 'Emmanuel Mugisha', 'Marie Noella Urumuri'],
  'CUSTOMS': ['Sarah Kamanzi', 'Robert Gasana'],
  'TAX INVESTIGATIONS': ['Claudine Mukamana', 'David Uwizeye'],
  'HR': ['Samuel Mugabo', 'Yvonne Uwase'],
  'FINANCE': ['Eric Niyonzima', 'Diane Mukeshimana'],
};

const STATUS_COLUMNS = [
  { id: 'reported', label: 'Reported', color: 'bg-gray-100' },
  { id: 'assigned', label: 'Assigned', color: 'bg-blue-100' },
  { id: 'in-progress', label: 'In Progress', color: 'bg-yellow-100' },
  { id: 'resolved', label: 'Resolved', color: 'bg-green-100' },
  { id: 'closed', label: 'Closed', color: 'bg-purple-100' },
];

export function IssueTracking({ user }: IssueTrackingProps) {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [response, setResponse] = useState('');

  const isAdmin = user.role === 'admin';
  const isHOD = user.role === 'hod';
  const canAssign = isAdmin || isHOD;

  const filteredIssues = isAdmin 
    ? MOCK_ISSUES 
    : MOCK_ISSUES.filter(issue => issue.department === user.department);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleAssign = () => {
    if (!selectedStaff) {
      toast.error('Please select a member to assign');
      return;
    }
    toast.success(`Issue assigned to ${selectedStaff}`);
    setShowAssignDialog(false);
    setSelectedStaff('');
    setSelectedIssue(null);
  };

  const handleRespond = () => {
    if (!response.trim()) {
      toast.error('Please enter a response');
      return;
    }
    toast.success('Response submitted successfully');
    setResponse('');
    setSelectedIssue(null);
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Issue Tracking & Resolution</h1>
        <p className="text-gray-600 mt-1">Track and manage data quality issues through resolution</p>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUS_COLUMNS.map((column) => {
          const columnIssues = filteredIssues.filter(issue => issue.status === column.id);
          
          return (
            <div key={column.id} className="flex-shrink-0 w-80">
              <Card className={`${column.color} border-2`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>{column.label}</span>
                    <Badge variant="secondary">{columnIssues.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {columnIssues.map((issue) => (
                    <Card 
                      key={issue.id} 
                      className="cursor-pointer hover:shadow-lg transition-shadow bg-white"
                      onClick={() => setSelectedIssue(issue)}
                    >
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <Badge variant="outline" className="text-xs font-mono">
                            {issue.id}
                          </Badge>
                          <Badge className={`${getSeverityColor(issue.severity)} text-xs`}>
                            {issue.severity}
                          </Badge>
                        </div>
                        
                        <p className="font-medium text-sm text-gray-900 line-clamp-2">
                          {issue.title}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Badge variant="outline" className="text-xs">
                            {issue.department}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs bg-[#20603D] text-white">
                                {issue.assignee.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-600">{issue.assignee.split(' ')[0]}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {issue.dueDate}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Issue Detail Dialog */}
      {selectedIssue && (
        <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedIssue.id}</span>
                <Badge className={getSeverityColor(selectedIssue.severity)}>
                  {selectedIssue.severity}
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-base font-medium text-gray-900 pt-2">
                {selectedIssue.title}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Issue Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium">{selectedIssue.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant="outline" className="capitalize">{selectedIssue.status}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Assignee</p>
                  <p className="font-medium">{selectedIssue.assignee}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className="font-medium">{selectedIssue.dueDate}</p>
                </div>
              </div>

              {/* SLA Timer */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-900 font-medium">SLA Timer</p>
                      <p className="text-xs text-blue-700">Critical issues: 24 hours</p>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">18h 42m</div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments Thread */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Comments & Updates
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">JH</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">Jean Pierre Habimana</span>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Issue has been validated. Assigning to department member for resolution.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">PN</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">Patrick Nkusi</span>
                      <span className="text-xs text-gray-500">1 hour ago</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Working on data correction script. Will deploy fix by EOD.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {canAssign && (
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold">HOD Actions</h4>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => {
                        setShowAssignDialog(true);
                        setSelectedIssue(selectedIssue);
                      }}
                      className="flex-1 bg-[#20603D] hover:bg-[#20603D]/90"
                    >
                      <UserIcon className="w-4 h-4 mr-2" />
                      Assign to Staff
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 border-[#00A1DE] text-[#00A1DE]"
                      onClick={() => {
                        setResponse('');
                      }}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Add Response
                    </Button>
                  </div>
                  
                  {/* Response Input */}
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Enter your response or update..."
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      rows={3}
                    />
                    <Button 
                      onClick={handleRespond}
                      size="sm"
                      className="w-full bg-[#00A1DE] hover:bg-[#00A1DE]/90"
                    >
                      Submit Response
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Assign Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Issue to Team Staff</DialogTitle>
            <DialogDescription>
              Select a department member to assign this issue
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
              <SelectTrigger>
                <SelectValue placeholder="Select team member..." />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENT_MEMBERS[user.department as keyof typeof DEPARTMENT_MEMBERS]?.map((member) => (
                  <SelectItem key={member} value={member}>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {member.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{member}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-3">
              <Button onClick={handleAssign} className="flex-1 bg-[#20603D] hover:bg-[#20603D]/90">
                <CheckCircle className="w-4 h-4 mr-2" />
                Assign Issue
              </Button>
              <Button variant="outline" onClick={() => setShowAssignDialog(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
