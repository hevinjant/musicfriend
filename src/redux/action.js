export const actionTypes = {
  SET_ACCESS_TOKEN: "SET_ACCESS_TOKEN",
};

export function setAccessToken(token) {
  return {
    type: actionTypes.SET_ACCESS_TOKEN,
    payload: {
      access_token: token,
    },
  };
}
