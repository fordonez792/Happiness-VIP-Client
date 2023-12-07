import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

import happinessLogo from "../assets/Happiness-Logo.png";
import happinessLogoChinese from "../assets/Happiness-Logo-Chinese.png";
import MenuDropdown from "./MenuDropdown";
import { useLanguageContext } from "../context/LanguageContext";

const Navbar = () => {
  const { language } = useLanguageContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <section id="navbar">
        <div className="container">
          <nav className="navbar">
            <div className="logo">
              <article className="header">
                <img
                  src={
                    language === "English"
                      ? happinessLogo
                      : language === "Chinese" && happinessLogoChinese
                  }
                  alt=""
                  onClick={() => navigate("/")}
                />
              </article>
            </div>
            <div className="menu">
              <article
                className="icon"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <FaBars />
              </article>
            </div>
          </nav>
        </div>
        <MenuDropdown
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
        />
      </section>
      <Outlet />
    </>
  );
};

export default Navbar;
