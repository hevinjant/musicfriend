import React from "react";
import { getAllUsersWithinMiles } from "../DataManagers/Util";

const ExploreList = ({ users }) => {
  const currentUser = JSON.parse(localStorage.getItem("user_info"));
  const nearbyUsers = getAllUsersWithinMiles(currentUser, users, 50);
  return (
    <div className="explore-list">
      {nearbyUsers.map((user) => (
        <div>{user.display_name}</div>
      ))}
    </div>
  );
};

export default ExploreList;
