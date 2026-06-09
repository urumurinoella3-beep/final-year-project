import React, { useState } from 'react';
import { User, Department } from '@/app/App';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface MonitoringProps {
  user: User;
}

const DEPARTMENTS: Department[] = ['DOMESTIC TAX', 'IT', 'CUSTOMS', 'TAX INVESTIGATIONS', 'HR', 'FINANCE'];

const qualityScoreData = [
  { date: '01/15', score: 88, threshold: 85 },
  { date: '01/16', score: 90, threshold: 85 },
  { date: '01/17', score: 87, threshold: 85 },
  { date: '01/18', score: 92, threshold: 85 },
  { date: '01/19', score: 91, threshold: 85 },
  { date: '01/20', score: 93, threshold: 85 },
];

const anomalyData = [
  { hour: '00:00', normal: 95, anomalies: 2 },
  { hour: '04:00', normal: 97, anomalies: 1 },
  { hour: '08:00', normal: 92, anomalies: 5 },
  { hour: '12:00', normal: 88, anomalies: 8 },
  { hour: '16:00', normal: 90, anomalies: 6 },
  { hour: '20:00', normal: 94, anomalies: 3 },
];

const datasets = [
  { name: 'Taxpayer Master Data', score: 95, status: 'excellent', records: 1234567, lastCheck: '2 mins ago' },
  { name: 'Tax Returns', score: 88, status: 'good', records: 456789, lastCheck: '5 mins ago' },
  { name: 'Payment Records', score: 92, status: 'excellent', records: 789123, lastCheck: '1 min ago' },
  { name: 'TIN Registry', score: 78, status: 'warning', records: 234567, lastCheck: '3 mins ago' },
  { name: 'Customs Declarations', score: 85, status: 'good', records: 123456, lastCheck: '4 mins ago' },
  { name: 'EBM Transactions', score: 65, status: 'critical', records: 567890, lastCheck: '10 mins ago' },
];

export function Monitoring({ user }: MonitoringProps) {
  const [selectedDept, setSelectedDept] = useState<Department>(user.department);
  const isAdmin = user.role === 'admin';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'good': return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Quality Monitoring</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring and quality scorecards</p>
        </div>
        {isAdmin && (
          <div className="w-64">
            <Select value={selectedDept} onValueChange={(value) => setSelectedDept(value as Department)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Real-time Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Systems Healthy</p>
                <p className="text-3xl font-bold text-green-600">12</p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Warning Alerts</p>
                <p className="text-3xl font-bold text-yellow-600">3</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Issues</p>
                <p className="text-3xl font-bold text-red-600">1</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality Score Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#20603D]" />
            Quality Score Trend (Last 6 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={qualityScoreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[75, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="threshold" 
                stroke="#E5BE01" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Quality Threshold"
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#20603D" 
                strokeWidth={3}
                name="Quality Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Dataset Scorecards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#00A1DE]" />
            Dataset Quality Scorecards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {datasets.map((dataset, index) => (
              <Card key={index} className="border-2">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{dataset.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {dataset.records.toLocaleString()} records
                      </p>
                    </div>
                    {getStatusIcon(dataset.status)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Quality Score</span>
                      <span className="text-2xl font-bold text-[#20603D]">{dataset.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getStatusColor(dataset.status)}`}
                        style={{ width: `${dataset.score}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <Badge className={`${getStatusColor(dataset.status)} text-white capitalize`}>
                      {dataset.status}
                    </Badge>
                    <span className="text-xs text-gray-500">{dataset.lastCheck}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Anomaly Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#E5BE01]" />
            Anomaly Detection (24 Hours)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={anomalyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="normal" 
                stackId="1"
                stroke="#20603D" 
                fill="#20603D"
                fillOpacity={0.6}
                name="Normal Operations"
              />
              <Area 
                type="monotone" 
                dataKey="anomalies" 
                stackId="2"
                stroke="#E5BE01" 
                fill="#E5BE01"
                fillOpacity={0.8}
                name="Anomalies Detected"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Threshold Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Active Threshold Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border-l-4 border-l-red-500 bg-red-50 rounded">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-semibold text-red-900">EBM Transactions - Critical</p>
                  <p className="text-sm text-red-700">Quality score dropped below 70% threshold</p>
                </div>
              </div>
              <Badge className="bg-red-600 text-white">CRITICAL</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border-l-4 border-l-yellow-500 bg-yellow-50 rounded">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-semibold text-yellow-900">TIN Registry - Warning</p>
                  <p className="text-sm text-yellow-700">Completeness score at 78%, below 85% target</p>
                </div>
              </div>
              <Badge className="bg-yellow-600 text-white">WARNING</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border-l-4 border-l-blue-500 bg-blue-50 rounded">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">Payment Records - Info</p>
                  <p className="text-sm text-blue-700">High data ingestion rate detected</p>
                </div>
              </div>
              <Badge className="bg-blue-600 text-white">INFO</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Monitoring Widgets */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Monitoring Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
              <Activity className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Custom Widget Area</p>
              <p className="text-xs">Drag and drop widgets to customize</p>
            </div>
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
              <Activity className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Custom Widget Area</p>
              <p className="text-xs">Drag and drop widgets to customize</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
