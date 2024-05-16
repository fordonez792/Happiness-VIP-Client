import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart, LinearScale, PointElement } from "chart.js";
import { Scatter } from "react-chartjs-2";

import Footer from "../components/Footer";
import { useLanguageContext } from "../context/LanguageContext";
import { adminTranslations } from "../assets/translations";
import { useAuthStateContext } from "../context/AuthStateContext";

const Admin = () => {
  const { language } = useLanguageContext();
  const { logOut } = useAuthStateContext();
  const [results, setResults] = useState();
  const [numberSurveys, setNumberSurveys] = useState();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  Chart.register(LinearScale);
  Chart.register(PointElement);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_URL}responses/get-results`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          setResults(res.data.allResponses);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const getMean = () => {
    const { positiveSum, negativeSum } = results?.reduce(
      (acc, obj) => {
        acc.positiveSum += obj?.positive;
        acc.negativeSum += obj?.negative;
        return acc;
      },
      { positiveSum: 0, negativeSum: 0 }
    );

    const positiveMean = positiveSum / results?.length;
    const negativeMean = negativeSum / results?.length;

    return { positiveMean, negativeMean };
  };

  const data = {
    datasets: [
      {
        label: "Survey Responses",
        data: results?.map((res) => ({
          x: res.positive,
          y: res.negative,
        })),
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
        const xPosition = xAxis.getPixelForValue(getMean().positiveMean);
        ctx.strokeStyle = "#17252a";
        ctx.beginPath();
        ctx.moveTo(xPosition, yAxis.top);
        ctx.lineTo(xPosition, yAxis.bottom);
        ctx.stroke();

        const yPosition = yAxis.getPixelForValue(getMean().negativeMean);
        ctx.strokeStyle = "#17252a";
        ctx.beginPath();
        ctx.moveTo(xAxis.left, yPosition);
        ctx.lineTo(xAxis.right, yPosition);
        ctx.stroke();
      },
    },
  ];

  const handleDownload = (e) => {
    axios
      .post(
        `${process.env.REACT_APP_URL}responses/export`,
        {},
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then((res) => {
        e.target.href = window.URL.createObjectURL(new Blob([res.data]));
        setNotification(res.data.message);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_URL}responses/get-count`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          setNumberSurveys(res.data.count);
        } else {
          setNumberSurveys(0);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_URL}messages/get-messages`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((res) => {
        if (res.data.status === "NONE") {
          setError(res.data.message);
        }
        if (res.data.status === "SUCCESS") {
          setMessages(res.data.allMessages);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <section id="admin">
      <div className="container">
        <article className="header">
          <h1>
            {language === "English"
              ? adminTranslations[0].english
              : language === "Chinese" && adminTranslations[0].chinese}
          </h1>
        </article>
        <article className="data">
          <div className="item">
            <p>
              {language === "English"
                ? adminTranslations[3].english
                : language === "Chinese" && adminTranslations[3].chinese}
            </p>
            <p>{numberSurveys}</p>
          </div>
        </article>
        <article className="header">
          <h1>Plot Graph</h1>
        </article>
        <article className="chart">
          {results && (
            <Scatter options={options} data={data} plugins={plugins} />
          )}
        </article>
        <article className="header">
          <h1>
            {language === "English"
              ? adminTranslations[4].english
              : language === "Chinese" && adminTranslations[4].chinese}
          </h1>
        </article>
        <article className="messages">
          {error && <p>{error}</p>}
          {Array.from(messages).map((single, index) => {
            const { name, email, subject, message, time } = single;
            return (
              <div key={index} className="message">
                <p>Name: {name}</p>
                <p>Email: {email}</p>
                <p>Subject: {subject}</p>
                <p>Message: {message}</p>
                <p>Time: {new Date(time).toLocaleDateString()}</p>
              </div>
            );
          })}
        </article>
        <article className="btn-container">
          <a
            className="primary-button"
            download="survey-data.csv"
            onClick={(e) => handleDownload(e)}
          >
            {language === "English"
              ? adminTranslations[1].english
              : language === "Chinese" && adminTranslations[1].chinese}
          </a>
          <div className="secondary-button" onClick={() => logOut()}>
            {language === "English"
              ? adminTranslations[2].english
              : language === "Chinese" && adminTranslations[2].chinese}
          </div>
        </article>
      </div>
      <Footer />
    </section>
  );
};

export default Admin;
