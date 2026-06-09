import React, { useState } from 'react';
import { User, Department } from '@/app/App';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { CheckCircle, Play, Download, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DataValidationProps {
  user: User;
}

const DATASETS = {
  'DOMESTIC TAX': ['Taxpayer Master Data', 'Tax Returns', 'Payment Records', 'TIN Registry'],
  'IT': ['System Logs', 'User Accounts', 'API Transactions', 'Database Backups'],
  'CUSTOMS': ['Import Declarations', 'Export Records', 'Customs Valuations', 'Tariff Classifications'],
  'TAX INVESTIGATIONS': ['Investigation Cases', 'Evidence Records', 'Audit Findings', 'Compliance Reports'],
  'HR': ['Employee Records', 'Payroll Data', 'Leave Management', 'Performance Reviews'],
  'FINANCE': ['Budget Allocations', 'Expenditure Records', 'Revenue Collections', 'Financial Statements'],
};

interface ValidationError {
  recordId: string;
  field: string;
  errorType: string;
  value: string;
  suggestion: string;
}

const SAMPLE_ERRORS: ValidationError[] = [
  { recordId: 'TP-10234', field: 'TIN', errorType: 'Invalid Format', value: '12345ABC', suggestion: 'Should be 9 digits: 123456789' },
  { recordId: 'TP-10567', field: 'Phone', errorType: 'Missing', value: '', suggestion: 'Add valid phone number' },
  { recordId: 'TP-10891', field: 'Email', errorType: 'Invalid Format', value: 'user@domain', suggestion: 'Add domain extension: user@domain.rw' },
  { recordId: 'TP-11023', field: 'Registration_Date', errorType: 'Future Date', value: '2027-05-15', suggestion: 'Date cannot be in the future' },
  { recordId: 'TP-11234', field: 'Tax_Amount', errorType: 'Negative Value', value: '-5000', suggestion: 'Amount must be positive' },
  { recordId: 'TP-11456', field: 'Province', errorType: 'Invalid Value', value: 'KIGAL', suggestion: 'Should be: KIGALI' },
];

export function DataValidation({ user }: DataValidationProps) {
  const [selectedDataset, setSelectedDataset] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationComplete, setValidationComplete] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const availableDatasets = user.role === 'admin' 
    ? Object.values(DATASETS).flat() 
    : DATASETS[user.department] || [];

  const handleValidation = () => {
    if (!selectedDataset) {
      toast.error('Please select a dataset first');
      return;
    }

    setIsValidating(true);
    setProgress(0);
    setValidationComplete(false);
    setErrors([]);

    // Simulate validation progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsValidating(false);
          setValidationComplete(true);
          setErrors(SAMPLE_ERRORS);
          toast.success('Validation completed!');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleExport = () => {
    toast.success('Exporting validation errors to CSV...');
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Data Validation</h1>
        <p className="text-gray-600 mt-1">Run automated validation checks on datasets</p>
      </div>

      {/* Validation Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#20603D]" />
            Dataset Validation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Select Dataset</label>
              <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a dataset to validate..." />
                </SelectTrigger>
                <SelectContent>
                  {availableDatasets.map((dataset) => (
                    <SelectItem key={dataset} value={dataset}>{dataset}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleValidation}
              disabled={!selectedDataset || isValidating}
              className="bg-[#20603D] hover:bg-[#20603D]/90"
              size="lg"
            >
              <Play className="w-4 h-4 mr-2" />
              Run Validation
            </Button>
          </div>

          {/* Progress Bar */}
          {isValidating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Validating records...</span>
                <span className="font-medium text-[#20603D]">{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          )}

          {/* Validation Summary */}
          {validationComplete && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">15,234</div>
                <div className="text-sm text-green-700 mt-1">Valid Records</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-600">{errors.length}</div>
                <div className="text-sm text-red-700 mt-1">Errors Found</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">99.96%</div>
                <div className="text-sm text-blue-700 mt-1">Accuracy Rate</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Results */}
      {validationComplete && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Validation Errors ({errors.length})
              </CardTitle>
              <Button onClick={handleExport} variant="outline" className="text-[#00A1DE] border-[#00A1DE]">
                <Download className="w-4 h-4 mr-2" />
                Export Errors
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Record ID</TableHead>
                    <TableHead>Field</TableHead>
                    <TableHead>Error Type</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>Suggestion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {errors.map((error, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-mono text-sm">{error.recordId}</TableCell>
                      <TableCell className="font-medium">{error.field}</TableCell>
                      <TableCell>
                        <Badge variant="destructive" className="bg-red-500">
                          {error.errorType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-red-600 font-mono text-sm">
                        {error.value || '<empty>'}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {error.suggestion}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Rules Info */}
      <Card>
        <CardHeader>
          <CardTitle>Validation Rules Applied</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-[#20603D]">Format Validation</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>TIN: 9-digit numeric format</li>
                <li>Email: Valid email address format</li>
                <li>Phone: +250 XXX XXX XXX format</li>
                <li>Date: Valid date format (YYYY-MM-DD)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-[#20603D]">Business Rules</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>No duplicate TIN numbers</li>
                <li>Amounts must be positive</li>
                <li>Dates cannot be in the future</li>
                <li>Required fields must not be empty</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-[#20603D]">Data Consistency</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Province names from approved list</li>
                <li>Tax types match system codes</li>
                <li>Cross-field validations</li>
                <li>Referential integrity checks</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-[#20603D]">Completeness</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>All mandatory fields present</li>
                <li>No null values in key fields</li>
                <li>Record completeness score</li>
                <li>Missing data detection</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
