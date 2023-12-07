import React from "react";
import { useNavigate } from "react-router-dom";

import introPic from "../assets/intro-pic.jpg";
import Footer from "../components/Footer";
import { homeTranslations } from "../assets/translations";
import { useLanguageContext } from "../context/LanguageContext";

const Home = () => {
  const { language } = useLanguageContext();
  const navigate = useNavigate();

  return (
    <section id="home">
      <div className="container">
        <article className="img-header">
          <img src={introPic} alt="" />
          <div className="header">
            <h1>
              {language === "English"
                ? homeTranslations[0].english
                : language === "Chinese" && homeTranslations[0].chinese}
            </h1>
            <p>
              {language === "English"
                ? homeTranslations[3].english
                : language === "Chinese" && homeTranslations[3].chinese}
            </p>
          </div>
        </article>

        <article className="intro">
          <p>
            {language === "English"
              ? homeTranslations[2].english
              : language === "Chinese" && homeTranslations[2].chinese}
          </p>
          <div className="btn-container">
            <div className="primary-button" onClick={() => navigate("/survey")}>
              {language === "English"
                ? homeTranslations[1].english
                : language === "Chinese" && homeTranslations[1].chinese}
            </div>
          </div>
        </article>
      </div>
      <Footer />
    </section>
  );
};

export default Home;
