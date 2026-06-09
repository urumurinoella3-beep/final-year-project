import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { AlertCircle, CheckCircle, Clock, TrendingUp, Plus, FileText, Upload, BarChart3 } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#20603D', '#00A1DE', '#E5BE01', '#EF4444', '#8B5CF6'];

export function DashboardPage() {
  const { currentUser, issues, users, departments } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const filteredIssues = currentUser.role === 'ADMIN'
    ? issues
    : currentUser.role === 'HOD'
    ? issues.filter((i) => i.department === currentUser.department)
    : issues.filter((i) => i.assignedTo === currentUser.id);

  const totalIssues = filteredIssues.length;
  const openIssues = filteredIssues.filter((i) => i.status === 'OPEN').length;
  const inProgressIssues = filteredIssues.filter((i) => i.status === 'IN_PROGRESS').length;
  const resolvedIssues = filteredIssues.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
  const highPriorityIssues = filteredIssues.filter((i) => i.priority === 'HIGH').length;

  const issuesByDepartment = currentUser.role === 'ADMIN'
    ? departments.map((dept) => ({
        name: dept,
        count: issues.filter((i) => i.department === dept).length,
      }))
    : [];

  const issuesByStatus = [
    { name: 'Open', value: openIssues, color: '#EF4444' },
    { name: 'In Progress', value: inProgressIssues, color: '#E5BE01' },
    { name: 'Resolved', value: resolvedIssues, color: '#20603D' },
  ];

  const recentIssues = filteredIssues
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {currentUser.role === 'ADMIN' && 'System Overview'}
            {currentUser.role === 'HOD' && `${currentUser.department} Department Overview`}
            {currentUser.role === 'STAFF' && 'My Issues Overview'}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Welcome back, {currentUser.name}</p>
        </div>
        <Button
          size="sm"
          className="bg-[#20603D] hover:bg-[#1a4d31] h-8"
          onClick={() => navigate('/issues')}
        >
          <Plus className="w-3 h-3 mr-1" />
          Report Issue
        </Button>
      </div>

      <Card className="p-4 bg-gradient-to-r from-[#20603D] to-[#00A1DE]">
        <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="h-auto py-3 bg-white hover:bg-gray-50 border-white flex flex-col items-center gap-2"
            onClick={() => navigate('/issues')}
          >
            <Plus className="w-5 h-5 text-[#20603D]" />
            <span className="text-xs font-medium text-gray-900">Report Issue</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-3 bg-white hover:bg-gray-50 border-white flex flex-col items-center gap-2"
            onClick={() => navigate('/reports')}
          >
            <BarChart3 className="w-5 h-5 text-[#00A1DE]" />
            <span className="text-xs font-medium text-gray-900">Reports</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-3 bg-white hover:bg-gray-50 border-white flex flex-col items-center gap-2"
            onClick={() => navigate('/validation')}
          >
            <Upload className="w-5 h-5 text-[#E5BE01]" />
            <span className="text-xs font-medium text-gray-900">Data Validation</span>
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Issues</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalIssues}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Open</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{openIssues}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{inProgressIssues}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{resolvedIssues}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-700" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {currentUser.role === 'ADMIN' && issuesByDepartment.length > 0 && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Issues by Department</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={issuesByDepartment}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: '12px' }} />
                <Bar dataKey="count" fill="#20603D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        <Card className={`p-4 ${currentUser.role === 'ADMIN' ? '' : 'col-span-2'}`}>
          <h3 className="text-sm font-semibold mb-3">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={issuesByStatus}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {issuesByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
        <div className="space-y-2">
          {recentIssues.map((issue) => (
            <div
              key={issue.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-900">{issue.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {issue.department} • {issue.reportedByName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    issue.priority === 'HIGH'
                      ? 'bg-red-100 text-red-700'
                      : issue.priority === 'MEDIUM'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {issue.priority}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    issue.status === 'OPEN'
                      ? 'bg-red-100 text-red-700'
                      : issue.status === 'IN_PROGRESS'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {issue.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
