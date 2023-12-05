import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useAuthStateContext } from "../context/AuthStateContext";
import { loginTranslations } from "../assets/translations";
import { useLanguageContext } from "../context/LanguageContext";

const Login = () => {
  const { language } = useLanguageContext();
  const navigate = useNavigate();
  const { setAuthState } = useAuthStateContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Resets the error message after 10 seconds
  useEffect(() => {
    setUsername("");
    setPassword("");
    setTimeout(() => setError(""), 10000);
  }, [error, setError]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (username === "") {
      setError(
        language === "English"
          ? loginTranslations[1].english
          : language === "Chinese" && loginTranslations[1].chinese
      );
      return;
    }
    if (password === "") {
      setError(
        language === "English"
          ? loginTranslations[2].english
          : language === "Chinese" && loginTranslations[2].chinese
      );
      return;
    }
    axios
      .post(`${process.env.REACT_APP_URL}admins/login`, { username, password })
      .then((res) => {
        if (res.data.status === "FAILED") setError(res.data.message);
        if (res.data.status === "SUCCESS") {
          localStorage.setItem("accessToken", res.data.accessToken);
          setAuthState({
            username: res.data.username,
            id: res.data.id,
            loggedIn: true,
          });
          navigate("/admin");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <section id="login">
      <div className="container">
        <article className="login-container" onSubmit={() => handleSubmit()}>
          <div className="error-container">
            <span>{error}</span>
          </div>
          <div className="header">
            <h1>
              {language === "English"
                ? loginTranslations[0].english
                : language === "Chinese" && loginTranslations[0].chinese}
            </h1>
          </div>
          <div className="question">
            <input
              type="text"
              placeholder={
                language === "English"
                  ? loginTranslations[3].english
                  : language === "Chinese" && loginTranslations[3].chinese
              }
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key == "Enter" && handleSubmit(e)}
            />
          </div>
          <div className="question">
            <input
              type="password"
              placeholder={
                language === "English"
                  ? loginTranslations[4].english
                  : language === "Chinese" && loginTranslations[4].chinese
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key == "Enter" && handleSubmit(e)}
            />
          </div>
          <div className="btn-container">
            <div
              className="primary-button"
              type="submit"
              onClick={(e) => handleSubmit(e)}
            >
              {language === "English"
                ? loginTranslations[5].english
                : language === "Chinese" && loginTranslations[5].chinese}
            </div>
            <div className="tertiary-button" onClick={() => navigate("/")}>
              {language === "English"
                ? loginTranslations[6].english
                : language === "Chinese" && loginTranslations[6].chinese}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default Login;
