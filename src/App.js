import "./style.css";

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Survey from "./pages/Survey";
import Results from "./pages/Results";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Error from "./pages/Error";

import ProtectedRoute from "./protected/ProtectedRoute";

import { useAuthStateContext } from "./context/AuthStateContext";

const App = () => {
  const { authState } = useAuthStateContext();

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<Navbar />}>
          <Route path="/" element={<Home />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/results" element={<Results />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute loggedIn={authState.loggedIn}>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
};

export default App;
