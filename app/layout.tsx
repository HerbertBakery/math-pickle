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
  try {
    var stored = localStorage.getItem("mathpickle-theme");
    var theme = stored === "light" ? "light" : "dark";
    var root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    root.setAttribute("data-theme-ready", "true");
  } catch (e) {
    document.documentElement.classList.add("dark");
    document.documentElement.setAttribute("data-theme-ready", "true");
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
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