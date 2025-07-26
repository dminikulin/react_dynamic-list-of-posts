import { Post } from '../types/Post';
import { client } from '../utils/fetchClient';

export const PostsAPI = {
  getPostById: (id: number) => client.get<Post>(`/posts/${id}`),
  getPostsByUserId: (userId: number) =>
    client.get<Post[]>(`/posts?userId=${userId}`),
};
