import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '@/services/commentService';
import { Loader2, Check, Trash2, MessageCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const CommentsManagement = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments-admin', filter],
    queryFn: () => {
      if (filter === 'all') {
        return commentService.getAllComments();
      }
      return commentService.getAllComments({
        approved: filter === 'approved'
      });
    },
  });

  const approveMutation = useMutation({
    mutationFn: (commentId: string) => commentService.approveComment(commentId),
    onSuccess: () => {
      toast.success('Comment approved successfully');
      queryClient.invalidateQueries({ queryKey: ['comments-admin'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to approve comment');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(commentId),
    onSuccess: () => {
      toast.success('Comment deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['comments-admin'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    },
  });

  const pendingCount = comments.filter(c => !c.approved).length;
  const approvedCount = comments.filter(c => c.approved).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Comments</h1>
          <p className="font-body text-muted-foreground">
            Manage and moderate blog post comments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-body text-sm text-muted-foreground">
            {pendingCount} pending • {approvedCount} approved
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-body text-sm font-medium transition-colors relative ${
            filter === 'all'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          All ({comments.length})
          {filter === 'all' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 font-body text-sm font-medium transition-colors relative ${
            filter === 'pending'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Pending ({pendingCount})
          {filter === 'pending' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 font-body text-sm font-medium transition-colors relative ${
            filter === 'approved'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Approved ({approvedCount})
          {filter === 'approved' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="font-body text-muted-foreground mb-2">
            {filter === 'pending'
              ? 'No pending comments'
              : filter === 'approved'
              ? 'No approved comments yet'
              : 'No comments yet'}
          </p>
          <p className="font-body text-sm text-muted-foreground">
            Comments from blog posts will appear here
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="divide-y divide-border">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="p-6 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-body font-semibold text-foreground">
                        {comment.name}
                      </h3>
                      <span className="font-body text-sm text-muted-foreground">
                        {comment.email}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        comment.approved
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {comment.approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    <p className="font-body text-sm text-muted-foreground mb-3">
                      {format(new Date(comment.createdAt), 'MMMM dd, yyyy · HH:mm')}
                    </p>
                    <p className="font-body text-foreground whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {!comment.approved && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
                        onClick={() => approveMutation.mutate(comment._id)}
                        disabled={approveMutation.isPending}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this comment?')) {
                          deleteMutation.mutate(comment._id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsManagement;
