import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "remixicon/fonts/remixicon.css";
import "./globals.css";
import { ThemeProvider } from "@/components/providers";
import { CanvasBackground, ScrollToTop } from "@/components/ui";
import { Footer, Header } from "@/components/common";
import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Muhammad Haris",
    template: "%s · Muhammad Haris",
  },
  description:
    "Portfolio of Muhammad Haris — developer, creator, and engineer.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CanvasBackground />
          <div className="relative flex min-h-full flex-1 flex-col bg-transparent font-sans">
            <Header />
            {children}
            <Footer />
            <ScrollToTop />
          </div>
        </ThemeProvider>
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
