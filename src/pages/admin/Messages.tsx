import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactService } from '@/services/contactService';
import { Loader2, Mail, Calendar, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const Messages = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['contact-submissions', statusFilter],
    queryFn: () =>
      contactService.getAllSubmissions(statusFilter === 'all' ? undefined : statusFilter),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      contactService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['contact-stats'] });
      toast.success('Status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contactService.deleteSubmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['contact-stats'] });
      toast.success('Message deleted successfully');
      setDeletingId(null);
    },
    onError: (error: any) => {
      console.error('Delete error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to delete message';
      toast.error(errorMsg);
      setDeletingId(null);
    },
  });

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleDelete = (id: string) => {
    console.log('🗑️ Delete clicked for message ID:', id);
    setDeletingId(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Messages</h1>
          <p className="font-body text-muted-foreground">
            Contact form submissions and meeting requests
          </p>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Messages</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Messages List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !messages || messages.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl">
          <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-body text-muted-foreground">No messages found</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="divide-y divide-border">
            {messages.map((message) => (
              <div key={message._id} className="p-6 hover:bg-secondary/50 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-body font-semibold text-lg text-foreground">
                        {message.name}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-body font-medium ${message.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : message.status === 'contacted'
                            ? 'bg-blue-500/20 text-blue-500'
                            : message.status === 'completed'
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-red-500/20 text-red-500'
                          }`}
                      >
                        {message.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {message.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {message.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {message.time}
                      </span>
                    </div>

                    <p className="font-body text-foreground mb-4 whitespace-pre-wrap">
                      {message.message}
                    </p>

                    {message.notes && (
                      <div className="bg-secondary/50 border border-border rounded-lg p-3 mb-4">
                        <p className="font-body text-sm text-muted-foreground">
                          <span className="font-medium">Notes:</span> {message.notes}
                        </p>
                      </div>
                    )}

                    <p className="font-body text-xs text-muted-foreground">
                      Submitted {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    {deletingId === message._id ? (
                      <div className="flex items-center gap-2 bg-red-500/10 p-1 rounded-lg border border-red-500/20">
                        <span className="text-xs font-medium text-red-500 px-2">Delete?</span>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(message._id)}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            'Yes'
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeletingId(null)}
                          disabled={deleteMutation.isPending}
                        >
                          No
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Select
                          value={message.status}
                          onValueChange={(value) => handleStatusChange(message._id, value)}
                          disabled={updateStatusMutation.isPending}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(message._id)}
                          disabled={deleteMutation.isPending}
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
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

export default Messages;
