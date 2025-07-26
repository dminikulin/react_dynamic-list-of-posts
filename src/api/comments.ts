import { Comment, CommentData } from '../types/Comment';
import { client } from '../utils/fetchClient';

export const CommentsAPI = {
  getCommentsByPostId: (postId: number) =>
    client.get<Comment[]>(`/comments?postId=${postId}`),
  addComment: (newComment: CommentData) =>
    client.post<Comment>(`/comments`, newComment),
  deleteComment: (id: number) => client.delete(`/comments/${id}`),
};
