import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { useEffect, useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { History, Search } from 'lucide-react';
import { AuditLog } from '../types';

function auditRoleLabel(role?: string) {
  if (!role) return '—';
  if (role === 'STAFF') return 'Member';
  return role;
}

/** Skip pure sign-in / session noise; focus on issue workflow and comments. */
function isNoiseAction(action: string): boolean {
  const u = action.toUpperCase();
  return u.includes('LOGIN') || u.includes('LOGOUT') || u === 'SESSION' || u.includes('VIEW_AUDIT');
}

function filterLogsByRole(
  logs: AuditLog[],
  role: string | undefined,
  department: string | undefined,
  issuesDepartmentMap: Map<string, string>,
  userDeptById: Map<string, string>,
): AuditLog[] {
  if (role !== 'HOD' || !department) return logs;
  return logs.filter((log) => {
    if (log.issueId) {
      const issueDept = issuesDepartmentMap.get(log.issueId);
      if (issueDept === department) return true;
    }
    const actorDept = userDeptById.get(log.userId);
    return actorDept === department;
  });
}

export function AuditHistoryPage() {
  const { currentUser, auditLogs, issues, users, loadAuditLogs } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  useEffect(() => {
    if (!currentUser) return;
    void loadAuditLogs();
  }, [currentUser?.id]);

  if (!currentUser) return null;

  const issuesDepartmentMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const i of issues) m.set(i.id, i.department);
    return m;
  }, [issues]);

  const userDeptById = useMemo(() => {
    const m = new Map<string, string>();
    for (const u of users) m.set(u.id, u.department);
    return m;
  }, [users]);

  const scopeLogs = useMemo(
    () =>
      filterLogsByRole(
        auditLogs.filter((log) => !isNoiseAction(log.action)),
        currentUser.role,
        currentUser.department,
        issuesDepartmentMap,
        userDeptById,
      ),
    [auditLogs, currentUser.role, currentUser.department, issuesDepartmentMap, userDeptById],
  );

  const filteredLogs = scopeLogs
    .filter((log) => {
      const q = searchTerm.toLowerCase();
      const details = (log.details || '').toLowerCase();
      const matchesSearch =
        details.includes(q) ||
        log.userName.toLowerCase().includes(q) ||
        (log.userRole && log.userRole.toLowerCase().includes(q)) ||
        log.action.toLowerCase().includes(q) ||
        (log.issueId && log.issueId.includes(q));
      const matchesAction = filterAction === 'ALL' || log.action === filterAction;
      return matchesSearch && matchesAction;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const actionTypes = [...new Set(scopeLogs.map((log) => log.action))];

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'bg-green-100 text-green-700 border-green-200';
    if (action.includes('UPDATE') || action.includes('ASSIGN')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (action.includes('DELETE')) return 'bg-red-100 text-red-700 border-red-200';
    if (action.includes('LOGIN')) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (action.includes('RESOLVED') || action.includes('CLOSED')) return 'bg-green-100 text-green-700 border-green-200';
    if (action.includes('COMMENT')) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">History</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {currentUser.role === 'HOD'
            ? `What happened in ${currentUser.department}: comments, cases (issues), assignments, and updates`
            : 'Comments, cases (issues), assignments, and other updates across the organisation'}
        </p>
        <p className="text-sm text-gray-600 mt-3 leading-relaxed max-w-3xl">
          Review who did what and when. Sign-in noise is hidden; use search to find a person, case, or type of change.
        </p>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Search</Label>
            <div className="relative mt-1">
              <Search className="w-3 h-3 absolute left-2 top-2.5 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by person, comment text, issue, action…"
                className="pl-7 h-8 text-sm"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Filter by type</Label>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="mt-1 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All types</SelectItem>
                {actionTypes.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="p-3 bg-gray-50 border-b flex items-center gap-2">
          <History className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-semibold">Recent events</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-100 border-b text-left text-gray-600">
              <tr>
                <th className="px-3 py-2 font-semibold">User</th>
                <th className="px-3 py-2 font-semibold">Role</th>
                <th className="px-3 py-2 font-semibold">Action</th>
                <th className="px-3 py-2 font-semibold">Description</th>
                <th className="px-3 py-2 font-semibold">Case</th>
                <th className="px-3 py-2 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 align-top">
                  <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">{log.userName}</td>
                  <td className="px-3 py-2 text-gray-700 whitespace-nowrap">{auditRoleLabel(log.userRole)}</td>
                  <td className="px-3 py-2">
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getActionColor(log.action)}`}>
                      {log.action.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-gray-700 max-w-md break-words">{log.details || '—'}</td>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{log.issueId ? `#${log.issueId}` : '—'}</td>
                  <td className="px-3 py-2 text-gray-500 whitespace-nowrap">
                    <span className="block">{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</span>
                    <span className="text-[10px] text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLogs.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8 px-3">No activity matches your filters.</p>
        )}
      </Card>
    </div>
  );
}
