import hero from "@/assets/hero-main.jpg";
import catKnit from "@/assets/cat-knitwear.jpg";
import catShirts from "@/assets/cat-shirts.jpg";
import catTrousers from "@/assets/cat-trousers.jpg";
import catOuter from "@/assets/cat-outerwear.jpg";
import lb1 from "@/assets/lookbook-1.jpg";
import lb2 from "@/assets/lookbook-2.jpg";
import lb3 from "@/assets/lookbook-3.jpg";
import aboutStory from "@/assets/about-story.jpg";
import collectionBanner from "@/assets/collection-banner.jpg";
import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import p5 from "@/assets/product-5.jpg";
import p6 from "@/assets/product-6.jpg";
import heroNew from "@/assets/hero-new.jpg";
import heroShop from "@/assets/hero-shop.jpg";
import heroLookbook from "@/assets/hero-lookbook.jpg";
import heroJournal from "@/assets/hero-journal.jpg";
import heroAbout from "@/assets/hero-about.jpg";
import aboutHeroEditorial from "@/assets/about-hero-editorial.jpg";
import aboutIntro from "@/assets/about-intro.jpg";
import aboutOrigin from "@/assets/about-origin.jpg";
import aboutPhilosophy from "@/assets/about-philosophy.jpg";
import aboutCraft from "@/assets/about-craft.jpg";
import aboutPeople from "@/assets/about-people.jpg";
import aboutPromise from "@/assets/about-promise.jpg";
import fabricLinen from "@/assets/fabric-linen.jpg";
import fabricKnit from "@/assets/fabric-knit.jpg";
import fabricCotton from "@/assets/fabric-cotton.jpg";
import journalHero from "@/assets/journal-hero.jpg";
import journalPhilosophy from "@/assets/journal-philosophy.jpg";
import journalCraft from "@/assets/journal-craft.jpg";
import journalPeople from "@/assets/journal-people.jpg";
import journalFabric from "@/assets/journal-fabric.jpg";

export const IMG = {
  hero,
  heroNew,
  heroShop,
  heroLookbook,
  heroJournal,
  heroAbout,

  catKnit,
  catShirts,
  catTrousers,
  catOuter,
  lb1,
  lb2,
  lb3,
  aboutStory,
  collectionBanner,
  p1,
  p2,
  p3,
  p4,
  p5,
  p6,
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAt?: number;
  image: string;
  hoverImage: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestseller?: boolean;
  description: string;
};

export const CATEGORIES = [
  { slug: "knitwear", name: "Knitwear", tagline: "Warmth, refined", image: catKnit },
  { slug: "shirts", name: "Shirts", tagline: "Structured softness", image: catShirts },
  { slug: "trousers", name: "Trousers", tagline: "Everyday tailoring", image: catTrousers },
  { slug: "outerwear", name: "Outerwear", tagline: "Considered layers", image: catOuter },
];

