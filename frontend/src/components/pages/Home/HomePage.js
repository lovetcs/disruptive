import React from 'react';
import '../../../App.css';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container">
      <Link to={'/Signin'} className="admin-portal">
        <span className="main-text">Admin Portal</span>
        <br />
        <span className="sub-text">Sign in Here</span>
      </Link>
      <h1 className="title">DISRUPTIVE</h1>
      <h2 className="subtitle">REVOLUTIONARY FRAUD DETECTION</h2>
      <footer className="footer">made by lovet-ransom etongwe</footer>
    </div>
  );
};

export default HomePage;
