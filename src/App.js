import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Guest from "./pages/Guest";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" exact element={<Login />} />;
        <Route path="/home" exact element={<Home />} />;
        <Route path="/profile/:userid" exact element={<Profile />} />;
        <Route path="/guest" exact element={<Guest />} />;
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
