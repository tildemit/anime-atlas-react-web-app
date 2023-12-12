// Loading.js
import React from "react";
import { FaSpinner } from "react-icons/fa";
import "./loading.css"; // Import the CSS file

function Loading() {
  return (
    <div className="loading-container">
      <FaSpinner className="loading-icon" size={100} />
    </div>
  );
}

export default Loading;
