import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguageContext } from "../context/LanguageContext";
import { menuDropdownTranslations } from "../assets/translations";

const MenuDropdown = ({ isDropdownOpen, setIsDropdownOpen }) => {
  const { language } = useLanguageContext();
  const navigate = useNavigate();

  return (
    <div className={`menu-container ${isDropdownOpen ? "active" : null}`}>
      <div
        className="overlay"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      ></div>
      <ul className={`menu-dropdown `}>
        <li
          className="option"
          onClick={() => {
            navigate("/survey");
            setIsDropdownOpen(false);
          }}
        >
          {language === "English"
            ? menuDropdownTranslations[1].english
            : language === "Chinese" && menuDropdownTranslations[1].chinese}
        </li>
        <li
          className="option"
          onClick={() => {
            navigate("/results");
            setIsDropdownOpen(false);
          }}
        >
          {language === "English"
            ? menuDropdownTranslations[0].english
            : language === "Chinese" && menuDropdownTranslations[0].chinese}
        </li>
        <li
          className="option"
          onClick={() => {
            navigate("/contact-us");
            setIsDropdownOpen(false);
          }}
        >
          {language === "English"
            ? menuDropdownTranslations[2].english
            : language === "Chinese" && menuDropdownTranslations[2].chinese}
        </li>
      </ul>
    </div>
  );
};

export default MenuDropdown;
