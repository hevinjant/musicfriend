import React from "react";
import { getAllUsersWithinMiles } from "../DataManagers/Util";
import UserExploreItem from "./UserExploreItem";

const ExploreList = ({ users }) => {
  const currentUser = JSON.parse(localStorage.getItem("user_info"));
  const nearbyUsers = getAllUsersWithinMiles(currentUser, users, 50);
  return (
    <div className="explore-list">
      {nearbyUsers.map((user) => {
        return <UserExploreItem key={user.email} user={user} />;
      })}
    </div>
  );
};

export default ExploreList;
