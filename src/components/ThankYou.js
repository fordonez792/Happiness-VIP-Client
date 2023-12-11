import React from "react";

const ThankYou = ({ isThankYouOpen, setIsThankYouOpen }) => {
  return (
    <section id="thank-you" className={`${isThankYouOpen ? "active" : null}`}>
      <div className="overlay" onClick={() => setIsThankYouOpen(false)}></div>
      <div className="container">
        <article className="header">
          <h1>感謝填答</h1>
        </article>
        <article className="btn-container">
          <div
            className="primary-button"
            onClick={() => setIsThankYouOpen(false)}
          >
            查看分析結果
          </div>
        </article>
      </div>
    </section>
  );
};

export default ThankYou;
