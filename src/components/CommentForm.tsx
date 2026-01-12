import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '@/services/commentService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

interface CommentFormProps {
  postId: string;
}

const CommentForm = ({ postId }: CommentFormProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => commentService.createComment(postId, data),
    onSuccess: () => {
      toast.success('Comment submitted! It will appear after approval.');
      setFormData({ name: '', email: '', content: '' });
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit comment');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.content) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.content.length < 3) {
      toast.error('Comment must be at least 3 characters long');
      return;
    }

    createMutation.mutate(formData);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-4">Leave a Comment</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
              required
              disabled={createMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
              disabled={createMutation.isPending}
            />
            <p className="text-xs text-muted-foreground">
              Your email will not be published
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Comment *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Share your thoughts..."
            rows={4}
            required
            disabled={createMutation.isPending}
          />
        </div>

        <Button type="submit" disabled={createMutation.isPending} className="gap-2">
          {createMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Comment
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default CommentForm;
