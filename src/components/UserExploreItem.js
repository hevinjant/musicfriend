import React from "react";
import UserItem from "./UserItem";

const UserExploreItem = ({ user }) => {
  return (
    <div className="user-explore-item">
      <UserItem user={user} />
    </div>
  );
};

export default UserExploreItem;