export const PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "midnight-oxford-shirt",
    name: "Midnight Oxford Shirt",
    category: "shirts",
    price: 145,
    image: p1,
    hoverImage: p5,
    colors: [
      { name: "Navy", hex: "#0E1A2B" },
      { name: "Ivory", hex: "#F6F3E0" },
      { name: "Olive", hex: "#55684E" },
    ],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviews: 218,
    isBestseller: true,
    description:
      "Long-staple cotton oxford, softened over 60 hours. Tailored for a relaxed drape with unhurried collar roll.",
  },
  {
    id: "2",
    slug: "cashmere-crew-sweater",
    name: "Cashmere Crew Sweater",
    category: "knitwear",
    price: 285,
    compareAt: 340,
    image: p2,
    hoverImage: p1,
    colors: [
      { name: "Sand", hex: "#D8C8B2" },
      { name: "Graphite", hex: "#222222" },
      { name: "Terracotta", hex: "#B4553E" },
    ],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviews: 156,
    isNew: true,
    description:
      "Inner-Mongolian cashmere spun in Italy. A weightless crewneck built to layer year after year.",
  },
  {
    id: "3",
    slug: "field-overshirt-olive",
    name: "Field Overshirt",
    category: "outerwear",
    price: 210,
    image: p3,
    hoverImage: p4,
    colors: [
      { name: "Olive", hex: "#55684E" },
      { name: "Navy", hex: "#0E1A2B" },
      { name: "Sand", hex: "#D8C8B2" },
    ],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.7,
    reviews: 92,
    isBestseller: true,
    description:
      "Cotton-linen twill overshirt with unstructured shoulders and horn buttons. Between shirt and jacket.",
  },
  {
    id: "4",
    slug: "wool-tailored-trouser",
    name: "Wool Tailored Trouser",
    category: "trousers",
    price: 195,
    image: p4,
    hoverImage: p2,
    colors: [
      { name: "Graphite", hex: "#222222" },
      { name: "Navy", hex: "#0E1A2B" },
    ],
    sizes: ["28", "30", "32", "34", "36"],
    rating: 4.9,
    reviews: 143,
    description:
      "Half-lined wool trouser with a clean pleat and gently tapered leg. Structured, never stiff.",
  },
  {
    id: "5",
    slug: "ivory-linen-shirt",
    name: "Ivory Linen Shirt",
    category: "shirts",
    price: 165,
    image: p5,
    hoverImage: p6,
    colors: [
      { name: "Ivory", hex: "#F6F3E0" },
      { name: "Sand", hex: "#D8C8B2" },
      { name: "Denim", hex: "#4A6B8A" },
    ],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviews: 201,
    isNew: true,
    description:
      "Belgian linen, garment-washed. Mother-of-pearl buttons and a soft camp collar for slow afternoons.",
  },
  {
    id: "6",
    slug: "terracotta-pique-polo",
    name: "Terracotta Piqué Polo",
    category: "shirts",
    price: 125,
    image: p6,
    hoverImage: p3,
    colors: [
      { name: "Terracotta", hex: "#B4553E" },
      { name: "Ivory", hex: "#F6F3E0" },
      { name: "Forest", hex: "#2F4A32" },
    ],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviews: 174,
    description: "Heavy piqué cotton polo with a refined placket and unrushed silhouette.",
  },
  {
    id: "7",
    slug: "olive-cotton-chinos",
    name: "Olive Cotton Chinos",
    category: "trousers",
    price: 155,
    image: p4,
    hoverImage: p3,
    colors: [
      { name: "Olive", hex: "#55684E" },
      { name: "Sand", hex: "#D8C8B2" },
      { name: "Navy", hex: "#0E1A2B" },
    ],
    sizes: ["28", "30", "32", "34", "36"],
    rating: 4.7,
    reviews: 89,
    description: "Peached cotton twill chinos, cut lean through the leg with hidden reinforcement.",
  },
  {
    id: "8",
    slug: "sand-merino-turtleneck",
    name: "Sand Merino Turtleneck",
    category: "knitwear",
    price: 175,
    image: p2,
    hoverImage: p5,
    colors: [
      { name: "Sand", hex: "#D8C8B2" },
      { name: "Navy", hex: "#0E1A2B" },
      { name: "Graphite", hex: "#222222" },
    ],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviews: 132,
    description: "18.5 micron merino wool turtleneck. Fine-gauge and soft against skin.",
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const productsByCategory = (cat: string) => PRODUCTS.filter((p) => p.category === cat);

export const JOURNAL = [
  {
    slug: "art-of-slow-dressing",
    title: "The Art of Slow Dressing",
    excerpt: "Why fewer, better pieces still beat the algorithm.",
    category: "Philosophy",
    date: "May 12, 2025",
    image: lb2,
    read: "6 min",
  },
  {
    slug: "cashmere-mongolia",
    title: "Cashmere, from Mongolia to Milan",
    excerpt: "Tracing a single sweater across three continents.",
    category: "Craft",
    date: "April 28, 2025",
    image: aboutStory,
    read: "8 min",
  },
  {
    slug: "portrait-of-a-tailor",
    title: "Portrait of a Tailor",
    excerpt: "Twenty years, one bench, a thousand jackets.",
    category: "People",
    date: "April 3, 2025",
    image: lb3,
    read: "5 min",
  },
  {
    slug: "linen-summer",
    title: "A Summer in Linen",
    excerpt: "The forgiving fabric that ages beautifully.",
    category: "Fabric",
    date: "March 21, 2025",
    image: lb1,
    read: "4 min",
  },
];


/** Currency: display all prices in Indian Rupees. */
export const INR_RATE = 85;
export function inr(amount: number): string {
  return `₹${Math.round(amount * INR_RATE).toLocaleString("en-IN")}`;
}
