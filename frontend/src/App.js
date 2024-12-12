// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/pages/Home/HomePage';
import ProfilePage from './components/Profile/ProfilePage';
import SignIn from './components/auth/Forms/SignIn';
import Register from './components/auth/Forms/Register';
import AuthContext from '../src/components/store/AuthContext';

const App = () => {
  const { isLoggedIn } = React.useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={!isLoggedIn ? <SignIn /> : <Navigate to="/profile" />} />
      <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/profile" />} />
      <Route path="/profile" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/signin" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
