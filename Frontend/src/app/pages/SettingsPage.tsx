import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { User, Lock, Bell, Settings as SettingsIcon, Save } from 'lucide-react';

export function SettingsPage() {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    issueAssignments: true,
    issueUpdates: true,
    weeklyReports: false,
  });

  const [systemSettings, setSystemSettings] = useState({
    autoAssign: false,
    defaultPriority: 'MEDIUM',
    sessionTimeout: 30,
  });

  if (!currentUser || currentUser.role !== 'ADMIN') {
    navigate('/dashboard');
    return null;
  }

  const handleSaveProfile = () => {
    if (currentUser) {
      updateUser(currentUser.id, profileData);
      alert('Profile updated successfully!');
    }
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters!');
      return;
    }
    alert('Password changed successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleSaveNotifications = () => {
    alert('Notification settings saved!');
  };

  const handleSaveSystemSettings = () => {
    alert('System settings saved!');
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-xs text-gray-500 mt-0.5">Manage your account and system preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="text-xs">
            <User className="w-3 h-3 mr-1" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="password" className="text-xs">
            <Lock className="w-3 h-3 mr-1" />
            Password
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs">
            <Bell className="w-3 h-3 mr-1" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="text-xs">
            <SettingsIcon className="w-3 h-3 mr-1" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-4">Profile Settings</h3>
            <div className="space-y-3 max-w-xl">
              <div>
                <Label className="text-xs">Full Name</Label>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="mt-1 h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Email Address</Label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="mt-1 h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Phone Number</Label>
                <Input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="+250788123456"
                  className="mt-1 h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Employee ID</Label>
                <Input
                  value={currentUser.employeeId}
                  disabled
                  className="mt-1 h-8 text-sm bg-gray-50"
                />
              </div>
              <div>
                <Label className="text-xs">Role</Label>
                <Input
                  value={currentUser.role}
                  disabled
                  className="mt-1 h-8 text-sm bg-gray-50"
                />
              </div>
              <div>
                <Label className="text-xs">Department</Label>
                <Input
                  value={currentUser.department}
                  disabled
                  className="mt-1 h-8 text-sm bg-gray-50"
                />
              </div>
              <Button
                size="sm"
                onClick={handleSaveProfile}
                className="bg-[#20603D] hover:bg-[#1a4d31] h-8"
              >
                <Save className="w-3 h-3 mr-1" />
                Save Profile
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-4">Change Password</h3>
            <div className="space-y-3 max-w-xl">
              <div className="p-3 bg-blue-50 rounded text-xs text-blue-900">
                <p className="font-medium mb-1">Password Requirements:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>At least 8 characters long</li>
                  <li>Must include uppercase and lowercase letters</li>
                  <li>Must include at least one number</li>
                  <li>Must include at least one special character</li>
                </ul>
              </div>
              <div>
                <Label className="text-xs">Current Password</Label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="mt-1 h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">New Password</Label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="mt-1 h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Confirm New Password</Label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="mt-1 h-8 text-sm"
                />
              </div>
              <Button
                size="sm"
                onClick={handleChangePassword}
                className="bg-[#20603D] hover:bg-[#1a4d31] h-8"
              >
                <Lock className="w-3 h-3 mr-1" />
                Change Password
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-4">Notification Preferences</h3>
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="text-xs font-medium">Email Notifications</p>
                  <p className="text-xs text-gray-500">Receive notifications via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="text-xs font-medium">Issue Assignments</p>
                  <p className="text-xs text-gray-500">Notify when an issue is assigned to you</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.issueAssignments}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      issueAssignments: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="text-xs font-medium">Issue Updates</p>
                  <p className="text-xs text-gray-500">Notify when issues you're involved in are updated</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.issueUpdates}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      issueUpdates: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="text-xs font-medium">Weekly Reports</p>
                  <p className="text-xs text-gray-500">Receive weekly summary reports</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.weeklyReports}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      weeklyReports: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
              </div>
              <Button
                size="sm"
                onClick={handleSaveNotifications}
                className="bg-[#20603D] hover:bg-[#1a4d31] h-8"
              >
                <Save className="w-3 h-3 mr-1" />
                Save Preferences
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-4">System Settings</h3>
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="text-xs font-medium">Auto-Assign Issues</p>
                  <p className="text-xs text-gray-500">Automatically assign new issues to available staff</p>
                </div>
                <input
                  type="checkbox"
                  checked={systemSettings.autoAssign}
                  onChange={(e) =>
                    setSystemSettings({
                      ...systemSettings,
                      autoAssign: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
              </div>
              <div>
                <Label className="text-xs">Default Priority Level</Label>
                <select
                  value={systemSettings.defaultPriority}
                  onChange={(e) =>
                    setSystemSettings({
                      ...systemSettings,
                      defaultPriority: e.target.value,
                    })
                  }
                  className="mt-1 w-full h-8 text-sm border border-gray-300 rounded px-2"
                >
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">Session Timeout (minutes)</Label>
                <Input
                  type="number"
                  value={systemSettings.sessionTimeout}
                  onChange={(e) =>
                    setSystemSettings({
                      ...systemSettings,
                      sessionTimeout: parseInt(e.target.value),
                    })
                  }
                  min="5"
                  max="120"
                  className="mt-1 h-8 text-sm"
                />
              </div>
              <Button
                size="sm"
                onClick={handleSaveSystemSettings}
                className="bg-[#20603D] hover:bg-[#1a4d31] h-8"
              >
                <Save className="w-3 h-3 mr-1" />
                Save Settings
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
