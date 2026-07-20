import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { BestSellers, NewArrivals } from "@/components/home/BestSellers";
import { AboutBlock } from "@/components/home/AboutBlock";
import { WhyHaston } from "@/components/home/WhyHaston";
import { Lookbook } from "@/components/home/Lookbook";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { Newsletter } from "@/components/home/Newsletter";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ShopByCategory />
      <FeaturedCollection />
      <BestSellers />
      <NewArrivals />
      <AboutBlock />
      <WhyHaston />
      <Lookbook />
      <InstagramFeed />
      <Newsletter />
    </>
  );
}
