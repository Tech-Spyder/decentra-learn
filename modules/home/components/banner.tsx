// import Image from "next/image";
// import React, { CSSProperties } from "react";
// import Slider from "react-slick";
// import { ChevronRight } from "lucide-react";

// const bannerImages = [
//   '/banners/1.jpg', '/banners/2.jpg', '/banners/3.jpg'
// ];

// export function Banner() {
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     nextArrow: <CustomArrow direction="next" />,
//     prevArrow: <CustomArrow direction="prev" />,
//   };

//   return (
//       <Slider {...settings}>
//         {bannerImages.map((banner, idx) => (
//           <div
//             key={idx}
//             className="relative w-full h-[400px]"
//           >
//             <Image
//               src={banner}
//               alt={`Banner ${idx + 1}`}
//               width={1000}
//               height={400}
//               className="object-contain rounded-xl absolute inset-0"
//               priority={idx === 0}
//             />
//           </div>
//         ))}
//       </Slider>
//   );
// }

// interface CustomArrowProps {
//   className?: string;
//   style?: CSSProperties;
//   onClick?: () => void;
//   direction: "next" | "prev";
// }

// const CustomArrow = ({
//   className,
//   style,
//   onClick,
//   direction,
// }: CustomArrowProps) => {
//   return (
//     <div
//       className={`${className} custom-arrow custom-arrow-${direction}`}
//       style={{
//         ...style,
//         display: "flex",
//         alignItems: "center",
//         width: '44px',
//         height:'44px',
//         justifyContent: "center",
//         borderRadius: "50%",
//         padding: "8px",
//         zIndex: 10,
//         background: "rgb(255, 255, 255, 0.10)",
//         ...(direction === "prev" ? { left: "10px" } : { right: "10px" }),
//         top: "50%",
//         transform: "translateY(-50%)",
//         position: "absolute",
//       }}
//       onClick={onClick}
//     >
//       {direction === "next" ? (
//         <ChevronRight size={32} color="#ffffff" />
//       ) : (
//         <ChevronRight size={32} color="#ffffff" className="rotate-180" />
//       )}
//     </div>
//   );
// };
"use client";
import React from "react";
import Slider, { Settings } from "react-slick";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import cn from "classnames";
import { Button } from "@/modules/app";
import { useRouter } from "next/navigation";

type BannerSlide = {
  id: React.Key;
  title: string;
  img: string;
  learners?: string;
  avatars?: { src: string; alt: string }[];
  ctaLabel?: string;
  onCtaClick?: () => void;
};

interface BannerSliderProps {
  slides: BannerSlide[];
  className?: string;
}

export function BannerSlider({ slides, className }: BannerSliderProps) {
  const settings: Settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <Arrow dir="next" />,
    prevArrow: <Arrow dir="prev" />,
    appendDots: (dots) => (
      <ul className="!m-0 !p-0 absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
        {dots}
      </ul>
    ),
    customPaging: () => (
      <button className="block w-2 h-2 rounded-full bg-zinc-400/70 hover:bg-indigo-400" />
    ),
  };
  const router = useRouter();
  return (
    <div className={cn("relative w-full overflow-x-clip", className)}>
      {/* <Slider {...settings}>
        {slides.map((s) => (
          <div key={s.id} className="!px-0">
            <div className="relative h-64 md:h-80 xl:h-[350px] overflow-hidden rounded-2xl bg-[#1a1a1c]">
              <Image
                src={s.img}
                alt={s.title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-0 left-0 p-6 md:p-8 max-w-[70%]">
                <h2 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
                  {s.title}
                </h2>
                {(s.avatars?.length || s.learners) && (
                  <div className="flex items-center gap-2 mb-4">
                    {s.avatars?.slice(0, 2).map((a, i) => (
                      <Image
                        key={i}
                        src={a.src}
                        alt={a.alt}
                        width={28}
                        height={28}
                        className={cn(
                          "rounded-full ring-2 ring-white/20",
                          i > 0 && "-ml-2"
                        )}
                      />
                    ))}
                    {s.learners && (
                      <span className="bg-white text-black px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                        {s.learners}
                      </span>
                    )}
                  </div>
                )}
                {s.ctaLabel && (
                  <button
                    onClick={s.onCtaClick}
                    className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {s.ctaLabel}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </Slider> */}
      <Image
        src={"/banners/2.jpg"}
        alt={"banner"}
        width={2000}
        height={400}
        priority
        className="object-cover max-h-[400px] rounded-3xl"
      />
      <div className="absolute top-1/2 left-6 z-30 transform -translate-y-[50%] flex flex-col gap-8">
        <h1 className="text-4xl max-sm:text-xl font-semibold text-white">
          Welcome to The <br /> Decentralized Learning Platform.
        </h1>

        <Button onClick={() => router.push('/learning')} className="w-fit px-4 py-1 cursor-pointer">Explore</Button>
      </div>

      <div className="bg-black/60 absolute inset-0 rounded-3xl z-10"></div>
    </div>
  );
}

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  dir: "prev" | "next";
}

function Arrow({ className, style, onClick, dir }: ArrowProps) {
  const isPrev = dir === "prev";
  return (
    <button
      type="button"
      aria-label={isPrev ? "Previous slide" : "Next slide"}
      className={cn(
        "group !absolute top-1/2 -translate-y-1/2 z-10 p-2 rounded-full",
        "bg-black/30 hover:bg-black/50 transition-colors",
        isPrev ? "left-4" : "right-4",
        className
      )}
      style={style}
      onClick={onClick}
    >
      {isPrev ? (
        <ChevronLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
      ) : (
        <ChevronRight className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
      )}
    </button>
  );
}
