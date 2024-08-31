"use client";
import SectionHeader from "../Common/SectionHeader";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import SingleTestimonial from "./SingleTestimonial";
import { testimonialData } from "./testimonialData";

const Testimonial = () => {
  return (
    <section className="bg-gray-100 dark:bg-gray-900 py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-8 xl:px-0">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <SectionHeader
            headerInfo={{
              title: `TESTIMONIALS`,
              subtitle: `Client’s Testimonials`,
              description: `Hear what our clients have to say about their experience with KarmSetu. Their feedback motivates us to continue delivering top-notch services.`,
            }}
          />
        </motion.div>

        {/* Slider Container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="relative mx-auto max-w-4xl"
        >
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            modules={[Autoplay, Pagination]}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
            }}
            className="rounded-lg shadow-lg overflow-hidden"
          >
            {testimonialData.map((review) => (
              <SwiperSlide
                key={review.id}
                className="p-6 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md transform transition duration-300 ease-in-out hover:scale-105"
              >
                <SingleTestimonial review={review} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination Dots */}
          <div className="absolute bottom-4 w-full flex justify-center">
            <div className="swiper-pagination" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonial;
