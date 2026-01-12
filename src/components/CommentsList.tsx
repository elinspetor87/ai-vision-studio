import { useQuery } from '@tanstack/react-query';
import { commentService, Comment } from '@/services/commentService';
import { Loader2, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

interface CommentsListProps {
  postId: string;
}

const CommentsList = ({ postId }: CommentsListProps) => {
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentService.getCommentsByPost(postId),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h3>

      <div className="space-y-4">
        {comments.map((comment: Comment) => (
          <div
            key={comment._id}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-lg">{comment.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(comment.createdAt), 'MMMM dd, yyyy · HH:mm')}
                </p>
              </div>
            </div>
            <p className="text-foreground whitespace-pre-wrap">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsList;
