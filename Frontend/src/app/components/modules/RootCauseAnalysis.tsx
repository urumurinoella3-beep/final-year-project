import React, { useState } from 'react';
import { User } from '@/app/App';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { GitBranch, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface RootCauseAnalysisProps {
  user: User;
}

const FISHBONE_CATEGORIES = [
  { id: 'people', label: 'People', color: '#20603D' },
  { id: 'process', label: 'Process', color: '#00A1DE' },
  { id: 'technology', label: 'Technology', color: '#E5BE01' },
  { id: 'data', label: 'Data', color: '#8E44AD' },
  { id: 'environment', label: 'Environment', color: '#E74C3C' },
  { id: 'management', label: 'Management', color: '#3498DB' },
];

export function RootCauseAnalysis({ user }: RootCauseAnalysisProps) {
  const [selectedIssue, setSelectedIssue] = useState('DQ-2024-089');
  const [whyAnswers, setWhyAnswers] = useState(['', '', '', '', '']);
  const [fishboneFactors, setFishboneFactors] = useState<{ [key: string]: string[] }>({
    people: ['Insufficient training', 'Manual data entry errors'],
    process: ['No validation at entry', 'Inconsistent procedures'],
    technology: ['Legacy system limitations', 'No automated checks'],
    data: ['Incomplete source data', 'Format inconsistencies'],
    environment: [],
    management: ['Lack of data governance policy'],
  });
  const [solutions, setSolutions] = useState<string[]>([
    'Implement automated TIN validation at data entry point',
    'Provide comprehensive training for data entry staff',
    'Update data quality rules in the system',
  ]);
  const [preventiveActions, setPreventiveActions] = useState<Array<{ action: string; status: 'pending' | 'in-progress' | 'completed' }>>([
    { action: 'Deploy automated validation scripts', status: 'in-progress' },
    { action: 'Schedule quarterly data quality training', status: 'pending' },
    { action: 'Implement real-time data quality monitoring', status: 'pending' },
  ]);

  const [newSolution, setNewSolution] = useState('');
  const [newAction, setNewAction] = useState('');

  const handleWhyChange = (index: number, value: string) => {
    const newAnswers = [...whyAnswers];
    newAnswers[index] = value;
    setWhyAnswers(newAnswers);
  };

  const addSolution = () => {
    if (newSolution.trim()) {
      setSolutions([...solutions, newSolution]);
      setNewSolution('');
      toast.success('Solution added');
    }
  };

  const addPreventiveAction = () => {
    if (newAction.trim()) {
      setPreventiveActions([...preventiveActions, { action: newAction, status: 'pending' }]);
      setNewAction('');
      toast.success('Preventive action added');
    }
  };

  const updateActionStatus = (index: number, status: 'pending' | 'in-progress' | 'completed') => {
    const newActions = [...preventiveActions];
    newActions[index].status = status;
    setPreventiveActions(newActions);
    toast.success('Status updated');
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Root Cause Analysis</h1>
        <p className="text-gray-600 mt-1">Identify root causes and preventive measures</p>
      </div>

      {/* Issue Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label>Select Issue for Analysis</Label>
              <Select value={selectedIssue} onValueChange={setSelectedIssue}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DQ-2024-089">DQ-2024-089 - Missing TIN numbers</SelectItem>
                  <SelectItem value="DQ-2024-088">DQ-2024-088 - Duplicate customs entries</SelectItem>
                  <SelectItem value="DQ-2024-087">DQ-2024-087 - Date format inconsistency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Badge className="bg-[#20603D] text-white px-4 py-2">
              {user.department}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="fishbone" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="fishbone">Fishbone Diagram</TabsTrigger>
          <TabsTrigger value="five-whys">5 Whys Analysis</TabsTrigger>
          <TabsTrigger value="solutions">Solutions & Actions</TabsTrigger>
        </TabsList>

        {/* Fishbone Diagram Tab */}
        <TabsContent value="fishbone" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-[#20603D]" />
                Ishikawa (Fishbone) Diagram
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Problem Statement */}
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="font-semibold text-red-900">Problem Statement:</p>
                <p className="text-red-800 mt-1">Missing TIN numbers in taxpayer master data causing validation failures</p>
              </div>

              {/* Fishbone Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FISHBONE_CATEGORIES.map((category) => (
                  <Card key={category.id} className="border-l-4" style={{ borderLeftColor: category.color }}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span style={{ color: category.color }}>{category.label}</span>
                        <Button variant="ghost" size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {fishboneFactors[category.id]?.map((factor, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-700">{factor}</span>
                          </li>
                        ))}
                        {(!fishboneFactors[category.id] || fishboneFactors[category.id].length === 0) && (
                          <li className="text-sm text-gray-400 italic">No factors identified yet</li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Contributing Factors Summary */}
              <Card className="bg-blue-50">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-blue-900 mb-3">Contributing Factors Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {FISHBONE_CATEGORIES.map((category) => {
                      const count = fishboneFactors[category.id]?.length || 0;
                      return (
                        <div key={category.id} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                          <span className="text-sm text-gray-700">{category.label}: <strong>{count}</strong></span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5 Whys Tab */}
        <TabsContent value="five-whys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#00A1DE]" />
                5 Whys Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Initial Problem:</p>
                <p className="font-semibold text-gray-900 mt-1">Missing TIN numbers in taxpayer records</p>
              </div>

              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="space-y-2">
                  <Label htmlFor={`why-${num}`} className="text-base font-semibold">
                    Why #{num}: Why did this happen?
                  </Label>
                  <Textarea
                    id={`why-${num}`}
                    placeholder={`Enter reason #${num}...`}
                    value={whyAnswers[num - 1]}
                    onChange={(e) => handleWhyChange(num - 1, e.target.value)}
                    rows={2}
                    className="bg-white"
                  />
                </div>
              ))}

              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Root Cause Identified
                  </h4>
                  <p className="text-sm text-green-800">
                    Based on the 5 Whys analysis, the root cause is typically found in the last "Why" answer. 
                    This represents the fundamental issue that needs to be addressed to prevent recurrence.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Solutions & Actions Tab */}
        <TabsContent value="solutions" className="space-y-4">
          {/* Solution Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#20603D]" />
                Solution Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {solutions.map((solution, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-900">{solution}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Input
                  placeholder="Add new solution recommendation..."
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSolution()}
                />
                <Button onClick={addSolution} className="bg-[#20603D] hover:bg-[#20603D]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preventive Actions Tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-[#00A1DE]" />
                Preventive Actions Tracker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {preventiveActions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50">
                    <div className="flex-1">
                      <p className="text-gray-900">{action.action}</p>
                    </div>
                    <Select
                      value={action.status}
                      onValueChange={(value) => updateActionStatus(index, value as any)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">
                          <Badge className="bg-gray-500 text-white">Pending</Badge>
                        </SelectItem>
                        <SelectItem value="in-progress">
                          <Badge className="bg-blue-500 text-white">In Progress</Badge>
                        </SelectItem>
                        <SelectItem value="completed">
                          <Badge className="bg-green-500 text-white">Completed</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Input
                  placeholder="Add preventive action..."
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPreventiveAction()}
                />
                <Button onClick={addPreventiveAction} className="bg-[#00A1DE] hover:bg-[#00A1DE]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-gray-500">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-gray-600">
                  {preventiveActions.filter(a => a.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Pending</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {preventiveActions.filter(a => a.status === 'in-progress').length}
                </div>
                <div className="text-sm text-gray-600 mt-1">In Progress</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {preventiveActions.filter(a => a.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Completed</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
