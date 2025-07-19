"use client";
import { HomePage } from "@/modules/home";

// import { Banner } from "@/modules/home/components/banner";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BannerSlider } from "@/modules/home/components/banner";

export default function Home() {
  return (
    <main className="flex flex-col w-full min-h-screen px-6 overflow-y-auto overflow-x-clip">
      {/* <Banner /> */}
       {/* <BannerSlider slides={bannerSlides} className="mb-10" /> */}
      <HomePage />
    </main>
  );
}

const bannerSlides = [
  {
    id: 1,
    title: "The Value of Bitcoin",
    img: "/banner.png",
    learners: "10k+",
    avatars: [
      { src: "/avatar1.png", alt: "User 1" },
      { src: "/avatar2.png", alt: "User 2" },
    ],
    ctaLabel: "Get Started",
    onCtaClick: () => console.log("Slide 1 CTA clicked"),
  },
  {
    id: 2,
    title: "DeFi Yield Strategies",
    img: "https://images.unsplash.com/photo-1640622650912-10e7efbd1ee3?w=1200&auto=format&fit=crop&q=60",
    learners: "5k+",
    avatars: [
      { src: "/avatar1.png", alt: "User 1" },
      { src: "/avatar2.png", alt: "User 2" },
    ],
    ctaLabel: "Explore",
    onCtaClick: () => console.log("Slide 2 CTA"),
  },
  {
    id: 3,
    title: "Understanding NFTs & Ownership",
    img: "https://images.unsplash.com/photo-1665597704311-d7304eaf70ac?w=1200&auto=format&fit=crop&q=60",
    learners: "20k+",
    avatars: [
      { src: "/avatar1.png", alt: "User 1" },
      { src: "/avatar2.png", alt: "User 2" },
    ],
    ctaLabel: "Start Learning",
    onCtaClick: () => console.log("Slide 3 CTA"),
  },
];