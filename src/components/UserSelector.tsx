import React, { useState } from 'react';
import { User } from '../types/User';

interface SelectorProps {
  users: User[];
  selectedUser: User | undefined;
  onSelect: (id: number) => void;
}

export const UserSelector: React.FC<SelectorProps> = ({
  users,
  selectedUser,
  onSelect,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);

  const toggleDropdown = () => setIsActive(!isActive);

  const handleSelect = (id: number) => {
    onSelect(id);
    setIsActive(false);
  };

  return (
    <div
      data-cy="UserSelector"
      className={`dropdown ${isActive ? 'is-active' : ''}`}
    >
      <div className="dropdown-trigger">
        <button
          type="button"
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={toggleDropdown}
        >
          <span>{selectedUser ? selectedUser.name : 'Choose a user'}</span>
          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true" />
          </span>
        </button>
      </div>

      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {users.map((user: User) => (
            <a
              key={user.id}
              href={`#user-${user.id}`}
              className={`dropdown-item ${selectedUser?.id === user.id ? 'is-active' : ''}`}
              onClick={e => {
                e.preventDefault();
                handleSelect(user.id);
              }}
            >
              {user.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
