import React, { useState, useEffect, useCallback } from 'react';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '../../firebase';

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: (email, password) => {},
  register: (email, password) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [user, setUser] = useState(null);

  const logoutHandler = useCallback(() => {
    signOut(auth).then(() => {
      setUser(null);
      localStorage.removeItem('token');
    });
  }, []);

  const loginHandler = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        localStorage.setItem('token', userCredential.user.accessToken);
      });
  };

  const registerHandler = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        localStorage.setItem('token', userCredential.user.accessToken);
      });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      if (user) {
        localStorage.setItem('token', user.accessToken);
      } else {
        localStorage.removeItem('token');
      }
    });

    return () => unsubscribe();
  }, []);

  const contextValue = {
    token: user?.accessToken || '',
    isLoggedIn: !!user,
    login: loginHandler,
    register: registerHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
