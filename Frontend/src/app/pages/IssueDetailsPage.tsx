import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Comment, Issue } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, MessageSquare, Paperclip, Download, User, Calendar, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function IssueDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, issues, users, updateIssue, addComment, fetchIssueComments } = useAuth();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    const found = id ? issues.find((i) => i.id === id) : undefined;
    if (!found) {
      setIssue(null);
      return;
    }
    setIssue(found);
    if (currentUser.role === 'STAFF' && found.status === 'OPEN' && found.assignedTo === currentUser.id) {
      void updateIssue(found.id, { status: 'IN_PROGRESS' });
    }
  }, [id, issues, currentUser?.id]);

  useEffect(() => {
    if (!id || !currentUser) return;
    let cancelled = false;
    void (async () => {
      try {
        const c = await fetchIssueComments(id);
        if (!cancelled) setComments(c);
      } catch {
        if (!cancelled) setComments([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, currentUser?.id]);

  useEffect(() => {
    if (location.hash !== '#comments') return;
    const el = document.getElementById('comments');
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }, [location.hash, issue?.id]);

  if (!currentUser || !issue) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Issue not found</p>
      </div>
    );
  }

  const departmentStaffs = currentUser.role === 'HOD' 
    ? users.filter((u) => u.department === currentUser.department && u.role === 'STAFF')
    : users.filter((u) => u.role === 'STAFF');

  const refreshComments = async () => {
    if (!id) return;
    const c = await fetchIssueComments(id);
    setComments(c);
  };

  const handleStatusChange = async (newStatus: string) => {
    await updateIssue(issue.id, { status: newStatus as any });
    await refreshComments();
  };

  const handlePriorityChange = async (newPriority: string) => {
    await updateIssue(issue.id, { priority: newPriority as any });
    await refreshComments();
  };

  const handleAssignChange = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      await updateIssue(issue.id, {
        assignedTo: userId,
        assignedToName: user.name,
      });
      await refreshComments();
    }
  };

  const handleAddComment = async () => {
    if (commentText.trim()) {
      await addComment(issue.id, commentText);
      setCommentText('');
      await refreshComments();
    }
  };

  const handleResolve = async () => {
    await handleStatusChange('RESOLVED');
  };

  const handleClose = async () => {
    await handleStatusChange('CLOSED');
  };

  const handleReopen = async () => {
    await handleStatusChange('OPEN');
  };

  const canChangeStatus = currentUser.role === 'STAFF' || currentUser.role === 'HOD';
  const canClose = currentUser.role === 'HOD';
  const canAssign = currentUser.role === 'HOD';

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/issues')}
            className="h-9 shrink-0"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to issues
          </Button>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[#20603D]">Issue</p>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">#{issue.id}</h1>
            <p className="text-sm text-gray-600 mt-1 max-w-3xl">{issue.title}</p>
            <p className="text-xs text-gray-500 mt-1">
              Created {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canChangeStatus && issue.status === 'IN_PROGRESS' && (
            <Button
              size="sm"
              onClick={handleResolve}
              className="bg-green-600 hover:bg-green-700 h-8"
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Mark as Resolved
            </Button>
          )}
          {canClose && issue.status === 'RESOLVED' && (
            <Button
              size="sm"
              onClick={handleClose}
              className="bg-gray-600 hover:bg-gray-700 h-8"
            >
              <XCircle className="w-3 h-3 mr-1" />
              Close Issue
            </Button>
          )}
          {canClose && issue.status === 'CLOSED' && (
            <Button
              size="sm"
              onClick={handleReopen}
              className="bg-blue-600 hover:bg-blue-700 h-8"
            >
              <AlertCircle className="w-3 h-3 mr-1" />
              Reopen Issue
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Details */}
          <Card className="p-6 shadow-sm border border-gray-200/80">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{issue.description}</p>
            </div>
          </Card>

          {/* Comments */}
          <Card id="comments" className="p-6 shadow-sm border border-gray-200/80">
            <h3 className="text-base font-semibold mb-1 flex items-center gap-2 text-gray-900">
              <MessageSquare className="w-5 h-5 text-[#20603D]" />
              Discussion
            </h3>
            <p className="text-xs text-gray-500 mb-4">{comments.length} comment{comments.length !== 1 ? 's' : ''}</p>
            <div className="space-y-4 mb-5">
              {comments.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/80 px-4 py-8 text-center">
                  <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No comments yet. Start the thread below.</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 shrink-0 bg-[#20603D] rounded-full flex items-center justify-center ring-2 ring-[#20603D]/15">
                          <span className="text-sm text-white font-semibold">
                            {comment.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm font-semibold text-gray-900 block truncate">{comment.userName}</span>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap pl-0 sm:pl-12">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-stretch pt-2 border-t border-gray-100">
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a reply…"
                className="h-10 text-sm flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
              />
              <Button size="sm" onClick={handleAddComment} className="h-10 px-6 bg-[#20603D] hover:bg-[#1a4d31] shrink-0">
                Send
              </Button>
            </div>
          </Card>

          {/* Uploads (files submitted with this issue) */}
          {issue.attachments && issue.attachments.length > 0 && (
            <Card className="p-6 shadow-sm border border-gray-200/80">
              <h3 className="text-base font-semibold mb-1 flex items-center gap-2 text-gray-900">
                <Paperclip className="w-5 h-5 text-[#00A1DE]" />
                Uploads
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                {issue.attachments.length} file{issue.attachments.length !== 1 ? 's' : ''} attached to this issue
              </p>
              <div className="space-y-2">
                {issue.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50/90 px-4 py-3 hover:bg-gray-100/90 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#00A1DE]/10 text-[#00A1DE]">
                        <Paperclip className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 truncate">{file}</span>
                    </div>
                    <Button variant="outline" size="sm" className="h-9 shrink-0 border-[#20603D] text-[#20603D] hover:bg-[#20603D]/10">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <Card className="p-4">
            <h3 className="text-xs font-semibold text-gray-500 mb-2">STATUS</h3>
            {currentUser.role === 'STAFF' && issue.assignedTo === currentUser.id ? (
              <Select value={issue.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                </SelectContent>
              </Select>
            ) : currentUser.role === 'HOD' ? (
              <Select value={issue.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge
                variant="outline"
                className={`text-sm w-full justify-center py-1 ${
                  issue.status === 'OPEN'
                    ? 'bg-red-100 text-red-700 border-red-200'
                    : issue.status === 'IN_PROGRESS'
                    ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                    : issue.status === 'RESOLVED'
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                {issue.status.replace('_', ' ')}
              </Badge>
            )}
          </Card>

          {/* Priority */}
          <Card className="p-4">
            <h3 className="text-xs font-semibold text-gray-500 mb-2">PRIORITY</h3>
            {currentUser.role === 'HOD' ? (
              <Select value={issue.priority} onValueChange={handlePriorityChange}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge
                variant="outline"
                className={`text-sm w-full justify-center py-1 ${
                  issue.priority === 'HIGH'
                    ? 'bg-red-100 text-red-700 border-red-200'
                    : issue.priority === 'MEDIUM'
                    ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                    : 'bg-green-100 text-green-700 border-green-200'
                }`}
              >
                {issue.priority}
              </Badge>
            )}
          </Card>

          {/* Assigned To */}
          <Card className="p-4">
            <h3 className="text-xs font-semibold text-gray-500 mb-2">ASSIGNED TO</h3>
            {canAssign ? (
              <Select value={issue.assignedTo || ''} onValueChange={handleAssignChange}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  {departmentStaffs.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span>{issue.assignedToName || 'Unassigned'}</span>
              </div>
            )}
          </Card>

          {/* Department */}
          <Card className="p-4">
            <h3 className="text-xs font-semibold text-gray-500 mb-2">DEPARTMENT</h3>
            <p className="text-sm font-medium">{issue.department}</p>
          </Card>

          {/* Reported By */}
          <Card className="p-4">
            <h3 className="text-xs font-semibold text-gray-500 mb-2">REPORTED BY</h3>
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-gray-400" />
              <span>{issue.reportedByName}</span>
            </div>
          </Card>

          {/* Metadata */}
          <Card className="p-4">
            <h3 className="text-xs font-semibold text-gray-500 mb-3">DETAILS</h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-gray-500">Source:</span>
                <span className="ml-2 font-medium">{issue.source}</span>
              </div>
              <div>
                <span className="text-gray-500">Data Element:</span>
                <span className="ml-2 font-medium">{issue.dataElement}</span>
              </div>
              <div>
                <span className="text-gray-500">Issue Type:</span>
                <span className="ml-2 font-medium">{issue.issueType}</span>
              </div>
              <div>
                <span className="text-gray-500">Severity:</span>
                <span className="ml-2 font-medium">{issue.severity}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center gap-1 text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>Created:</span>
                </div>
                <span className="ml-4 text-gray-700">
                  {new Date(issue.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              {issue.resolvedAt && (
                <div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>Resolved:</span>
                  </div>
                  <span className="ml-4 text-gray-700">
                    {new Date(issue.resolvedAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
              {issue.closedAt && (
                <div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>Closed:</span>
                  </div>
                  <span className="ml-4 text-gray-700">
                    {new Date(issue.closedAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
