import store from '../(redux)/store/store'
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
import Blog from "@/components/Blog";
import Testimonial from "@/components/Testimonial";
import { Provider } from 'react-redux'
// import Hero from "../../components/Hero/index";
// import Brands from "../../components/Brands/index";
// import Feature from "../../components/Features/index";
// import About from "../../components/About/index";
// import FeaturesTab from "../../components/FeaturesTab/index";
// import FunFact from "../../components/FunFact/index";
// import Integration from "../../components/Integration/index";
// import CTA from "../../components/CTA/index";
// import FAQ from "../../components/FAQ/index";
// import Pricing from "../../components/Pricing/index";
// import Contact from "../../components/Contact/index";
// import Blog from "../../components/Blog/index";
// import Testimonial from "../../components/Testimonial/index";
export const metadata = {
  title: "Karmsetu",
  description: "This is Home for Karmsetu",
  // other metadata
};

export default function Home() {
  return (
    // <Provider store={store}>
      <main>
        <Hero />
        <Brands />
        <Feature />
        <About />
        <FeaturesTab />
        <FunFact />
        <Integration />
        <CTA />
        <FAQ />
        <Testimonial />
        <Pricing />
        {/* <Contact /> */}
        <Blog />
      </main>
    // </Provider>
  );
}
