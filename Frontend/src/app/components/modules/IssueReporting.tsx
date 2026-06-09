import React, { useState } from 'react';
import { User, Department } from '@/app/App';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { FileText, Upload, CheckCircle, AlertTriangle, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

interface IssueReportingProps {
  user: User;
}

const DEPARTMENTS: Department[] = ['DOMESTIC TAX', 'IT', 'CUSTOMS', 'TAX INVESTIGATIONS', 'HR', 'FINANCE'];
const SYSTEMS = ['Tax Management System', 'EBM (Electronic Billing Machine)', 'Customs System', 'HR Portal', 'Financial System', 'ASYCUDA World'];
const ISSUE_TYPES = ['Accuracy', 'Completeness', 'Consistency', 'Timeliness', 'Validity', 'Uniqueness'];
const SEVERITIES = ['Critical', 'High', 'Medium', 'Low'];
const PRIORITIES = ['Urgent', 'High', 'Normal', 'Low'];

// Mock existing issues for duplicate detection
const EXISTING_ISSUES = [
  { id: 'DQ-2024-089', title: 'Missing TIN numbers in taxpayer records', similarity: 85 },
  { id: 'DQ-2024-087', title: 'Inconsistent date formats in tax returns', similarity: 65 },
  { id: 'DQ-2024-076', title: 'Invalid email formats in customer database', similarity: 45 },
];

export function IssueReporting({ user }: IssueReportingProps) {
  const [formData, setFormData] = useState({
    department: user.role === 'admin' ? '' : user.department,
    system: '',
    dataElement: '',
    issueType: '',
    description: '',
    severity: '',
    impact: '',
    priority: '',
    attachment: null as File | null,
    relatedIssues: [] as string[],
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [similarIssues, setSimilarIssues] = useState<typeof EXISTING_ISSUES>([]);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.department || !formData.system || !formData.dataElement || 
        !formData.issueType || !formData.description || !formData.severity || !formData.priority) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check for duplicate issues
    const description = formData.description.toLowerCase();
    const foundIssues = EXISTING_ISSUES.filter(issue => description.includes(issue.title.toLowerCase()));
    if (foundIssues.length > 0) {
      setSimilarIssues(foundIssues);
      setShowDuplicateWarning(true);
      return;
    }

    // Generate ticket number
    const ticket = `DQ-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    setTicketNumber(ticket);
    setShowSuccess(true);
    
    toast.success('Issue reported successfully!');
    
    // Reset form
    setTimeout(() => {
      setFormData({
        department: user.role === 'admin' ? '' : user.department,
        system: '',
        dataElement: '',
        issueType: '',
        description: '',
        severity: '',
        impact: '',
        priority: '',
        attachment: null,
        relatedIssues: [],
      });
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, attachment: e.target.files[0] });
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Issue Reporting</h1>
        <p className="text-gray-600 mt-1">Report data quality issues for investigation and resolution</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#20603D]" />
            Submit New Data Quality Issue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Department Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => setFormData({ ...formData, department: value as Department })}
                  disabled={user.role !== 'admin'}
                >
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

              <div className="space-y-2">
                <Label htmlFor="system">System/Source <span className="text-red-500">*</span></Label>
                <Select value={formData.system} onValueChange={(value) => setFormData({ ...formData, system: value })}>
                  <SelectTrigger id="system">
                    <SelectValue placeholder="Select system" />
                  </SelectTrigger>
                  <SelectContent>
                    {SYSTEMS.map((sys) => (
                      <SelectItem key={sys} value={sys}>{sys}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Data Element */}
            <div className="space-y-2">
              <Label htmlFor="dataElement">Data Element (Table/Field) <span className="text-red-500">*</span></Label>
              <Input 
                id="dataElement"
                placeholder="e.g., taxpayer_table.TIN_number"
                value={formData.dataElement}
                onChange={(e) => setFormData({ ...formData, dataElement: e.target.value })}
              />
            </div>

            {/* Issue Type and Severity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueType">Issue Type <span className="text-red-500">*</span></Label>
                <Select value={formData.issueType} onValueChange={(value) => setFormData({ ...formData, issueType: value })}>
                  <SelectTrigger id="issueType">
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ISSUE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Severity <span className="text-red-500">*</span></Label>
                <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
                  <SelectTrigger id="severity">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEVERITIES.map((sev) => (
                      <SelectItem key={sev} value={sev}>
                        <span className={`font-medium ${
                          sev === 'Critical' ? 'text-red-600' :
                          sev === 'High' ? 'text-orange-600' :
                          sev === 'Medium' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`}>{sev}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Issue Description <span className="text-red-500">*</span></Label>
              <Textarea 
                id="description"
                placeholder="Describe the data quality issue in detail..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Impact Assessment */}
            <div className="space-y-2">
              <Label htmlFor="impact">Impact Assessment</Label>
              <Textarea 
                id="impact"
                placeholder="Describe the business impact of this issue..."
                rows={3}
                value={formData.impact}
                onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
              />
            </div>

            {/* Priority and Attachment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority <span className="text-red-500">*</span></Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((pri) => (
                      <SelectItem key={pri} value={pri}>{pri}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attachment">Attachment (Screenshot/Document)</Label>
                <div className="relative">
                  <Input 
                    id="attachment"
                    type="file"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                    accept=".pdf,.png,.jpg,.jpeg,.xlsx,.docx"
                  />
                  <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                {formData.attachment && (
                  <p className="text-xs text-green-600">✓ {formData.attachment.name}</p>
                )}
              </div>
            </div>

            {/* Related Issues */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-blue-600" />
                  Link Related Issues (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-700">
                  Link this issue to other related issues for better tracking
                </p>
                <div className="space-y-2">
                  <Select 
                    value={formData.relatedIssues[0] || ''} 
                    onValueChange={(value) => {
                      if (value && !formData.relatedIssues.includes(value)) {
                        setFormData({ ...formData, relatedIssues: [...formData.relatedIssues, value] });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select related issue..." />
                    </SelectTrigger>
                    <SelectContent>
                      {EXISTING_ISSUES.map((issue) => (
                        <SelectItem key={issue.id} value={issue.id}>
                          {issue.id} - {issue.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.relatedIssues.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.relatedIssues.map((issueId) => (
                        <Badge key={issueId} variant="secondary" className="gap-1">
                          {issueId}
                          <button
                            type="button"
                            onClick={() => setFormData({
                              ...formData,
                              relatedIssues: formData.relatedIssues.filter(id => id !== issueId)
                            })}
                            className="ml-1 hover:text-red-600"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="bg-[#20603D] hover:bg-[#20603D]/90 flex-1"
                size="lg"
              >
                <FileText className="w-4 h-4 mr-2" />
                Submit Issue Report
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setFormData({
                  department: user.role === 'admin' ? '' : user.department,
                  system: '',
                  dataElement: '',
                  issueType: '',
                  description: '',
                  severity: '',
                  impact: '',
                  priority: '',
                  attachment: null,
                })}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">Issue Reported Successfully!</DialogTitle>
            <DialogDescription className="text-center space-y-3">
              <p>Your data quality issue has been submitted for review.</p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Ticket Number</p>
                <p className="text-2xl font-bold text-[#20603D] font-mono">{ticketNumber}</p>
              </div>
              <p className="text-sm">
                You will receive notifications as your issue is processed and assigned for resolution.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button 
              onClick={() => setShowSuccess(false)} 
              className="flex-1 bg-[#20603D] hover:bg-[#20603D]/90"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Duplicate Warning Dialog */}
      <Dialog open={showDuplicateWarning} onOpenChange={setShowDuplicateWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">Duplicate Issue Detected!</DialogTitle>
            <DialogDescription className="text-center space-y-3">
              <p>Similar issues have been reported previously. Please review them before submitting.</p>
              <div className="bg-gray-100 p-4 rounded-lg">
                {similarIssues.map(issue => (
                  <div key={issue.id} className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Ticket Number</p>
                    <p className="text-2xl font-bold text-[#20603D] font-mono">{issue.id}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm">
                If you believe this is a new issue, you can proceed with the submission.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button 
              onClick={() => setShowDuplicateWarning(false)} 
              className="flex-1 bg-[#20603D] hover:bg-[#20603D]/90"
            >
              Proceed
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setShowDuplicateWarning(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}