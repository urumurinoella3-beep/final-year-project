import React, { useState } from 'react';
import { User } from '@/app/App';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Plug, CheckCircle, XCircle, RefreshCw, Key, Webhook, Shield, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface IntegrationProps {
  user: User;
}

interface SystemConnection {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  endpoint: string;
  method: string;
}

const SYSTEM_CONNECTIONS: SystemConnection[] = [
  { id: '1', name: 'Tax Management System', status: 'connected', lastSync: '2 mins ago', endpoint: '/api/tax/sync', method: 'POST' },
  { id: '2', name: 'EBM (Electronic Billing)', status: 'connected', lastSync: '5 mins ago', endpoint: '/api/ebm/data', method: 'GET' },
  { id: '3', name: 'Customs System', status: 'connected', lastSync: '3 mins ago', endpoint: '/api/customs/import', method: 'POST' },
  { id: '4', name: 'ASYCUDA World', status: 'error', lastSync: '15 mins ago', endpoint: '/api/asycuda/sync', method: 'POST' },
  { id: '5', name: 'HR Portal', status: 'connected', lastSync: '10 mins ago', endpoint: '/api/hr/employees', method: 'GET' },
  { id: '6', name: 'Financial System', status: 'disconnected', lastSync: '1 hour ago', endpoint: '/api/finance/transactions', method: 'GET' },
];

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  status: 'active' | 'inactive';
}

const API_KEYS: ApiKey[] = [
  { id: '1', name: 'Tax System Integration', key: 'dqims_live_abc123...xyz789', created: '2026-01-10', lastUsed: '2 mins ago', status: 'active' },
  { id: '2', name: 'EBM Data Sync', key: 'dqims_live_def456...uvw012', created: '2026-01-12', lastUsed: '5 mins ago', status: 'active' },
  { id: '3', name: 'Customs Integration', key: 'dqims_live_ghi789...rst345', created: '2026-01-15', lastUsed: '3 mins ago', status: 'active' },
  { id: '4', name: 'Test Environment Key', key: 'dqims_test_jkl012...pqr678', created: '2026-01-08', lastUsed: 'Never', status: 'inactive' },
];

const SYNC_LOGS = [
  { time: '2026-01-20 14:30:15', system: 'Tax Management System', status: 'success', records: 1234, duration: '2.3s' },
  { time: '2026-01-20 14:25:42', system: 'EBM System', status: 'success', records: 567, duration: '1.8s' },
  { time: '2026-01-20 14:20:33', system: 'Customs System', status: 'success', records: 890, duration: '3.1s' },
  { time: '2026-01-20 14:15:18', system: 'ASYCUDA World', status: 'error', records: 0, duration: '0.5s' },
  { time: '2026-01-20 14:10:05', system: 'HR Portal', status: 'success', records: 345, duration: '1.2s' },
];

