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
          background: "#181C31",
          color: "#FFFFFF",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 15px -3px rgba(139, 92, 246, 0.2)",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "500",
          padding: "12px 18px",
          fontFamily: "var(--font-inter, sans-serif)",
        },
        success: {
          iconTheme: {
            primary: "#20C5A8",
            secondary: "#181C31",
          },
        },
        error: {
          iconTheme: {
            primary: "#EF4444",
            secondary: "#181C31",
          },
        },
        loading: {
          iconTheme: {
            primary: "#8b5cf6",
            secondary: "#181C31",
          },
        },
      }}
    />
  );
};

export default ToasterContext;
