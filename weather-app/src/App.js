import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Weather from "./Components/Weather"; // Adjust the import path as necessary
import Login from "./Components/Login"; // Adjust the import path as necessary
import Signup from "./Components/Signup"; // Adjust the import path as necessary
import Home from "./Components/Home"; // Adjust the import path as necessary

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Add more routes here if needed */}
      </Routes>
    </Router>
  );
};

export default App;
