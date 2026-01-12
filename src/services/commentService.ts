import api from '../config/api';

export interface Comment {
  _id: string;
  blogPostId: string;
  name: string;
  email: string;
  content: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentData {
  name: string;
  email: string;
  content: string;
}

export interface CommentsResponse {
  success: boolean;
  data: Comment[];
}

export interface CommentResponse {
  success: boolean;
  message: string;
  data: Comment;
}

export const commentService = {
  // Get approved comments for a blog post (public)
  getCommentsByPost: async (postId: string): Promise<Comment[]> => {
    const response = await api.get<CommentsResponse>(`/api/comments/post/${postId}`);
    return response.data.data;
  },

  // Create a new comment (public)
  createComment: async (postId: string, data: CreateCommentData): Promise<Comment> => {
    const response = await api.post<CommentResponse>(`/api/comments/post/${postId}`, data);
    return response.data.data;
  },

  // Get all comments with filters (admin only)
  getAllComments: async (filters?: { approved?: boolean; postId?: string }): Promise<Comment[]> => {
    const params = new URLSearchParams();
    if (filters?.approved !== undefined) {
      params.append('approved', String(filters.approved));
    }
    if (filters?.postId) {
      params.append('postId', filters.postId);
    }

    const response = await api.get<CommentsResponse>(`/api/comments?${params.toString()}`);
    return response.data.data;
  },

  // Approve a comment (admin only)
  approveComment: async (commentId: string): Promise<Comment> => {
    const response = await api.patch<CommentResponse>(`/api/comments/${commentId}/approve`);
    return response.data.data;
  },

  // Delete a comment (admin only)
  deleteComment: async (commentId: string): Promise<void> => {
    await api.delete(`/api/comments/${commentId}`);
  },
};
