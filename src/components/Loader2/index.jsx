import React from "react";
import "./style.css"

const Loader2 = () => {
  return (
    <div className="h-full w-full flex items-center justify-center text-4xl">
      <div className="container">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
};

export default Loader2;
