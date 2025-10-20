import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LatestActivityMobile, MobileNav, Sidebar, StatusBar } from "@/modules/app";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Provider } from "@/modules/providers";
import { AuthHandler } from "@/modules/app/provider/auth";
import { ScrollArea } from "@/modules/app/scroll-area";
import { LatestActivity } from "@/modules/home/components/latest-activity";


const neue = localFont({
  src: [
    {
      path: "../assets/fonts/NeueMontreal-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/NeueMontreal-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/NeueMontreal-Medium.woff",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-neue",
});

export const metadata: Metadata = {
  title: "DecentraLearn",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${neue.variable} antialiased`}>
        <Provider>
          <div className="flex w-full min-h-screen relative">
            <div className="mt-6 min-w-[15vw] max-[1250px]:min-w-[20vw] flex-shrink-0 min-[1250px]:block hidden pl-6">
              <Sidebar />
            </div>

            <div className="flex-1 flex flex-col max-md:min-h-screen h-screen pb-12">
              <div className="flex-shrink-0">
                <StatusBar />
              </div>

              <div className="flex-1 flex md:gap-6 overflow-hidden relative px-6 max-md:px-4 mt-6">
                <ScrollArea.Root>
                  {children}
                </ScrollArea.Root>
                <div className="flex-shrink-0 min-[1250px]:block hidden">
                  <LatestActivity />
                </div>
                <LatestActivityMobile/>
                <MobileNav/>
              </div>
            </div>
          </div>
         
          <AuthHandler />
        </Provider>
        
      </body>
    </html>
  );
}
