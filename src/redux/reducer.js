import { combineReducers } from "redux";
import { actionTypes } from "./action";

function tokenReducer(state = {}, action) {
  if (action.type === actionTypes.SET_ACCESS_TOKEN) {
    return {
      access_token: action.payload.access_token,
    };
  }

  return state;
}

const reducers = combineReducers({
  token: tokenReducer,
});

export default reducers;
