import React from 'react';
import { Post } from '../types/Post';

interface Props {
  posts: Post[];
  selectedPostId?: number;
  onSelect: (id: number) => void;
  onCloseDetails: (postId: number) => void;
}

export const PostsList: React.FC<Props> = ({
  posts,
  selectedPostId,
  onSelect,
  onCloseDetails,
}) => (
  <div data-cy="PostsList">
    <p className="title">Posts:</p>

    <table className="table is-fullwidth is-striped is-hoverable is-narrow">
      <thead>
        <tr className="has-background-link-light">
          <th>#</th>
          <th>Title</th>
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <th> </th>
        </tr>
      </thead>

      <tbody>
        {posts.map(post => {
          const isSelected = post.id === selectedPostId;

          return (
            <tr key={post.id} data-cy="Post">
              <td data-cy="PostId">{post.id}</td>

              <td data-cy="PostTitle">{post.title}</td>

              <td className="has-text-right is-vcentered">
                <button
                  type="button"
                  data-cy="PostButton"
                  className={`button is-link ${isSelected ? '' : 'is-light'}`}
                  onClick={e => {
                    e.preventDefault();
                    if (isSelected) {
                      onCloseDetails(post.id);
                    } else {
                      onSelect(post.id);
                    }
                  }}
                >
                  {isSelected ? 'Close' : 'Open'}
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
