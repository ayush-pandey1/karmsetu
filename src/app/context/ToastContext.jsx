"use client";
import { Toaster } from "react-hot-toast";

const ToasterContext = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "500",
          padding: "12px 18px",
          fontFamily: "var(--font-inter, sans-serif)",
        },
      }}
    />
  );
};

export default ToasterContext;
