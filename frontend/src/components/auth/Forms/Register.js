// src/components/auth/Forms/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { register } = React.useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      navigate('/profile');
    } catch (error) {
      console.error('Registration error', error);
    }
  };

  return (
    <div className="container">
      <form className="sign-in-form" onSubmit={submitHandler}>
        <h1 className="title">DISRUPTIVE</h1>
        <h2>Register</h2>
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
        <p>Already have an account? <span className="signin-link" onClick={() => navigate('/signin')}>Sign In</span></p>
        <button type="submit" className="sign-in-button">Register</button>
      </form>
    </div>
  );
};

export default Register;
