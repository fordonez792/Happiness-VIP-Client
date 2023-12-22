import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLanguageContext } from "../context/LanguageContext";
import { resultsTranslations } from "../assets/translations";
import { happinessState } from "../assets/happiness-state";
import Footer from "../components/Footer";
import ThankYou from "../components/ThankYou";

const Results = () => {
  const navigate = useNavigate();
  const { language } = useLanguageContext();
  const [isThankYouOpen, setIsThankYouOpen] = useState(
    localStorage.getItem("giveThanks") || false
  );

  const [results, setResults] = useState(
    JSON.parse(localStorage.getItem("results"))
  );
  const [state, setState] = useState({});

  useEffect(() => {
    if (results.positive >= 7 && results.negative >= 7) {
      setState(happinessState[1]);
    }
    if (results.positive >= 7 && results.negative < 7) {
      setState(happinessState[0]);
    }
    if (results.positive < 7 && results.negative < 7) {
      setState(happinessState[3]);
    }
    if (results.positive < 7 && results.negative >= 7) {
      setState(happinessState[2]);
    }
  }, [results]);

  useEffect(() => localStorage.removeItem("giveThanks"));

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
              <p>{results.positive.toFixed(1)}</p>
            </div>
            <div className="item">
              <p>
                {language === "English"
                  ? resultsTranslations[2].english
                  : language === "Chinese" && resultsTranslations[2].chinese}
              </p>
              <p>{results.negative.toFixed(1)}</p>
            </div>
            <div className="feedback">
              <p>{state.state}</p>
              <p>{state.feedback}</p>
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
      <ThankYou
        isThankYouOpen={isThankYouOpen}
        setIsThankYouOpen={setIsThankYouOpen}
      />
      <Footer />
    </section>
  );
};

export default Results;
