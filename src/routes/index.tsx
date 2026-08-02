import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { BestSellers, NewArrivals } from "@/components/home/BestSellers";
import { FeaturedCasualCollections } from "@/components/home/FeaturedCasualCollections";
import { WhyHaston } from "@/components/home/WhyHaston";
import { Lookbook } from "@/components/home/Lookbook";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { EditorialStrip } from "@/components/home/EditorialStrip";
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
      <NewArrivals />
      <FeaturedCasualCollections />
      <FeaturedCollection />
      <BestSellers />
      <EditorialStrip />
      <WhyHaston />

      <Lookbook />
      <InstagramFeed />
      <Newsletter />
    </>
  );
}
