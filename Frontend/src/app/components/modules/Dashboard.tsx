import React from 'react';
import { User } from '@/app/App';
import type { Page } from '@/app/App';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingUp, CheckCircle, AlertTriangle, FileText, Activity } from 'lucide-react';

interface DashboardProps {
  user: User;
  onNavigate?: (page: Page) => void;
}

const qualityTrendData = [
  { month: 'Aug', score: 87 },
  { month: 'Sep', score: 89 },
  { month: 'Oct', score: 85 },
  { month: 'Nov', score: 90 },
  { month: 'Dec', score: 91 },
  { month: 'Jan', score: 92 },
];

const issueTypeData = [
  { type: 'Accuracy', count: 12 },
  { type: 'Completeness', count: 8 },
  { type: 'Consistency', count: 15 },
  { type: 'Timeliness', count: 6 },
  { type: 'Validity', count: 4 },
];

const recentIssues = [
  { id: 'DQ-2024-089', title: 'Missing TIN numbers in taxpayer records', status: 'critical', dept: 'DOMESTIC TAX', date: '2026-01-18' },
  { id: 'DQ-2024-088', title: 'Duplicate entries in customs declarations', status: 'high', dept: 'CUSTOMS', date: '2026-01-17' },
  { id: 'DQ-2024-087', title: 'Inconsistent date formats in tax returns', status: 'medium', dept: 'DOMESTIC TAX', date: '2026-01-16' },
  { id: 'DQ-2024-086', title: 'API timeout errors in EBM integration', status: 'high', dept: 'IT', date: '2026-01-15' },
];

export function Dashboard({ user, onNavigate }: DashboardProps) {
  const isAdmin = user.role === 'admin';
  const filteredIssues = isAdmin ? recentIssues : recentIssues.filter(i => i.dept === user.department);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          {isAdmin ? 'System-wide overview' : `${user.department} Department overview`}
        </p>
      </div>

      {/* Alert Banner */}
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-md">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-orange-900">3 Critical Issues Require Attention</h3>
            <p className="text-sm text-orange-700 mt-1">
              There are critical data quality issues that need immediate resolution.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#20603D]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
              Data Quality Score
              <TrendingUp className="w-4 h-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#20603D]">92%</div>
            <p className="text-xs text-green-600 mt-1">+2% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#E5BE01]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
              Open Issues
              <AlertCircle className="w-4 h-4 text-orange-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#E5BE01]">{isAdmin ? '45' : '18'}</div>
            <p className="text-xs text-gray-500 mt-1">{isAdmin ? 'All departments' : user.department}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#00A1DE]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
              Resolved This Month
              <CheckCircle className="w-4 h-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#00A1DE]">{isAdmin ? '127' : '45'}</div>
            <p className="text-xs text-blue-600 mt-1">+15% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
              Critical Issues
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{isAdmin ? '7' : '3'}</div>
            <p className="text-xs text-red-600 mt-1">Requires immediate action</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#20603D]" />
              Data Quality Trend (6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={qualityTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#20603D" 
                  strokeWidth={3}
                  name="Quality Score (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Issue Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-[#00A1DE]" />
              Issues by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={issueTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#00A1DE" name="Number of Issues" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#20603D]" />
              Recent Issues
            </span>
            <Button variant="outline" size="sm" className="text-[#00A1DE] border-[#00A1DE]">
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredIssues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <Badge variant="outline" className="font-mono text-xs">
                    {issue.id}
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{issue.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {issue.dept} • {issue.date}
                    </p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(issue.status)} text-white capitalize`}>
                  {issue.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-auto py-4 bg-[#20603D] hover:bg-[#20603D]/90"
              onClick={() => onNavigate?.('issue-reporting')}
            >
              <FileText className="w-5 h-5 mr-2" />
              Report New Issue
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 border-[#00A1DE] text-[#00A1DE]"
              onClick={() => onNavigate?.('data-validation')}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Run Data Validation
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-4 border-[#E5BE01] text-[#E5BE01]"
              onClick={() => onNavigate?.('reporting')}
            >
              <Activity className="w-5 h-5 mr-2" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}