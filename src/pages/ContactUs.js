import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import * as Yup from "yup";

import { contactUsTranslations } from "../assets/translations";
import { useLanguageContext } from "../context/LanguageContext";

const ContactUs = () => {
  const { language } = useLanguageContext();

  const initialValues = {
    name: "",
    email: "",
    subject: "",
    message: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(
      language === "English"
        ? contactUsTranslations[1].english
        : language === "Chinese" && contactUsTranslations[1].chinese
    ),
    email: Yup.string()
      .email(
        language === "English"
          ? contactUsTranslations[2].english
          : language === "Chinese" && contactUsTranslations[2].chinese
      )
      .required(
        language === "English"
          ? contactUsTranslations[3].english
          : language === "Chinese" && contactUsTranslations[3].chinese
      ),
    subject: Yup.string()
      .min(3)
      .max(50)
      .required(
        language === "English"
          ? contactUsTranslations[4].english
          : language === "Chinese" && contactUsTranslations[4].chinese
      ),
    message: Yup.string().required(
      language === "English"
        ? contactUsTranslations[5].english
        : language === "Chinese" && contactUsTranslations[5].chinese
    ),
  });

  const handleSubmit = (data, actions) => {
    axios
      .post(`${process.env.REACT_APP_URL}messages/send-message`, data)
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          actions.resetForm();
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <section id="contact-us">
      <div className="container">
        <article className="header">
          <h1>
            {language === "English"
              ? contactUsTranslations[0].english
              : language === "Chinese" && contactUsTranslations[0].chinese}
          </h1>
        </article>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({ errors }) => (
            <Form className="form-container">
              <div className={`question ${errors.name ? "error" : null}`}>
                <Field
                  autoComplete="off"
                  name="name"
                  placeholder={
                    language === "English"
                      ? contactUsTranslations[6].english
                      : language === "Chinese" &&
                        contactUsTranslations[6].chinese
                  }
                />
              </div>

              <div className={`question ${errors.email ? "error" : null}`}>
                <Field
                  autoComplete="off"
                  name="email"
                  placeholder={
                    language === "English"
                      ? contactUsTranslations[7].english
                      : language === "Chinese" &&
                        contactUsTranslations[7].chinese
                  }
                />
              </div>

              <div className={`question ${errors.subject ? "error" : null}`}>
                <Field
                  autoComplete="off"
                  name="subject"
                  placeholder={
                    language === "English"
                      ? contactUsTranslations[8].english
                      : language === "Chinese" &&
                        contactUsTranslations[8].chinese
                  }
                />
              </div>

              <div className={`question ${errors.message ? "error" : null}`}>
                <Field
                  autoComplete="off"
                  as="textarea"
                  name="message"
                  placeholder={
                    language === "English"
                      ? contactUsTranslations[9].english
                      : language === "Chinese" &&
                        contactUsTranslations[9].chinese
                  }
                />
              </div>
              <button type="submit" className="primary-button">
                {language === "English"
                  ? contactUsTranslations[10].english
                  : language === "Chinese" && contactUsTranslations[10].chinese}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default ContactUs;
