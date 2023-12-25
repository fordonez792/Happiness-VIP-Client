import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chart, LinearScale, PointElement } from "chart.js";
import { Scatter } from "react-chartjs-2";

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

  Chart.register(LinearScale);
  Chart.register(PointElement);

  const data = {
    datasets: [
      {
        label: "Survey Responses",
        data: [{ x: results.positive, y: results.negative }],
        pointBackgroundColor: "#5085a5",
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Positive",
        },
        min: 0,
        max: 10,
        stepSize: 1,
      },
      y: {
        title: {
          display: true,
          text: "Negative",
        },
        min: 0,
        max: 10,
        stepSize: 1,
      },
    },
  };

  const plugins = [
    {
      beforeDraw: (chart, easing) => {
        const { ctx, scales } = chart;
        const xAxis = scales["x"];
        const yAxis = scales["y"];
        const xPosition = xAxis.getPixelForValue(7);
        ctx.strokeStyle = "#17252a";
        ctx.beginPath();
        ctx.moveTo(xPosition, yAxis.top);
        ctx.lineTo(xPosition, yAxis.bottom);
        ctx.stroke();

        const yPosition = yAxis.getPixelForValue(7);
        ctx.strokeStyle = "#17252a";
        ctx.beginPath();
        ctx.moveTo(xAxis.left, yPosition);
        ctx.lineTo(xAxis.right, yPosition);
        ctx.stroke();
      },
    },
  ];

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
            <div className="chart">
              <Scatter options={options} data={data} plugins={plugins} />
            </div>
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
