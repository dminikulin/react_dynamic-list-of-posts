import { User } from '../types/User';
import { client } from '../utils/fetchClient';

export const UsersAPI = {
  getAll: () => client.get<User[]>(`/users`),
  getSingleUser: (id: number) => client.get<User>(`/users/${id}`),
};
