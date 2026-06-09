import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { User, Mail, Phone, Building2, Briefcase, Calendar, Save } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function ProfilePage() {
  const { currentUser, updateUser, issues } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });

  if (!currentUser) return null;

  const myIssues = issues.filter(
    (i) => i.reportedBy === currentUser.id || i.assignedTo === currentUser.id
  );
  const createdIssues = issues.filter((i) => i.reportedBy === currentUser.id);
  const assignedIssues = issues.filter((i) => i.assignedTo === currentUser.id);
  const resolvedIssues = myIssues.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED');

  const handleSaveProfile = () => {
    updateUser(currentUser.id, formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
          <p className="text-xs text-gray-500 mt-0.5">View and manage your profile information</p>
        </div>
        <Button
          size="sm"
          variant={isEditing ? 'outline' : 'default'}
          onClick={() => setIsEditing(!isEditing)}
          className={!isEditing ? 'bg-[#20603D] hover:bg-[#1a4d31] h-8' : 'h-8'}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 p-4 space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b">
            <div className="w-16 h-16 bg-gradient-to-br from-[#20603D] to-[#00A1DE] rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{currentUser.name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{currentUser.name}</h2>
              <p className="text-sm text-gray-600">{currentUser.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-[#20603D] text-white">{currentUser.role}</Badge>
                <Badge variant="outline">{currentUser.department}</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs flex items-center gap-1 mb-1">
                <User className="w-3 h-3" />
                Full Name
              </Label>
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-8 text-sm"
                />
              ) : (
                <p className="text-sm font-medium">{currentUser.name}</p>
              )}
            </div>
            <div>
              <Label className="text-xs flex items-center gap-1 mb-1">
                <Briefcase className="w-3 h-3" />
                Employee ID
              </Label>
              <p className="text-sm font-medium font-mono">{currentUser.employeeId}</p>
            </div>
            <div>
              <Label className="text-xs flex items-center gap-1 mb-1">
                <Mail className="w-3 h-3" />
                Email Address
              </Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-8 text-sm"
                />
              ) : (
                <p className="text-sm font-medium">{currentUser.email}</p>
              )}
            </div>
            <div>
              <Label className="text-xs flex items-center gap-1 mb-1">
                <Phone className="w-3 h-3" />
                Phone Number
              </Label>
              {isEditing ? (
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+250788123456"
                  className="h-8 text-sm"
                />
              ) : (
                <p className="text-sm font-medium">{currentUser.phone}</p>
              )}
            </div>
            <div>
              <Label className="text-xs flex items-center gap-1 mb-1">
                <Building2 className="w-3 h-3" />
                Department
              </Label>
              <p className="text-sm font-medium">{currentUser.department}</p>
            </div>
            <div>
              <Label className="text-xs flex items-center gap-1 mb-1">
                <User className="w-3 h-3" />
                Role
              </Label>
              <p className="text-sm font-medium">{currentUser.role}</p>
            </div>
          </div>

          {isEditing && (
            <div className="pt-4 border-t flex justify-end">
              <Button
                size="sm"
                onClick={handleSaveProfile}
                className="bg-[#20603D] hover:bg-[#1a4d31] h-8"
              >
                <Save className="w-3 h-3 mr-1" />
                Save Changes
              </Button>
            </div>
          )}
        </Card>

        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Activity Statistics</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">Issues Created</span>
                  <span className="font-bold text-blue-600">{createdIssues.length}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{
                      width: `${createdIssues.length > 0 ? Math.min((createdIssues.length / myIssues.length) * 100, 100) : 0}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">Assigned to Me</span>
                  <span className="font-bold text-yellow-600">{assignedIssues.length}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{
                      width: `${assignedIssues.length > 0 ? Math.min((assignedIssues.length / myIssues.length) * 100, 100) : 0}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">Resolved Issues</span>
                  <span className="font-bold text-green-600">{resolvedIssues.length}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${resolvedIssues.length > 0 ? Math.min((resolvedIssues.length / myIssues.length) * 100, 100) : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
            <div className="space-y-2">
              {myIssues.slice(0, 5).map((issue) => (
                <div key={issue.id} className="text-xs">
                  <p className="font-medium text-gray-900 truncate">{issue.title}</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 ${
                        issue.status === 'OPEN'
                          ? 'bg-red-100 text-red-700 border-red-200'
                          : issue.status === 'IN_PROGRESS'
                          ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                          : 'bg-green-100 text-green-700 border-green-200'
                      }`}
                    >
                      {issue.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-gray-400 text-[10px]">
                      {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