export function Integration({ user }: IntegrationProps) {
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [showWebhookDialog, setShowWebhookDialog] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');

  const isAdmin = user.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Admin Access Required</h3>
            <p className="text-gray-600">Only administrators can access Integration & API settings.</p>
            <p className="text-sm text-gray-500 mt-2">Contact your system administrator for access.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleTestConnection = (systemName: string) => {
    toast.success(`Testing connection to ${systemName}...`);
  };

  const handleSync = (systemName: string) => {
    toast.success(`Syncing data with ${systemName}...`);
  };

  const handleGenerateApiKey = () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name');
      return;
    }
    toast.success('API key generated successfully');
    setShowApiKeyDialog(false);
    setNewKeyName('');
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard');
  };

  const handleCreateWebhook = () => {
    if (!webhookUrl.trim()) {
      toast.error('Please enter a webhook URL');
      return;
    }
    toast.success('Webhook created successfully');
    setShowWebhookDialog(false);
    setWebhookUrl('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'disconnected':
        return <XCircle className="w-5 h-5 text-gray-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Integration & API</h1>
        <p className="text-gray-600 mt-1">Manage system integrations and API connections</p>
      </div>

      <Tabs defaultValue="connections" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-3xl">
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="logs">Sync Logs</TabsTrigger>
        </TabsList>

        {/* System Connections Tab */}
        <TabsContent value="connections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plug className="w-5 h-5 text-[#20603D]" />
                System Connectivity Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SYSTEM_CONNECTIONS.map((system) => (
                  <Card key={system.id} className="border-2">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm">{system.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">Last sync: {system.lastSync}</p>
                        </div>
                        {getStatusIcon(system.status)}
                      </div>

                      <div className="pt-2 border-t">
                        <Badge 
                          className={`${
                            system.status === 'connected' ? 'bg-green-500' :
                            system.status === 'disconnected' ? 'bg-gray-500' :
                            'bg-red-500'
                          } text-white w-full justify-center`}
                        >
                          {system.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 text-xs"
                          onClick={() => handleTestConnection(system.name)}
                        >
                          Test
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 text-xs"
                          onClick={() => handleSync(system.name)}
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Sync
                        </Button>
                      </div>

                      <div className="text-xs text-gray-500 pt-2 border-t space-y-1">
                        <div className="flex justify-between">
                          <span>Endpoint:</span>
                          <span className="font-mono">{system.endpoint}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Method:</span>
                          <Badge variant="outline" className="text-xs">{system.method}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Connection Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {SYSTEM_CONNECTIONS.filter(s => s.status === 'connected').length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Active Connections</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-gray-500">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-gray-600">
                  {SYSTEM_CONNECTIONS.filter(s => s.status === 'disconnected').length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Disconnected</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-red-600">
                  {SYSTEM_CONNECTIONS.filter(s => s.status === 'error').length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Errors</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#00A1DE]" />
                  API Keys Management
                </CardTitle>
                <Button onClick={() => setShowApiKeyDialog(true)} className="bg-[#20603D] hover:bg-[#20603D]/90">
                  <Key className="w-4 h-4 mr-2" />
                  Generate New Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Name</TableHead>
                      <TableHead>API Key</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {API_KEYS.map((apiKey) => (
                      <TableRow key={apiKey.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{apiKey.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {apiKey.key}
                            </code>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleCopyKey(apiKey.key)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{apiKey.created}</TableCell>
                        <TableCell className="text-sm text-gray-600">{apiKey.lastUsed}</TableCell>
                        <TableCell>
                          <Badge className={apiKey.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                            {apiKey.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="text-red-600">
                            Revoke
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900">Security Notice</h4>
                  <p className="text-sm text-yellow-800 mt-1">
                    Keep your API keys secure. Never share them publicly or commit them to version control. 
                    Rotate keys regularly and revoke any compromised keys immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="w-5 h-5 text-[#E5BE01]" />
                  Webhook Configuration
                </CardTitle>
                <Button onClick={() => setShowWebhookDialog(true)} variant="outline" className="border-[#00A1DE] text-[#00A1DE]">
                  <Webhook className="w-4 h-4 mr-2" />
                  Add Webhook
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Webhook className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">No webhooks configured</p>
                  <p className="text-sm text-gray-500">
                    Set up webhooks to receive real-time notifications about data quality events
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Available Webhook Events</h4>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>• <code className="bg-blue-100 px-1 rounded">issue.created</code> - New issue reported</li>
                    <li>• <code className="bg-blue-100 px-1 rounded">issue.assigned</code> - Issue assigned to user</li>
                    <li>• <code className="bg-blue-100 px-1 rounded">issue.resolved</code> - Issue marked as resolved</li>
                    <li>• <code className="bg-blue-100 px-1 rounded">validation.completed</code> - Data validation finished</li>
                    <li>• <code className="bg-blue-100 px-1 rounded">quality.threshold</code> - Quality score threshold breach</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sync Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[#20603D]" />
                Synchronization Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Timestamp</TableHead>
                      <TableHead>System</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SYNC_LOGS.map((log, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-xs text-gray-600">{log.time}</TableCell>
                        <TableCell className="font-medium">{log.system}</TableCell>
                        <TableCell>
                          <Badge className={log.status === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{log.records.toLocaleString()}</TableCell>
                        <TableCell className="text-sm text-gray-600">{log.duration}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-[#20603D]">4,036</div>
                <div className="text-sm text-gray-600 mt-1">Total Records Synced</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-green-600">4</div>
                <div className="text-sm text-gray-600 mt-1">Successful Syncs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-red-600">1</div>
                <div className="text-sm text-gray-600 mt-1">Failed Syncs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-blue-600">1.8s</div>
                <div className="text-sm text-gray-600 mt-1">Avg Duration</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Generate API Key Dialog */}
      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate New API Key</DialogTitle>
            <DialogDescription>Create a new API key for system integration</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="keyName">Key Name / Description</Label>
              <Input
                id="keyName"
                placeholder="e.g., Tax System Integration"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleGenerateApiKey} className="flex-1 bg-[#20603D] hover:bg-[#20603D]/90">
                <Key className="w-4 h-4 mr-2" />
                Generate Key
              </Button>
              <Button variant="outline" onClick={() => setShowApiKeyDialog(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Webhook Dialog */}
      <Dialog open={showWebhookDialog} onOpenChange={setShowWebhookDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Webhook</DialogTitle>
            <DialogDescription>Configure a webhook endpoint for event notifications</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                placeholder="https://your-domain.com/webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleCreateWebhook} className="flex-1 bg-[#00A1DE] hover:bg-[#00A1DE]/90">
                <Webhook className="w-4 h-4 mr-2" />
                Create Webhook
              </Button>
              <Button variant="outline" onClick={() => setShowWebhookDialog(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
