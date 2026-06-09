import React, { useState } from 'react';
import { User } from '@/app/App';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

interface IssueClassificationProps {
  user: User;
}

const ISSUE_TYPES = ['Accuracy', 'Completeness', 'Consistency', 'Timeliness', 'Validity', 'Uniqueness'];
const SEVERITIES = ['Critical', 'High', 'Medium', 'Low'];
const ROOT_CAUSES = [
  'Data Entry Error',
  'System Integration Failure',
  'Incomplete Data Migration',
  'Validation Rule Missing',
  'Business Process Issue',
  'Technical Infrastructure',
  'Human Error',
  'External Data Source'
];
const COMPLIANCE_TAGS = [
  'GDPR Compliance',
  'Tax Regulation',
  'Financial Reporting',
  'Internal Audit',
  'Data Privacy',
  'Cybersecurity',
  'ISO Standards'
];

export function IssueClassification({ user }: IssueClassificationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    issueType: '',
    severity: '',
    rootCause: '',
    rootCauseNotes: '',
    complianceTags: [] as string[],
    businessImpact: 5,
    department: user.department,
  });

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep === 1 && !formData.issueType) {
      toast.error('Please select an issue type');
      return;
    }
    if (currentStep === 2 && (!formData.severity || !formData.rootCause)) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    toast.success('Issue classification completed successfully!');
    // Reset form
    setTimeout(() => {
      setCurrentStep(1);
      setFormData({
        issueType: '',
        severity: '',
        rootCause: '',
        rootCauseNotes: '',
        complianceTags: [],
        businessImpact: 5,
        department: user.department,
      });
    }, 1500);
  };

  const toggleComplianceTag = (tag: string) => {
    if (formData.complianceTags.includes(tag)) {
      setFormData({
        ...formData,
        complianceTags: formData.complianceTags.filter(t => t !== tag)
      });
    } else {
      setFormData({
        ...formData,
        complianceTags: [...formData.complianceTags, tag]
      });
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Issue Classification</h1>
        <p className="text-gray-600 mt-1">Classify and categorize data quality issues</p>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step === currentStep 
                      ? 'bg-[#20603D] text-white' 
                      : step < currentStep 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step < currentStep ? <CheckCircle className="w-6 h-6" /> : step}
                  </div>
                  {step < 4 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span className={currentStep === 1 ? 'font-semibold text-[#20603D]' : ''}>Type</span>
              <span className={currentStep === 2 ? 'font-semibold text-[#20603D]' : ''}>Severity & Root Cause</span>
              <span className={currentStep === 3 ? 'font-semibold text-[#20603D]' : ''}>Compliance</span>
              <span className={currentStep === 4 ? 'font-semibold text-[#20603D]' : ''}>Impact & Review</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Step {currentStep} of {totalSteps}: {
              currentStep === 1 ? 'Select Issue Type' :
              currentStep === 2 ? 'Severity & Root Cause' :
              currentStep === 3 ? 'Compliance & Regulations' :
              'Business Impact & Review'
            }
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Issue Type */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <Label>Select Issue Type <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ISSUE_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, issueType: type })}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.issueType === type
                        ? 'border-[#20603D] bg-[#20603D]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{type}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {type === 'Accuracy' && 'Incorrect data values'}
                      {type === 'Completeness' && 'Missing data elements'}
                      {type === 'Consistency' && 'Data conflicts'}
                      {type === 'Timeliness' && 'Outdated data'}
                      {type === 'Validity' && 'Invalid formats'}
                      {type === 'Uniqueness' && 'Duplicate records'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Severity & Root Cause */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="severity">Severity Level <span className="text-red-500">*</span></Label>
                <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
                  <SelectTrigger id="severity">
                    <SelectValue placeholder="Select severity level" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEVERITIES.map((sev) => (
                      <SelectItem key={sev} value={sev}>
                        <Badge className={`${
                          sev === 'Critical' ? 'bg-red-500' :
                          sev === 'High' ? 'bg-orange-500' :
                          sev === 'Medium' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        } text-white`}>
                          {sev}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rootCause">Root Cause Category <span className="text-red-500">*</span></Label>
                <Select value={formData.rootCause} onValueChange={(value) => setFormData({ ...formData, rootCause: value })}>
                  <SelectTrigger id="rootCause">
                    <SelectValue placeholder="Select root cause" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOT_CAUSES.map((cause) => (
                      <SelectItem key={cause} value={cause}>{cause}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rootCauseNotes">Root Cause Details</Label>
                <Textarea 
                  id="rootCauseNotes"
                  placeholder="Provide detailed explanation of the root cause..."
                  rows={4}
                  value={formData.rootCauseNotes}
                  onChange={(e) => setFormData({ ...formData, rootCauseNotes: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 3: Compliance Tags */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <Label>Compliance & Regulation Tags</Label>
              <p className="text-sm text-gray-600">Select all applicable compliance requirements</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {COMPLIANCE_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleComplianceTag(tag)}
                    className={`p-3 border-2 rounded-lg text-sm transition-all ${
                      formData.complianceTags.includes(tag)
                        ? 'border-[#00A1DE] bg-[#00A1DE]/10 text-[#00A1DE] font-medium'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {formData.complianceTags.includes(tag) && (
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                    )}
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Business Impact & Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Business Impact Score</Label>
                <div className="space-y-3">
                  <Input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={formData.businessImpact}
                    onChange={(e) => setFormData({ ...formData, businessImpact: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Low Impact (1)</span>
                    <span className="font-semibold text-lg text-[#20603D]">{formData.businessImpact}</span>
                    <span>High Impact (10)</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg space-y-4 border">
                <h3 className="font-semibold text-lg text-gray-900">Classification Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Issue Type</p>
                    <p className="font-medium text-gray-900">{formData.issueType || 'Not selected'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Severity</p>
                    <Badge className={`${
                      formData.severity === 'Critical' ? 'bg-red-500' :
                      formData.severity === 'High' ? 'bg-orange-500' :
                      formData.severity === 'Medium' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    } text-white`}>
                      {formData.severity || 'Not selected'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Root Cause</p>
                    <p className="font-medium text-gray-900">{formData.rootCause || 'Not selected'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-medium text-gray-900">{formData.department}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Compliance Tags</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.complianceTags.length > 0 ? (
                        formData.complianceTags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-[#00A1DE] border-[#00A1DE]">
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">None selected</span>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Business Impact</p>
                    <p className="font-medium text-gray-900">{formData.businessImpact} / 10</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button 
          onClick={handleBack}
          variant="outline"
          disabled={currentStep === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        {currentStep < totalSteps ? (
          <Button 
            onClick={handleNext}
            className="bg-[#20603D] hover:bg-[#20603D]/90"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleFinish}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Finish Classification
          </Button>
        )}
      </div>
    </div>
  );
}
