import store from "../(redux)/store/store";
import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import Feature from "@/components/Features";
import About from "@/components/About";
import FeaturesTab from "@/components/FeaturesTab";
import FunFact from "@/components/FunFact";
import Integration from "@/components/Integration";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Testimonial from "@/components/Testimonial";
import { Provider } from "react-redux";
export const metadata = {
  title: "Karmsetu - Threads of Talent, Woven Locally",
  description: "Freelancing platform curated especially for India",
 
};

export default function Home() {
  return (
    // <Provider store={store}>
    <main>
      <Hero />
      <Brands />
      <Feature />
      <About />
      {/* <FeaturesTab /> */}
      <FunFact />
      <Integration />
      <CTA />
      <FAQ />
      <Testimonial />
      {/* <Pricing /> */}
      {/* <Contact /> */}
      {/* <Blog /> */}
    </main>
    // </Provider>
  );
}
