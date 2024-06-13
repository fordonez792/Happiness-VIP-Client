import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chart, LinearScale, PointElement } from "chart.js";
import { Scatter } from "react-chartjs-2";
import axios from "axios";

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

  const [allResults, setAllResults] = useState();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_URL}responses/get-results`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          setAllResults(res.data.allResponses);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const getMean = () => {
    const { positiveSum, negativeSum } = allResults?.reduce(
      (acc, obj) => {
        acc.positiveSum += obj?.positive;
        acc.negativeSum += obj?.negative;
        return acc;
      },
      { positiveSum: 0, negativeSum: 0 }
    );

    const positiveMean = positiveSum / allResults?.length;
    const negativeMean = negativeSum / allResults?.length;

    return { positiveMean, negativeMean };
  };

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
          text: "正向值",
        },
        min: 0,
        max: 10,
        stepSize: 1,
      },
      y: {
        title: {
          display: true,
          text: "負向值",
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
        const xPosition = xAxis.getPixelForValue(getMean()?.positiveMean);
        ctx.strokeStyle = "#17252a";
        ctx.beginPath();
        ctx.moveTo(xPosition, yAxis.top);
        ctx.lineTo(xPosition, yAxis.bottom);
        ctx.stroke();

        const yPosition = yAxis.getPixelForValue(getMean()?.negativeMean);
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
            <h1>{state.state}</h1>
            <div className="chart">
              {allResults ? (
                <Scatter options={options} data={data} plugins={plugins} />
              ) : null}
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
