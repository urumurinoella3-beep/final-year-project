import React, { useState } from 'react';
import { User, Department } from '@/app/App';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { Checkbox } from '@/app/components/ui/checkbox';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, FileText, Download, TrendingUp, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface ReportingProps {
  user: User;
}

const DEPARTMENTS: Department[] = ['DOMESTIC TAX', 'IT', 'CUSTOMS', 'TAX INVESTIGATIONS', 'HR', 'FINANCE'];
const CHART_TYPES = ['Bar Chart', 'Line Chart', 'Pie Chart', 'Area Chart'];
const EXPORT_FORMATS = ['PDF', 'Excel', 'Word'];

const recurringIssuesData = [
  { month: 'Aug', issues: 12 },
  { month: 'Sep', issues: 15 },
  { month: 'Oct', issues: 10 },
  { month: 'Nov', issues: 18 },
  { month: 'Dec', issues: 14 },
  { month: 'Jan', issues: 9 },
];

const issuesByDepartmentData = [
  { dept: 'DOMESTIC TAX', count: 45 },
  { dept: 'IT', count: 23 },
  { dept: 'CUSTOMS', count: 18 },
  { dept: 'TAX INV', count: 12 },
  { dept: 'HR', count: 8 },
  { dept: 'FINANCE', count: 6 },
];

const issueDistributionData = [
  { name: 'Accuracy', value: 35 },
  { name: 'Completeness', value: 25 },
  { name: 'Consistency', value: 20 },
  { name: 'Timeliness', value: 12 },
  { name: 'Validity', value: 8 },
];

const COLORS = ['#20603D', '#00A1DE', '#E5BE01', '#FF6B6B', '#8E44AD', '#3498DB'];

export function Reporting({ user }: ReportingProps) {
  const [filters, setFilters] = useState({
    department: user.role === 'admin' ? 'all' : user.department,
    dateRange: 'last-30-days',
    issueType: 'all',
    severity: 'all',
  });
  const [selectedChart, setSelectedChart] = useState('Bar Chart');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['issues', 'quality-score', 'resolution-time']);

  const metrics = [
    { id: 'issues', label: 'Total Issues' },
    { id: 'quality-score', label: 'Quality Score' },
    { id: 'resolution-time', label: 'Average Resolution Time' },
    { id: 'compliance', label: 'Compliance Rate' },
    { id: 'data-accuracy', label: 'Data Accuracy' },
  ];

  const toggleMetric = (metricId: string) => {
    if (selectedMetrics.includes(metricId)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== metricId));
    } else {
      setSelectedMetrics([...selectedMetrics, metricId]);
    }
  };

  const handleGenerateReport = () => {
    toast.success('Generating custom report...');
  };

  const handleExport = (format: string) => {
    toast.success(`Exporting report as ${format}...`);
  };

  // Check if user has access to Reporting module
  const canAccessReporting = user.role === 'admin' || user.role === 'hod' || user.role === 'secretary';
  
  if (!canAccessReporting) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h3>
            <p className="text-gray-600">You don't have permission to access Reporting & Analytics.</p>
            <p className="text-sm text-gray-500 mt-2">Contact your HOD or administrator for access.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reporting & Analytics</h1>
        <p className="text-gray-600 mt-1">Generate custom reports and analyze data quality metrics</p>
      </div>

      {/* Report Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#20603D]" />
            Custom Report Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Department</Label>
              <Select 
                value={filters.department} 
                onValueChange={(value) => setFilters({ ...filters, department: value })}
                disabled={user.role !== 'admin'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={filters.dateRange} onValueChange={(value) => setFilters({ ...filters, dateRange: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                  <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Issue Type</Label>
              <Select value={filters.issueType} onValueChange={(value) => setFilters({ ...filters, issueType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="accuracy">Accuracy</SelectItem>
                  <SelectItem value="completeness">Completeness</SelectItem>
                  <SelectItem value="consistency">Consistency</SelectItem>
                  <SelectItem value="timeliness">Timeliness</SelectItem>
                  <SelectItem value="validity">Validity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Severity</Label>
              <Select value={filters.severity} onValueChange={(value) => setFilters({ ...filters, severity: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chart Type Selector */}
          <div className="space-y-2">
            <Label>Chart Type</Label>
            <div className="flex gap-2">
              {CHART_TYPES.map((chart) => (
                <Button
                  key={chart}
                  variant={selectedChart === chart ? 'default' : 'outline'}
                  onClick={() => setSelectedChart(chart)}
                  className={selectedChart === chart ? 'bg-[#20603D]' : ''}
                >
                  {chart}
                </Button>
              ))}
            </div>
          </div>

          {/* Metrics Selector */}
          <div className="space-y-2">
            <Label>Select Metrics</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {metrics.map((metric) => (
                <div key={metric.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={metric.id}
                    checked={selectedMetrics.includes(metric.id)}
                    onCheckedChange={() => toggleMetric(metric.id)}
                  />
                  <Label htmlFor={metric.id} className="text-sm cursor-pointer">
                    {metric.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleGenerateReport} className="bg-[#20603D] hover:bg-[#20603D]/90">
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" className="border-[#00A1DE] text-[#00A1DE]">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recurring Issues Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-4 h-4 text-[#20603D]" />
              Recurring Issues Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={recurringIssuesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="issues" 
                  stroke="#20603D" 
                  strokeWidth={3}
                  name="Recurring Issues"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Issues by Department */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="w-4 h-4 text-[#00A1DE]" />
              Issues by Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={issuesByDepartmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dept" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#00A1DE" name="Total Issues" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Issue Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#E5BE01]" />
            Issue Type Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={issueDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {issueDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-[#20603D]" />
            Export Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {EXPORT_FORMATS.map((format) => (
              <Button
                key={format}
                onClick={() => handleExport(format)}
                variant="outline"
                className="border-[#00A1DE] text-[#00A1DE]"
              >
                <Download className="w-4 h-4 mr-2" />
                Export as {format}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Report Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600">112</div>
              <div className="text-sm text-green-700 mt-1">Total Issues Analyzed</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">89%</div>
              <div className="text-sm text-blue-700 mt-1">Resolution Rate</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-3xl font-bold text-purple-600">2.5 days</div>
              <div className="text-sm text-purple-700 mt-1">Avg Resolution Time</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-3xl font-bold text-orange-600">15</div>
              <div className="text-sm text-orange-700 mt-1">Recurring Issues</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}