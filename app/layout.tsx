import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "MathPickle",
  description: "A modern puzzle ecosystem for teachers and students."
};

const themeBootScript = `
(function () {
  var root = document.documentElement;
  root.classList.add("dark");
  root.setAttribute("data-theme-ready", "true");
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <link rel="preload" as="image" href="/engage-poster.jpg" />
        <link rel="preload" href="/engage-hero.mp4" as="video" type="video/mp4" />
      </head>
      <body className={`${inter.className} bg-canvas text-ink dark:bg-[#08111b] dark:text-white`}>
        <div className="min-h-screen">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}