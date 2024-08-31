import { motion } from "framer-motion";

const FAQItem = ({ faqData }) => {
  const { activeFaq, id, handleFaqToggle, quest, ans } = faqData;

  return (
    <div className="flex flex-col border-b border-gray-200 last-of-type:border-none dark:border-gray-700">
      <button
        onClick={() => handleFaqToggle(id)}
        className="flex items-center justify-between w-full px-6 py-5 text-lg font-semibold text-gray-800 transition-colors duration-300 ease-in-out dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 lg:px-8 lg:py-6 rounded-lg"
      >
        <span className="flex items-center space-x-4">
          <span>{quest}</span>
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-300 ease-in-out ${
            activeFaq === id ? "rotate-180" : "rotate-0"
          }`}
        >
          <path
            d="M6 6l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <motion.div
        initial={false}
        animate={{ height: activeFaq === id ? "auto" : 0 }}
        className="overflow-hidden border-t border-gray-200 dark:border-gray-700"
      >
        <p
          className={`text-base text-gray-600 dark:text-gray-300 px-6 py-5 lg:px-8 lg:py-6 transition-opacity duration-300 ease-in-out ${
            activeFaq === id ? "opacity-100" : "opacity-0"
          }`}
        >
          {ans}
        </p>
      </motion.div>
    </div>
  );
};

export default FAQItem;
