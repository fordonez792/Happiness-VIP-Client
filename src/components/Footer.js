import React, { useEffect, useRef } from "react";
import { HiLanguage } from "react-icons/hi2";
import { FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import happinessLogo from "../assets/Happiness-Logo.png";
import happinessLogoChinese from "../assets/Happiness-Logo-Chinese.png";
import { useAuthStateContext } from "../context/AuthStateContext";
import { useLanguageContext } from "../context/LanguageContext";
import { footerTranslations } from "../assets/translations";

const Footer = () => {
  const { authState } = useAuthStateContext();
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const { language, chooseLanguage } = useLanguageContext();

  // Opens the dropdown when clicking on the input
  const openDropdown = (e) => {
    if (!e.target.id === "language" && !e.target.classList.contains("icon"))
      return;
    dropdownRef.current.classList.toggle("active");
  };

  // closes the dropdown when clicked anywhere other than dropdown or input
  const closeDropdown = (e) => {
    if (
      e.target.id === "language" ||
      e.target.classList.contains("option") ||
      e.target.classList.contains("icon")
    )
      return;
    dropdownRef.current.classList.remove("active");
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);

    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <section id="footer">
      <div className="container">
        <footer>
          <article className="logo">
            <img
              src={
                language === "English"
                  ? happinessLogo
                  : language === "Chinese" && happinessLogoChinese
              }
              alt="Logo"
              onClick={() => navigate("/")}
            />
          </article>
          <article className="language">
            <div className="field-container" onClick={(e) => openDropdown(e)}>
              <label htmlFor="review-year">
                <HiLanguage />
              </label>
              <input
                type="text"
                placeholder={
                  language === "English"
                    ? footerTranslations[0].english
                    : language === "Chinese" && footerTranslations[0].chinese
                }
                className="input-field"
                value={language}
                id="language"
                autoComplete="off"
                readOnly={true}
              />
              <ul className="dropdown-menu" ref={dropdownRef}>
                <li
                  className="dropdown-option"
                  onClick={(e) => chooseLanguage(e)}
                >
                  {language === "English"
                    ? "Chinese | 中文"
                    : language === "Chinese" && "English | 英文"}
                </li>
              </ul>
              <div className="icon">
                <FaChevronDown />
              </div>
            </div>
            <p className="paragraph">
              {language === "English"
                ? footerTranslations[1].english
                : language === "Chinese" && footerTranslations[1].chinese}
            </p>
            <p
              onDoubleClick={
                authState.loggedIn
                  ? () => navigate("/admin")
                  : () => navigate("/login")
              }
            >
              ©{" "}
              {language === "English"
                ? footerTranslations[2].english
                : language === "Chinese" && footerTranslations[2].chinese}{" "}
              {new Date().getFullYear()}
            </p>
          </article>
        </footer>
      </div>
    </section>
  );
};

export default Footer;
