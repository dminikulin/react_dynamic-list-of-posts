import React, { useState } from 'react';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';
import { Post } from '../types/Post';
import { Comment, CommentData } from '../types/Comment';

interface DetailProps {
  post: Post;
  postComments: Comment[] | undefined;
  error: string;
  loading: boolean;
  onNewComment: (newComment: CommentData) => void;
  onDeleteComment: (id: number) => void;
  onCommentAdding: boolean;
}

export const PostDetails: React.FC<DetailProps> = ({
  post,
  postComments,
  error,
  loading,
  onNewComment,
  onDeleteComment,
  onCommentAdding,
}) => {
  const [formOpened, setFormOpened] = useState<boolean>(false);

  const openForm = () => setFormOpened(true);

  return (
    <div className="content" data-cy="PostDetails">
      <div className="content" data-cy="PostDetails">
        <div className="block">
          <h2 data-cy="PostTitle">
            #{post.id} {post.title}
          </h2>

          <p data-cy="PostBody">{post.body}</p>
        </div>

        <div className="block">
          {loading ? (
            <Loader />
          ) : error ? (
            <div className="notification is-danger" data-cy="CommentsError">
              {error}
            </div>
          ) : postComments && postComments.length === 0 ? (
            <p className="title is-4" data-cy="NoCommentsMessage">
              No comments yet
            </p>
          ) : (
            <>
              <p className="title is-4">Comments:</p>
              {postComments?.map(comment => (
                <article
                  key={comment.id}
                  className="message is-small"
                  data-cy="Comment"
                >
                  <div className="message-header">
                    <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                      {comment.name}
                    </a>
                    <button
                      data-cy="CommentDelete"
                      type="button"
                      className="delete is-small"
                      aria-label="delete"
                      onClick={() => onDeleteComment(comment.id)}
                    >
                      delete button
                    </button>
                  </div>

                  <div className="message-body" data-cy="CommentBody">
                    {comment.body}
                  </div>
                </article>
              ))}
            </>
          )}
          {!loading && !formOpened && (
            <button
              data-cy="WriteCommentButton"
              type="button"
              className="button is-link"
              onClick={openForm}
            >
              Write a comment
            </button>
          )}
        </div>

        {formOpened && (
          <NewCommentForm
            postId={post.id}
            onAdd={onNewComment}
            loading={onCommentAdding}
          />
        )}
      </div>
    </div>
  );
};
