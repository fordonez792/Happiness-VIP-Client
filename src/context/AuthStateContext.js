import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

export const AuthStateContext = React.createContext();

// Provides the logged in information, and persists the login from the user if the user is real user

export const AuthStateProvider = ({ children }) => {
  // Main state to know if a user is logged in or not
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    loggedIn: null,
  });

  useEffect(() => {
    // Check if user is logged in
    axios
      .get(`${process.env.REACT_APP_URL}admins/auth`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((res) => {
        if (res.data.status === "FAILED") {
          localStorage.removeItem("accessToken");
          setAuthState({
            username: "",
            id: 0,
            loggedIn: false,
          });
        } else {
          setAuthState({
            username: res.data.username,
            id: res.data.id,
            loggedIn: true,
          });
        }
      })
      .catch((error) => console.log(error));
  }, []);

  // Handles both google and local account log out
  const logOut = () => {
    setAuthState({
      username: "",
      id: 0,
      loggedIn: false,
    });
    localStorage.removeItem("accessToken");
    window.location.reload();
  };

  return (
    <AuthStateContext.Provider
      value={{
        authState,
        setAuthState,
        logOut,
      }}
    >
      {children}
    </AuthStateContext.Provider>
  );
};

export const useAuthStateContext = () => {
  return useContext(AuthStateContext);
};
