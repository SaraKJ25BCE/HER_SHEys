import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Reentry — Career Re-Entry & Mentorship for Women in STEM",
  description:
    "A guided path back into STEM: skill assessment, a 5-day Micro-Returnship Sandbox, matched returnships, government schemes, and mentors — in one journey.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
