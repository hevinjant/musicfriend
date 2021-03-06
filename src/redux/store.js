import { createStore } from "redux";
import reducers from "./reducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

// export default () => {
//   let store = createStore(persistedRducer);
//   let persistor = persistStore(store);
//   return { store, persistor };
// };

const store = createStore(persistedReducer);
const persistor = persistStore(store);
export { store, persistor };
