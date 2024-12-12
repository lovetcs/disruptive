// src/components/auth/Forms/SignIn.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/AuthContext';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = React.useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/profile');
    } catch (error) {
      console.error('Authentication error', error);
    }
  };

  return (
    <div className="container">
      <form className="sign-in-form" onSubmit={submitHandler}>
        <h1 className="title">DISRUPTIVE</h1>
        <h2>Admin Portal</h2>
        <input
          type="email"
          id="email"
          name="email"
          className="input-field"
          placeholder="example@gmail.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password"
          name="password"
          className="input-field"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p>Don't have an account? <span className="register-link" onClick={() => navigate('/register')}>Register</span></p>        <button type="submit" className="sign-in-button">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
