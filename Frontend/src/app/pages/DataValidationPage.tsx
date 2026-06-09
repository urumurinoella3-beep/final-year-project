import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ValidationError } from '../types';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Upload, FileSpreadsheet, AlertTriangle, CheckCircle2, XCircle, Download, Plus, FileText, File } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { useNavigate } from 'react-router';

export function DataValidationPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [validationResults, setValidationResults] = useState<ValidationError[] | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [totalRecords, setTotalRecords] = useState(0);
  const [passedRecords, setPassedRecords] = useState(0);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isLimitedValidation, setIsLimitedValidation] = useState(false);

  if (!currentUser) return null;

  const getFileIcon = (type: string) => {
    if (type.includes('csv')) return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
    if (type.includes('excel') || type.includes('xlsx')) return <FileSpreadsheet className="w-5 h-5 text-green-700" />;
    if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-600" />;
    if (type.includes('word') || type.includes('docx')) return <FileText className="w-5 h-5 text-blue-600" />;
    return <File className="w-5 h-5 text-gray-600" />;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    setFileType(extension);

    // Only CSV and Excel are supported
    setIsLimitedValidation(false);

    // Full validation for CSV/Excel
    const mockPreviewData = [
      { row: 1, TIN: '123456789', Name: 'ABC Company Ltd', Amount: '50000', Email: 'abc@company.rw' },
      { row: 2, TIN: '987654321', Name: 'XYZ Trading', Amount: '75000', Email: 'xyz@trading.rw' },
      { row: 3, TIN: '456789123', Name: 'LMN Enterprises', Amount: '100000', Email: 'lmn@enterprise.rw' },
      { row: 4, TIN: '789123456', Name: 'PQR Services', Amount: '25000', Email: 'pqr@services.rw' },
      { row: 5, TIN: '', Name: 'RST Corp', Amount: '60000', Email: 'rst@corp.rw' },
    ];

    const mockErrors: ValidationError[] = [
      {
        row: 5,
        errorType: 'COMPLETENESS',
        field: 'TIN',
        description: 'Missing TIN value',
        value: '',
      },
      {
        row: 12,
        errorType: 'ACCURACY',
        field: 'Amount',
        description: 'Negative amount not allowed',
        value: '-5000',
      },
      {
        row: 18,
        errorType: 'UNIQUENESS',
        field: 'TIN',
        description: 'Duplicate TIN: 123456789',
        value: '123456789',
      },
      {
        row: 23,
        errorType: 'FORMAT',
        field: 'Email',
        description: 'Invalid email format',
        value: 'invalid.email',
      },
      {
        row: 31,
        errorType: 'COMPLETENESS',
        field: 'Name',
        description: 'Missing taxpayer name',
        value: '',
      },
      {
        row: 45,
        errorType: 'UNIQUENESS',
        field: 'TIN',
        description: 'Duplicate TIN: 987654321',
        value: '987654321',
      },
    ];

    setPreviewData(mockPreviewData);
    setValidationResults(mockErrors);
    setTotalRecords(50);
    setPassedRecords(44);
  };

  const handleDownloadErrors = () => {
    alert('Error report will be downloaded as CSV file');
  };

  const handleCreateIssue = () => {
    navigate('/issues');
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Data Validation</h1>
        <p className="text-xs text-gray-500 mt-0.5">Upload and validate data quality for RRA systems</p>
      </div>

      {/* Section 1: File Upload */}
      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3">1. File Upload</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-xs text-gray-600 mb-3">
              {fileName ? (
                <span className="flex items-center justify-center gap-2">
                  {getFileIcon(fileType)}
                  <span className="font-medium text-gray-900">{fileName}</span>
                </span>
              ) : (
                'Choose a file to validate'
              )}
            </p>
            <label htmlFor="file-upload" className="cursor-pointer">
              <input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button size="sm" className="bg-[#20603D] hover:bg-[#1a4d31] h-8" asChild>
                <span>
                  <Upload className="w-3 h-3 mr-1" />
                  {fileName ? 'Choose Different File' : 'Choose File'}
                </span>
              </Button>
            </label>
            
            {/* Accepted Formats */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-700 mb-2">Accepted Formats:</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                  <span>CSV (.csv)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <FileSpreadsheet className="w-4 h-4 text-green-700" />
                  <span>Excel (.xlsx)</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Maximum file size: 10MB</p>
            </div>
          </div>
        </div>
      </Card>

      {validationResults && (
        <>
          {/* Section 2: Data Preview */}
          <Card className="overflow-hidden">
            <div className="p-3 bg-gray-50 border-b">
              <h3 className="text-sm font-semibold">2. Data Preview</h3>
              <p className="text-xs text-gray-500 mt-0.5">First 5 rows of uploaded data</p>
            </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">Row</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">TIN</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">Name</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">Amount</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {previewData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-2 font-mono">{row.row}</td>
                        <td className="px-3 py-2 font-mono">{row.TIN || <span className="text-red-500">(empty)</span>}</td>
                        <td className="px-3 py-2">{row.Name}</td>
                        <td className="px-3 py-2 font-mono">{row.Amount}</td>
                        <td className="px-3 py-2 text-gray-600">{row.Email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

          {/* Section 3: Validation Summary */}
          <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">3. Validation Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Total Records</p>
                    <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-600">Valid Records</p>
                    <p className="text-2xl font-bold text-green-700">{passedRecords}</p>
                    <p className="text-xs text-green-600">{Math.round((passedRecords / totalRecords) * 100)}% passed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <XCircle className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-xs text-gray-600">Invalid Records</p>
                    <p className="text-2xl font-bold text-red-600">{validationResults.length}</p>
                    <p className="text-xs text-red-600">{Math.round((validationResults.length / totalRecords) * 100)}% errors</p>
                  </div>
                </div>
              </div>
            </Card>

          {/* Section 4: Validation Results */}
          <Card className="overflow-hidden">
            <div className="p-3 bg-gray-50 border-b">
              <h3 className="text-sm font-semibold">4. Validation Results</h3>
              <p className="text-xs text-gray-500 mt-0.5">All validation errors found in the uploaded data</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Row</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Error Type</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Field</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Description</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">Current Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {validationResults.map((error, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-mono text-gray-900">Row {error.row}</td>
                      <td className="px-3 py-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            error.errorType === 'ACCURACY'
                              ? 'bg-red-100 text-red-700 border-red-200'
                              : error.errorType === 'COMPLETENESS'
                              ? 'bg-orange-100 text-orange-700 border-orange-200'
                              : error.errorType === 'UNIQUENESS'
                              ? 'bg-purple-100 text-purple-700 border-purple-200'
                              : 'bg-blue-100 text-blue-700 border-blue-200'
                          }`}
                        >
                          {error.errorType}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 font-medium">{error.field}</td>
                      <td className="px-3 py-2 text-gray-700">{error.description}</td>
                      <td className="px-3 py-2 font-mono text-gray-500">
                        {error.value || <span className="text-red-500">(empty)</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Section 5: Actions */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">5. Actions</h3>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                onClick={handleCreateIssue}
                className="bg-[#20603D] hover:bg-[#1a4d31] h-8"
              >
                <Plus className="w-3 h-3 mr-1" />
                Create Issue from Errors
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownloadErrors}
                className="h-8"
              >
                <Download className="w-3 h-3 mr-1" />
                Download Error Report
              </Button>
              <div className="flex-1" />
              <div className="text-xs text-gray-500">
                Report generated for: <span className="font-medium text-gray-900">{fileName}</span>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
