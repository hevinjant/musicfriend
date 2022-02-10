import React, { useEffect, useState } from "react";
import { getUserSpotifyInfo } from "../SpotifyManager";
import { useSelector } from "react-redux";
import store from "../redux/store";

function Home() {
  const [userInfo, setUserInfo] = useState({});
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  //const token = useSelector((state) => state.token.access_token);

  useEffect(() => {
    console.log("token:", token);
    getUserSpotifyInfo(token).then((user) => {
      console.log("user:", user);
      setUserInfo(user);
    });
  }, [token]);

  return <div>{userInfo.displayName}</div>;
}

export default Home;
