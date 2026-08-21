import Navbar           from "@/components/Navbar";
import Hero             from "@/components/Hero";
import WardrobeSection  from "@/components/WardrobeSection";
import AILogic          from "@/components/AILogic";
import ChatSection      from "@/components/ChatSection";
import DiscoverSection from "@/components/Discoversection";
import { CTA }          from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <WardrobeSection />
      <AILogic />
      <ChatSection />
      <DiscoverSection />
     
      <Footer />
    </>
  );
}