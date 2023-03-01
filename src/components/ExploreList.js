import React from "react";
import { getAllUsersWithinMiles } from "../DataManagers/Util";
import UserExploreItem from "./UserExploreItem";

const ExploreList = ({ nearbyUsers }) => {
  const currentUser = JSON.parse(localStorage.getItem("user_info"));
  const nearbyUsersWithinMiles = getAllUsersWithinMiles(
    currentUser,
    nearbyUsers,
    50
  );
  return (
    <div className="explore-list">
      {nearbyUsersWithinMiles.map((user) => {
        return <UserExploreItem key={user.email} user={user} />;
      })}
    </div>
  );
};

export default ExploreList;
