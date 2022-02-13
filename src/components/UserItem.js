import React from "react";

function UserItem({ user }) {
  return (
    <div className="user-item">
      <img className="user-dp" src={user.imageUrl} alt="no image" />
      <p>
        <strong>{user.displayName}</strong>
      </p>
    </div>
  );
}

export default UserItem;
