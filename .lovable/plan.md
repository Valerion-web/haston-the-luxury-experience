# HASTON Production E-Commerce Upgrade

This is a very large scope (23 categories, 100+ features). To ship quality work that matches the existing luxury aesthetic — not stubs — I'll break it into phases you can approve incrementally. All work is **frontend only** (UI + mock data), preserving the current navy/ivory/sand palette, Playfair + Inter typography, glassmorphism, and Framer Motion animations.

## Phase 1 — Header, Hero, Homepage Structure
- **Offer bar** above announcement: Free Shipping ₹999 · Easy Returns · COD · Secure Payments (auto-rotating)
- **Utility nav strip**: Track Order · Store Locator · Support · Language (EN) · Country (IN ₹)
- **Enhanced search** overlay: recent, popular, product + category suggestions
- **Expanded mega menu**: Shirts, T-Shirts, Polos, Overshirts, Trousers, Jeans, Cargo, Shorts, Jackets, Accessories
- **Hero**: auto-rotating slides (Summer, Linen, Premium Cotton, Office, Weekend) with Shop Now / Explore CTAs; video-background ready slot
- **Homepage reorder** to spec; remove any lingering brand-story duplication

## Phase 2 — Category, Collections, Occasion, Fabric
- Expand **Shop by Category** to 11 tiles with hover zoom + Explore overlay
- **Featured Collections** editorial banners: Linen Edit, Black Collection, Office Essentials, Weekend Escape, Premium Cotton, Made for Every Moment
- New **Shop by Occasion** icon grid (8 items)
- New **Shop by Fabric** circular cards (6 fabrics)

## Phase 3 — Product Cards, PLP, PDP
- Product card: add Quick View modal, size chips on hover, discount % badge (already partial)
- **PLP**: filter panel expanded (fabric, fit, sleeve, pattern, collar, occasion, availability, rating, discount); grid toggle 2/3/4
- **PDP**: 360° placeholder, video slot, pincode check, COD availability, delivery ETA, stock indicator, size chart modal, AI size recommender UI, Q&A tab, Frequently Bought Together, Recently Viewed, Complete the Look

## Phase 4 — Cart, Checkout, Account
- **Cart**: coupon field, gift wrap toggle, gift card, shipping estimate, COD charge, tax breakdown, delivery date, recommended products rail
- **Checkout**: guest vs login toggle, saved addresses, payment tabs (UPI, Cards, Wallets, Netbanking, EMI, Razorpay, COD), GST invoice toggle
- **Account dashboard** tabs: Orders, Wishlist, Addresses, Wallet, Coupons, Gift Cards, Returns, Exchanges, Measurements, Saved Cards, Profile, Notifications, Support Tickets, Reward Points

## Phase 5 — Support, Loyalty, AI, Marketing, Footer, Trust
- **Size Guide** page (body + garment tables, fit recs, AI recommender UI)
- **Order Tracking** timeline (8 states)
- **Support**: Live Chat widget, WhatsApp/Email/Phone cards, FAQ accordion, Raise Ticket form
- **HASTON Privilege** loyalty page (Silver/Gold/Platinum tiers + benefits)
- **Mobile App** promo section (Android + iOS badges)
- **AI features hub**: Virtual Try-On, Size Rec, Style Assistant, Mix & Match, Wardrobe (UI mockups)
- Reusable **marketing modules**: Recently Viewed, Trending Now, People Also Bought, Complete the Look, FBT, Limited Stock, Flash Sale countdown
- **Expanded footer** (Company / Support / Policies / Social / Newsletter / Office / Payment & Shipping partners)
- **Trust & Compliance** strip: GSTIN, CIN, address, SSL, Razorpay/Visa/Mastercard/RuPay/UPI/COD, 7-Day Returns, Delhivery/Blue Dart/DTDC
- New legal pages: Shipping, Exchange, Cancellation, Cookie policies

## Technical notes
- Currency switched to **INR ₹** across product data (India-focused per brief)
- All new sections use existing tokens: `glass-panel`, `soft-shadow`, `text-display`, palette vars — no new colors
- New components in `src/components/home/`, `src/components/commerce/`, `src/components/ui-haston/`
- Mock data extended in `src/lib/haston-data.ts` (occasions, fabrics, reviews, FAQs, tiers)
- No backend calls; everything is realistic UI with local state
- Lazy-load heavy sections via `React.lazy` where appropriate; keep bundle sensible

## Deliverables per phase
Each phase = self-contained PR-style commit you can review before I move on. Typecheck kept green throughout.

## Question before I start
Do you want me to **run all 5 phases end-to-end in sequence**, or **ship Phase 1 first for review** before continuing? End-to-end will produce a very large change set in one go; phased lets you course-correct.
