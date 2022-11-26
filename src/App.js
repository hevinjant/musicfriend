import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProfileSetting from "./pages/ProfileSetting";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" exact element={<Login />} />;
        <Route path="/home" exact element={<Home />} />;
        <Route path="/profile" exact element={<ProfileSetting />} />;
      </Routes>
    </div>
  );
}

export default App;
