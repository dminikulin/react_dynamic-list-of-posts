import classNames from 'classnames';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import React, { useEffect, useState } from 'react';
import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';
import { User } from './types/User';
import { UsersAPI } from './api/users';
import { PostsAPI } from './api/posts';
import { Post } from './types/Post';
import { CommentsAPI } from './api/comments';
import { Comment, CommentData } from './types/Comment';

export const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post>();
  const [selectedPostLoading, setSelectedPostLoading] =
    useState<boolean>(false);
  const [postComments, setPostComments] = useState<Comment[]>();
  const [newCommentAdding, setNewCommentAdding] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const getUsers = () => {
    UsersAPI.getAll()
      .then(setUsers)
      .catch(() => setError('Failed to fetch users'));
  };

  const getPostsByUserId = (userId: number) => {
    setPostsLoading(true);
    PostsAPI.getPostsByUserId(userId)
      .then(setUserPosts)
      .catch(() =>
        setError(`Failed to get posts for user '${selectedUser?.name}'`),
      )
      .finally(() => setPostsLoading(false));
  };

  const getSingleUser = (id: number) => {
    const user = users.find(u => u.id === id);

    if (user) {
      setSelectedUser(user); // immediate update to UI
    }

    setUserPosts([]);
    setError('');
    setPostsLoading(true);

    UsersAPI.getSingleUser(id)
      .then(setSelectedUser)
      .then(() => getPostsByUserId(id))
      .catch(() => setError(`Failed to get the user (ID: ${id})`))
      .finally(() => setPostsLoading(false));
  };

  const getComments = (postId: number) => {
    setError('');
    CommentsAPI.getCommentsByPostId(postId)
      .then(setPostComments)
      .catch(() => setError(`Failed to get comments for post ${postId}`));
  };

  const getPostById = (id: number) => {
    setError('');
    setPostComments(undefined);
    setSelectedPost(undefined);
    setSelectedPostLoading(true);
    PostsAPI.getPostById(id)
      .then(post => {
        setSelectedPost(post);
        getComments(post.id);
      })
      .catch(() => setError(`Failed to get post ${id}`))
      .finally(() => setSelectedPostLoading(false));
  };

  const addNewComment = (newComment: CommentData) => {
    setNewCommentAdding(true);
    CommentsAPI.addComment(newComment)
      .then(response => {
        setPostComments(prev => [...(prev ?? []), response]);
      })
      .catch(() => setError(`Failed to add comment`))
      .finally(() => setNewCommentAdding(false));
  };

  const deleteComment = (id: number) => {
    CommentsAPI.deleteComment(id)
      .then(() => {
        setPostComments(prev =>
          prev ? prev.filter(comment => comment.id !== id) : [],
        );
      })
      .catch(() => setError(`Failed to delete comment ${id}`));
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector
                  users={users}
                  selectedUser={selectedUser}
                  onSelect={getSingleUser}
                />
              </div>

              <div className="block" data-cy="MainContent">
                {postsLoading ? (
                  <Loader />
                ) : error ? (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    {error}
                  </div>
                ) : !selectedUser ? (
                  <p data-cy="NoSelectedUser">No user selected</p>
                ) : userPosts.length === 0 ? (
                  <div className="notification is-warning" data-cy="NoPostsYet">
                    No posts yet
                  </div>
                ) : (
                  <PostsList posts={userPosts} onSelect={getPostById} />
                )}
              </div>
            </div>
          </div>

          {selectedPost && (
            <div
              data-cy="Sidebar"
              className={classNames(
                'tile',
                'is-parent',
                'is-8-desktop',
                'Sidebar',
                'Sidebar--open',
              )}
            >
              <div className="tile is-child box is-success ">
                <PostDetails
                  post={selectedPost}
                  postComments={postComments}
                  error={error}
                  loading={selectedPostLoading}
                  onNewComment={addNewComment}
                  onDeleteComment={deleteComment}
                  onCommentAdding={newCommentAdding}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
