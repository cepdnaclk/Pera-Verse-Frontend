import React from "react";
import FeedbackWidget from "../../components/OrganizerDashBoard/FeedbackWidget";
import "./FeedbackPage.css";

const FeedbackPage = () => {
  return (
    <div className="feedback-page">
      <h2>Feedback</h2>
      <FeedbackWidget />
    </div>
  );
};

export default FeedbackPage;
