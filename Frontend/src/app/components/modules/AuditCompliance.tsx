import React, { useState } from 'react';
import { User } from '@/app/App';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { ShieldCheck, Download, Search, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface AuditComplianceProps {
  user: User;
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  department: string;
  status: 'success' | 'warning' | 'error';
}

const AUDIT_LOGS: AuditLog[] = [
  { id: '1', timestamp: '2026-01-20 14:23:15', user: 'Jean Pierre Habimana', action: 'Issue Assigned', details: 'DQ-2024-089 assigned to Patrick Nkusi', department: 'DOMESTIC TAX', status: 'success' },
  { id: '2', timestamp: '2026-01-20 13:45:22', user: 'Marie Noella Urumuri', action: 'User Created', details: 'New user account created for Alice Mutesi', department: 'IT', status: 'success' },
  { id: '3', timestamp: '2026-01-20 12:18:07', user: 'Patrick Nkusi', action: 'Data Validation Run', details: 'Validated Taxpayer Master Data - 6 errors found', department: 'DOMESTIC TAX', status: 'warning' },
  { id: '4', timestamp: '2026-01-20 11:05:43', user: 'Robert Gasana', action: 'Issue Resolved', details: 'DQ-2024-088 marked as resolved', department: 'CUSTOMS', status: 'success' },
  { id: '5', timestamp: '2026-01-20 10:32:19', user: 'Grace Uwera', action: 'Report Generated', details: 'Monthly quality report exported as PDF', department: 'DOMESTIC TAX', status: 'success' },
  { id: '6', timestamp: '2026-01-20 09:15:55', user: 'Emmanuel Mugisha', action: 'Login Failed', details: 'Failed login attempt - incorrect password', department: 'IT', status: 'error' },
  { id: '7', timestamp: '2026-01-19 16:45:31', user: 'Sarah Kamanzi', action: 'Issue Created', details: 'New issue DQ-2024-090 reported', department: 'CUSTOMS', status: 'success' },
  { id: '8', timestamp: '2026-01-19 15:22:08', user: 'David Uwizeye', action: 'Permission Modified', details: 'Updated role permissions for Secretary role', department: 'TAX INVESTIGATIONS', status: 'success' },
];

interface ComplianceItem {
  id: string;
  requirement: string;
  status: 'compliant' | 'partial' | 'non-compliant';
  lastChecked: string;
  nextReview: string;
}

const COMPLIANCE_CHECKLIST: ComplianceItem[] = [
  { id: '1', requirement: 'Data Privacy - GDPR Compliance', status: 'compliant', lastChecked: '2026-01-15', nextReview: '2026-02-15' },
  { id: '2', requirement: 'Tax Regulation - Rwanda Tax Code', status: 'compliant', lastChecked: '2026-01-18', nextReview: '2026-02-18' },
  { id: '3', requirement: 'Financial Reporting Standards', status: 'compliant', lastChecked: '2026-01-10', nextReview: '2026-02-10' },
  { id: '4', requirement: 'Internal Audit Requirements', status: 'partial', lastChecked: '2026-01-12', nextReview: '2026-02-12' },
  { id: '5', requirement: 'Data Retention Policy', status: 'compliant', lastChecked: '2026-01-20', nextReview: '2026-02-20' },
  { id: '6', requirement: 'Cybersecurity Standards - ISO 27001', status: 'partial', lastChecked: '2026-01-08', nextReview: '2026-02-08' },
  { id: '7', requirement: 'Access Control Policy', status: 'compliant', lastChecked: '2026-01-17', nextReview: '2026-02-17' },
  { id: '8', requirement: 'Backup and Recovery Procedures', status: 'compliant', lastChecked: '2026-01-19', nextReview: '2026-02-19' },
];

const CHANGE_HISTORY = [
  { date: '2026-01-20', change: 'Updated data validation rules for TIN format', user: 'Marie Noella Urumuri', impact: 'Medium' },
  { date: '2026-01-18', change: 'Modified user permissions for HOD role', user: 'Jean Pierre Habimana', impact: 'High' },
  { date: '2026-01-15', change: 'Added new department: Tax Investigations', user: 'Marie Noella Urumuri', impact: 'High' },
  { date: '2026-01-12', change: 'Changed SLA thresholds for critical issues', user: 'Emmanuel Mugisha', impact: 'Medium' },
  { date: '2026-01-10', change: 'Updated compliance checklist items', user: 'Marie Noella Urumuri', impact: 'Low' },
];

export function AuditCompliance({ user }: AuditComplianceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState('');

  const filteredLogs = AUDIT_LOGS.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = user.role === 'admin' || log.department === user.department;
    return matchesSearch && matchesDept;
  });

  const handleExportLogs = () => {
    toast.success('Exporting audit logs to CSV...');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      case 'error': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-500 text-white';
      case 'partial': return 'bg-yellow-500 text-white';
      case 'non-compliant': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Audit & Compliance</h1>
        <p className="text-gray-600 mt-1">Track system activities and compliance requirements</p>
      </div>

      <Tabs defaultValue="audit-logs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Checklist</TabsTrigger>
          <TabsTrigger value="change-history">Change History</TabsTrigger>
        </TabsList>

        {/* Audit Logs Tab */}
        <TabsContent value="audit-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#20603D]" />
                  System Audit Logs
                </CardTitle>
                <Button onClick={handleExportLogs} variant="outline" className="border-[#00A1DE] text-[#00A1DE]">
                  <Download className="w-4 h-4 mr-2" />
                  Export Logs
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filter */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search logs by user, action, or details..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Logs Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-xs text-gray-600">
                          {log.timestamp}
                        </TableCell>
                        <TableCell className="font-medium">{log.user}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.action}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{log.details}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{log.department}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(log.status)}>
                            {log.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-[#20603D]">1,234</div>
                <div className="text-sm text-gray-600 mt-1">Total Activities</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-green-600">1,187</div>
                <div className="text-sm text-gray-600 mt-1">Successful</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-yellow-600">35</div>
                <div className="text-sm text-gray-600 mt-1">Warnings</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-red-600">12</div>
                <div className="text-sm text-gray-600 mt-1">Errors</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Checklist Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#20603D]" />
                Compliance Requirements Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Requirement</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Checked</TableHead>
                      <TableHead>Next Review</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {COMPLIANCE_CHECKLIST.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{item.requirement}</TableCell>
                        <TableCell>
                          <Badge className={getComplianceColor(item.status)}>
                            {item.status === 'compliant' && <CheckCircle className="w-3 h-3 mr-1 inline" />}
                            {item.status === 'partial' && <Clock className="w-3 h-3 mr-1 inline" />}
                            {item.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{item.lastChecked}</TableCell>
                        <TableCell className="text-sm text-gray-600">{item.nextReview}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="text-[#00A1DE]">
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-green-600">6</div>
                    <div className="text-sm text-gray-600 mt-1">Fully Compliant</div>
                  </div>
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-yellow-600">2</div>
                    <div className="text-sm text-gray-600 mt-1">Partial Compliance</div>
                  </div>
                  <Clock className="w-12 h-12 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">75%</div>
                    <div className="text-sm text-gray-600 mt-1">Overall Compliance Rate</div>
                  </div>
                  <ShieldCheck className="w-12 h-12 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Change History Tab */}
        <TabsContent value="change-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#20603D]" />
                System Change Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {CHANGE_HISTORY.map((change, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="flex-shrink-0 w-24 text-sm text-gray-600">
                      {change.date}
                    </div>
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        change.impact === 'High' ? 'bg-red-100' :
                        change.impact === 'Medium' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}>
                        <Clock className={`w-5 h-5 ${
                          change.impact === 'High' ? 'text-red-600' :
                          change.impact === 'Medium' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{change.change}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm text-gray-600">by {change.user}</span>
                        <Badge className={
                          change.impact === 'High' ? 'bg-red-500 text-white' :
                          change.impact === 'Medium' ? 'bg-yellow-500 text-white' :
                          'bg-blue-500 text-white'
                        }>
                          {change.impact} Impact
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
