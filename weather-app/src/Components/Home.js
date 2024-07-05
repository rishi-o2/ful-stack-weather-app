import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // We'll create this file for styles

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-card">
        <h1>Welcome to Weather App</h1>
        <div className="button-group">
          <Link to="/login">
            <button className="home-button">Login</button>
          </Link>
          <Link to="/signup">
            <button className="home-button">Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
