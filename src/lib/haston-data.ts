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

  aboutHeroEditorial,
  aboutIntro,
  aboutOrigin,
  aboutPhilosophy,
  aboutCraft,
  aboutPeople,
  aboutPromise,
  fabricLinen,
  fabricKnit,
  fabricCotton,
  journalHero,
  journalPhilosophy,
  journalCraft,
  journalPeople,
  journalFabric,
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

export type JournalArticle = {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  read: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  pullQuote: string;
  closing: string;
};

export const JOURNAL: JournalArticle[] = [
  {
    slug: "we-believe-luxury-should-be-felt",
    number: "01",
    title: "We Believe Luxury Should Be Felt",
    subtitle: "Philosophy",
    excerpt:
      "Luxury at HASTON is not loud. It is the quiet confidence that comes from wearing something made with purpose.",
    category: "Philosophy",
    date: "Journal No. 01",
    image: journalPhilosophy,
    read: "4 min",
    intro:
      "At HASTON, luxury is not about being loud. It is not a logo, a season, or a statement made for someone else. It is the quiet confidence of wearing something made with purpose — and knowing it without needing to announce it.",
    sections: [
      {
        heading: "Not louder. Better.",
        paragraphs: [
          "We do not design for attention. We design for the person wearing the garment. A piece should feel considered the moment it is picked up, and disappear into ease the moment it is worn.",
          "That belief shapes everything: the restraint in our colour palette, the honesty of our finishing, the decision to leave things out rather than add them in.",
        ],
      },
      {
        heading: "Luxury as a feeling",
        paragraphs: [
          "Luxury, to us, is a feeling rather than a look. It is the weight of a fabric that falls correctly. The collar that holds its shape through the day. The seam that never asks to be adjusted.",
          "When a garment behaves this way, confidence follows quietly. Nothing needs to be proven.",
        ],
      },
      {
        heading: "Built to be lived in",
        paragraphs: [
          "Our pieces are made for everyday life, not for occasions kept at a distance. Work, travel, evenings, weekends — the same garment should move through all of them without effort.",
          "That is why we favour timelessness over trend. A HASTON piece should still feel right years after it was bought.",
        ],
      },
    ],
    pullQuote: "Luxury should be felt, not displayed.",
    closing:
      "This is the standard we hold ourselves to: quieter, more considered, and made to last longer than the moment it was made for.",
  },
  {
    slug: "the-art-of-the-perfect-fit",
    number: "02",
    title: "The Art of the Perfect Fit",
    subtitle: "Craft",
    excerpt:
      "A garment should follow the body naturally — never restricting, never overwhelming. Fit is where craft becomes visible.",
    category: "Craft",
    date: "Journal No. 02",
    image: journalCraft,
    read: "5 min",
    intro:
      "Fit is the most demanding part of what we do, and the least visible. A garment should follow the body naturally — never restricting, never overwhelming. When the fit is right, nothing about it draws attention.",
    sections: [
      {
        heading: "Proportion before decoration",
        paragraphs: [
          "Before a single detail is decided, we settle proportion: the fall of a shoulder, the width of a sleeve, the length that sits correctly whether tucked or left out.",
          "Detail added to a poor proportion only makes the fault louder. So we correct the shape first, and add nothing that the shape does not need.",
        ],
      },
      {
        heading: "Refined through wearing",
        paragraphs: [
          "Patterns are tested on real bodies in real movement — reaching, sitting, walking — not only on a form. Each round of fitting removes a small compromise.",
          "Sometimes that means beginning again. We would rather delay a piece than release one that only looks correct while standing still.",
        ],
      },
      {
        heading: "Finishing that holds",
        paragraphs: [
          "Structure lives in the parts that are rarely seen: clean seam allowances, considered interlinings, collars and cuffs built to keep their shape through repeated wear and washing.",
          "Good finishing is not ornament. It is what allows a garment to stay true to its first day.",
        ],
      },
    ],
    pullQuote: "When the fit is right, the garment stops asking for attention.",
    closing:
      "This is the discipline behind every HASTON piece — fit resolved patiently, so that wearing it requires no thought at all.",
  },
  {
    slug: "the-feeling-of-wearing-haston",
    number: "03",
    title: "The Feeling of Wearing HASTON",
    subtitle: "People",
    excerpt:
      "How a well-made shirt lets you stand a little taller and move through the day with effortless confidence.",
    category: "People",
    date: "Journal No. 03",
    image: journalPeople,
    read: "4 min",
    intro:
      "The people who wear HASTON rarely describe a garment first. They describe how they felt in it — steadier, more at ease, more themselves.",
    sections: [
      {
        heading: "Confidence, quietly",
        paragraphs: [
          "A well-made shirt changes posture before it changes an outfit. You stand a little taller. You stop adjusting. Attention moves outward, to the room and the people in it.",
          "That is the effect we design toward — not admiration of the clothing, but ease in the person wearing it.",
        ],
      },
      {
        heading: "The HASTON man",
        paragraphs: [
          "He is not defined by age or profession. He values quality over noise, chooses carefully, and keeps what works.",
          "He does not dress to be noticed. He dresses to feel prepared — and the difference is visible to anyone paying attention.",
        ],
      },
      {
        heading: "Made for ordinary days",
        paragraphs: [
          "Our pieces are worn to meetings, to dinners, on flights, on unremarkable evenings at home. Everyday life is the real test of a garment.",
          "Clothing that only performs on special occasions has failed most of the week.",
        ],
      },
    ],
    pullQuote: "You should not have to think about what you are wearing.",
    closing:
      "When a garment gives that back — ease, steadiness, quiet confidence — it has done what we asked of it.",
  },
  {
    slug: "we-begin-with-what-you-can-feel",
    number: "04",
    title: "We Begin with What You Can Feel",
    subtitle: "Fabric",
    excerpt:
      "Every HASTON piece starts with material — chosen for touch, durability, and the way it behaves over years.",
    category: "Fabric",
    date: "Journal No. 04",
    image: journalFabric,
    read: "6 min",
    intro:
      "Every HASTON piece begins with material. Before pattern, before detail, we decide what a garment should feel like in the hand and against the skin.",
    sections: [
      {
        heading: "Chosen by touch",
        paragraphs: [
          "Fabric is selected by hand, not by specification alone. Weight, drape, softness and recovery are judged together, because a number on a page cannot describe how a cloth behaves once worn.",
          "If a material does not feel right at the outset, no amount of construction will rescue it.",
        ],
      },
      {
        heading: "Built for durability",
        paragraphs: [
          "We favour materials that hold colour, resist distortion and improve with wear. Linen that softens. Cotton that keeps its structure. Knits that recover their shape.",
          "Durability is part of the design, not an afterthought. A garment that fades in a season was never good value.",
        ],
      },
      {
        heading: "Character over time",
        paragraphs: [
          "The best fabrics age rather than deteriorate. They record wear gently, and become more personal for it.",
          "That is why we choose fewer materials and stay with them — the ones we know will still feel right years from now.",
        ],
      },
    ],
    pullQuote: "If it does not feel right, it does not go further.",
    closing:
      "Material is where quality begins and where it is judged. We start there, every time.",
  },
];

export const getArticle = (slug: string) => JOURNAL.find((j) => j.slug === slug);


/** Currency: display all prices in Indian Rupees. */
export const INR_RATE = 85;
export function inr(amount: number): string {
  return `₹${Math.round(amount * INR_RATE).toLocaleString("en-IN")}`;
}
