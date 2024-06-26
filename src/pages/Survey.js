import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa";

import Footer from "../components/Footer";
import { activities, questions } from "../assets/survey-info";
import surveyPic from "../assets/survey-pic.jpg";
import { useLanguageContext } from "../context/LanguageContext";
import { surveyTranslations } from "../assets/translations";
import { useNavigate } from "react-router-dom";

const Survey = () => {
  const navigate = useNavigate();
  const { language } = useLanguageContext();
  // States to hold information inputted by the user
  const [email, setEmail] = useState("");
  const [activitiesSelected, setActivitiesSelected] = useState([]);
  const [otherActivity, setOtherActivity] = useState("");
  const [responses, setResponses] = useState({});
  // Allow for automatic scrolling to next question
  const [currentQuestion, setCurrentQuestion] = useState();
  const [activityName, setActivityName] = useState();
  const questionRefs = useRef([]);

  // Adds and removes items from the state according to the checkboxes
  const handleCheckboxChange = (name) => {
    if (activitiesSelected.includes(name)) {
      setActivitiesSelected((prevItems) =>
        prevItems.filter((item) => item !== name)
      );
    } else {
      setActivitiesSelected((prevActivities) => [...prevActivities, name]);
    }
  };

  // Checks if all previous questions are answered
  const arePreviousQuestionsAnswered = (questionIndex) => {
    for (let i = 1; i <= questionIndex; i++) {
      if (responses[i] == null) {
        return i;
      }
    }
    return questionIndex + 1;
  };

  // Automatic scrolling to next question after it has been answered
  const scrollToQuestion = (questionIndex) => {
    const questionRef = questionRefs.current[questionIndex];
    if (questionRef) {
      questionRef.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Makes sure the slider background matches the value of the slider and input
  const handleSlider = (e, questionNumber) => {
    const input = e.target;
    const progress =
      ((input.value - input.min) / (input.max - input.min)) * 100;
    if (input.type === "range") {
      input.style.background = `linear-gradient(to right, var(--blue) ${progress}%,  var(--light-gray) ${progress}%)`;
    }
    if (input.type === "number") {
      const slider = input.parentElement.children[0].children[0];
      slider.style.background = `linear-gradient(to right, var(--blue) ${progress}%,  var(--light-gray) ${progress}%)`;
    }

    // Sets the value of the slider as the response for the given question
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionNumber]: input.value,
    }));
  };

  const handleSubmit = () => {
    // If a different activity is typed then adds the activity to the activities selected state
    if (otherActivity !== "") {
      setActivitiesSelected((prevActivities) => [
        ...prevActivities,
        otherActivity,
      ]);
    }
    // Checks there is at least 1 activity selected
    if (activitiesSelected.length === 0) {
      questionRefs.current[0].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Adds error and timeout for 3 seconds
      questionRefs.current[0].classList.add("error");
      setTimeout(() => questionRefs.current[0].classList.remove("error"), 3000);
      return;
    }
    if (!activityName) {
      questionRefs.current[15].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Adds error and timeout for 3 seconds
      questionRefs.current[15].classList.add("error");
      setTimeout(
        () => questionRefs.current[15].classList.remove("error"),
        3000
      );
      return;
    }
    // Checks that all questions are answered
    const allQuestionsAnswered =
      Object.keys(responses).length === 14 &&
      Object.keys(responses).every(
        (questionId) => responses[questionId] !== ""
      );
    // Scrolls to first unanswered question and marks it in red
    if (!allQuestionsAnswered) {
      const scrollTo = arePreviousQuestionsAnswered(14);
      questionRefs.current[scrollTo].classList.add("error");
      setTimeout(
        () => questionRefs.current[scrollTo].classList.remove("error"),
        3000
      );
      scrollToQuestion(scrollTo);
      return;
    }
    axios
      .post(`${process.env.REACT_APP_URL}responses/create`, {
        email,
        activityName,
        activitiesSelected,
        responses,
      })
      .then((res) => {
        if (res.data.status === "FAILED") {
          console.log(res.data.message);
          return;
        }

        // Reset all the sliders back to 1
        for (let i = 1; i <= 14; i++) {
          questionRefs.current[
            i
          ].children[1].children[0].children[0].style.background = `linear-gradient(to right, var(--blue) 0%,  var(--light-gray) 0%)`;
        }

        // Create an object and set the results in the localstorage
        const results = {
          positive: res.data.positive,
          negative: res.data.negative,
        };
        localStorage.setItem("results", JSON.stringify(results));
        localStorage.setItem("giveThanks", true);

        // Reset all forms of input
        setEmail("");
        setActivitiesSelected([]);
        setActivityName("");
        setOtherActivity("");
        setResponses({});
        setCurrentQuestion();
        navigate("/results");
      })
      .catch((error) => console.log(error));
  };

  // Scrolls to first unanswered question, so that questions are answered in order
  // useEffect(() => {
  //   if (!currentQuestion) return;
  //   const scrollTo = arePreviousQuestionsAnswered(currentQuestion);
  //   scrollToQuestion(scrollTo);
  // }, [currentQuestion, setCurrentQuestion]);

  return (
    <section id="survey">
      <div className="container">
        <article className="img-header">
          <img src={surveyPic} alt="" />
          <div className="header">
            <h1>
              {language === "English"
                ? surveyTranslations[0].english
                : language === "Chinese" && surveyTranslations[0].chinese}
            </h1>
            <p>
              {language === "English"
                ? surveyTranslations[8].english
                : language === "Chinese" && surveyTranslations[8].chinese}
            </p>
          </div>
        </article>
        <article className="description">
          <p>
            {language === "English"
              ? surveyTranslations[1].english
              : language === "Chinese" && surveyTranslations[1].chinese}
          </p>
        </article>
        <form className="survey">
          <div className="question email">
            <h1>
              {language === "English"
                ? surveyTranslations[4].english
                : language === "Chinese" && surveyTranslations[4].chinese}
            </h1>
            <input
              type="text"
              placeholder={
                language === "English"
                  ? surveyTranslations[5].english
                  : language === "Chinese" && surveyTranslations[5].chinese
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div
            className="question email"
            ref={(el) => (questionRefs.current[15] = el)}
          >
            <h1>
              本日參加活動名稱 <span>*</span>
            </h1>
            <input
              type="text"
              placeholder="範例：校園健走活動"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
            />
          </div>
          <article className="scale">
            <p>
              <span>1</span>
              <FaArrowRight />
              <span>5</span>
            </p>
          </article>
          <article className="description">
            <p>活動滿意度調查</p>
          </article>
          <div
            className={`question ${responses[14] == null ? null : "answered"}`}
            ref={(el) => (questionRefs.current[14] = el)}
          >
            <h1>
              本日參加活動的滿意程度 <span>*</span>
            </h1>
            <div className="slider-container">
              <div className="slider">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={responses[14] || 1}
                  onChange={(e) => handleSlider(e, 14)}
                  onMouseUp={() => setCurrentQuestion(14)}
                  onTouchEnd={() => setCurrentQuestion(14)}
                  onClick={(e) => handleSlider(e, 14)}
                />
              </div>
              <div className="value">{responses[14] || "→"}</div>
            </div>
          </div>
          <div
            className="question activity"
            ref={(el) => (questionRefs.current[0] = el)}
          >
            <h1>
              {language === "English"
                ? surveyTranslations[6].english
                : language === "Chinese" && surveyTranslations[6].chinese}{" "}
              <span>*</span>
            </h1>
            <div className="checkbox-container">
              {activities.map((activity) => {
                const { id, name } = activity;
                if (id === 10) {
                  return (
                    <input
                      key={id}
                      type="text"
                      placeholder={name}
                      value={otherActivity}
                      onChange={(e) => setOtherActivity(e.target.value)}
                    />
                  );
                } else {
                  return (
                    <div key={id}>
                      <input
                        type="checkbox"
                        id={id}
                        checked={activitiesSelected.includes(name)}
                        onChange={() => handleCheckboxChange(name)}
                      />
                      <label htmlFor={id}>{name}</label>
                    </div>
                  );
                }
              })}
            </div>
          </div>
          <article className="scale">
            <p>
              {/* <span>
                {language === "English"
                  ? surveyTranslations[2].english
                  : language === "Chinese" && surveyTranslations[2].chinese}
              </span> */}
              <span>1</span>
              <FaArrowRight />
              <span>10</span>
              {/* <span>
                {language === "English"
                  ? surveyTranslations[3].english
                  : language === "Chinese" && surveyTranslations[3].chinese}
              </span> */}
            </p>
          </article>
          <article className="description">
            <p>「量尺可進行滑動或點擊至不同數值」</p>
          </article>
          {questions.map((question) => {
            const { id, statement } = question;
            return (
              <>
                <div
                  key={id}
                  className={`question ${
                    responses[id] == null ? null : "answered"
                  }`}
                  ref={(el) => (questionRefs.current[id] = el)}
                >
                  <h1>
                    {statement} <span>*</span>
                  </h1>
                  <div className="slider-container">
                    <div className="slider">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={responses[id] || 1}
                        onChange={(e) => handleSlider(e, id)}
                        onMouseUp={() => setCurrentQuestion(id)}
                        onTouchEnd={() => setCurrentQuestion(id)}
                        onClick={(e) => handleSlider(e, id)}
                      />
                    </div>
                    <div className="value">{responses[id] || "→"}</div>
                  </div>
                </div>
              </>
            );
          })}
          <div className="primary-button" onClick={() => handleSubmit()}>
            {language === "English"
              ? surveyTranslations[7].english
              : language === "Chinese" && surveyTranslations[7].chinese}
          </div>
        </form>
      </div>
      <Footer />
    </section>
  );
};

export default Survey;
