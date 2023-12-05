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
                ? homeTranslations[2].english
                : language === "Chinese" && homeTranslations[2].chinese}
            </p>
          </div>
        </article>

        <article className="intro">
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem nulla
            ab quos inventore nesciunt nam error voluptatem autem. Qui autem
            alias fugit iste saepe, voluptates dolores officia! Accusantium
            exercitationem iure perferendis deleniti consequuntur et ratione
            nobis esse maxime eum sequi illum nihil delectus, amet architecto
            possimus inventore, dolorum commodi repudiandae!
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
