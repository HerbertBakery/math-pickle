import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MathPickle",
  description: "A modern puzzle ecosystem for teachers and students."
};

const themeBootScript = `
(function () {
  try {
    var savedTheme = localStorage.getItem("mathpickle-theme");
    var useDark = savedTheme ? savedTheme === "dark" : true;
    if (useDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  } catch (e) {
    document.documentElement.classList.add("dark");
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-canvas text-ink transition-colors duration-200 dark:bg-[#08111b] dark:text-white`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <div className="min-h-screen">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}