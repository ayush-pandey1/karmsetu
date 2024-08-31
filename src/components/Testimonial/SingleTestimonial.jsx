import Image from "next/image";

const SingleTestimonial = ({ review }) => {
  const { name, designation, image, content } = review;

  return (
    <div className="relative rounded-lg bg-white p-8 pt-6 shadow-lg transition-transform transform hover:scale-105 dark:bg-gray-800 dark:border dark:border-gray-700 dark:shadow-none">
      {/* Avatar and Information */}
      <div className="flex items-start mb-6 border-b border-gray-200 pb-4 dark:border-gray-700">
        <Image
          src={image}
          alt={name}
          width={60}
          height={60}
          className="rounded-full shadow-lg"
        />
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {designation}
          </p>
        </div>
      </div>

      {/* Testimonial Content */}
      <p className="text-base text-gray-800 dark:text-gray-300 italic leading-relaxed">
        "{content}"
      </p>

      {/* Decorative Element */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-100 dark:to-gray-900 rounded-lg opacity-20 -z-10" />
    </div>
  );
};

export default SingleTestimonial;
