import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/register.jsx";
import LoginPage from "./pages/login.jsx";
import UserList from "./pages/userList.jsx";
import { User } from "lucide-react";
import ShowUser from "./pages/showUser.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element = {<Register/>} />
        <Route path="/login" element = {<LoginPage/>} />
        <Route path="/userlist" element = {<UserList/>} />
        <Route path="/user/:id" element={<ShowUser />} />
      </Routes>
    </Router>
  );
}

export default App;