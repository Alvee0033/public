import "@/assets/css/popup.css";
import "@/assets/css/video-modal.css";
import GlobalClientOverlays from "@/components/GlobalClientOverlays";
import LayoutWrapper from "@/components/LayoutWrapper";
import PreloaderPrimary from "@/components/shared/others/PreloaderPrimary";
import { Providers } from "@/redux/provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Instrument_Serif, DM_Sans } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-body",
});

export const metadata = {
  title: "ScholarPASS — Find Scholarships, Tutors & Career Bootcamps",
  description:
    "ScholarPASS connects K-12 students to AI-matched scholarships, certified tutors, and job-ready career bootcamps. Start your academic journey today.",
  verification: {
    google: "PGKewHh5sz2-I0G09sUlE5cpYsLq966N5QGlued0RV8",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-white">
      <head>
        {/* Preconnect to speed up font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for API */}
        <link rel="dns-prefetch" href="//localhost:4050" />
      </head>
      <body
        className={`min-h-screen flex flex-col bg-white ${instrumentSerif.variable} ${dmSans.variable}`}
      >
        <PreloaderPrimary />
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
        <GlobalClientOverlays />
        <GoogleAnalytics gaId="G-BTTT7FC17R" />
      </body>
    </html>
  );
}
