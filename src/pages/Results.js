import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLanguageContext } from "../context/LanguageContext";
import { resultsTranslations } from "../assets/translations";
import Footer from "../components/Footer";

const Results = () => {
  const navigate = useNavigate();
  const { language } = useLanguageContext();

  const [results, setResults] = useState(
    JSON.parse(localStorage.getItem("results"))
  );

  return (
    <section id="results">
      <div className="container">
        <article className="header">
          <h1>
            {language === "English"
              ? resultsTranslations[0].english
              : language === "Chinese" && resultsTranslations[0].chinese}
          </h1>
        </article>
        {results ? (
          <article className="results">
            <div className="item">
              <p>
                {language === "English"
                  ? resultsTranslations[1].english
                  : language === "Chinese" && resultsTranslations[1].chinese}
              </p>
              <p>{results.positive}</p>
            </div>
            <div className="item">
              <p>
                {language === "English"
                  ? resultsTranslations[2].english
                  : language === "Chinese" && resultsTranslations[2].chinese}
              </p>
              <p>{results.negative}</p>
            </div>
          </article>
        ) : (
          <article className="no-results">
            <p>
              {language === "English"
                ? resultsTranslations[4].english
                : language === "Chinese" && resultsTranslations[4].chinese}
            </p>
          </article>
        )}
        <div className="btn-container">
          <div className="primary-button" onClick={() => navigate("/survey")}>
            {language === "English"
              ? resultsTranslations[3].english
              : language === "Chinese" && resultsTranslations[3].chinese}
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default Results;
