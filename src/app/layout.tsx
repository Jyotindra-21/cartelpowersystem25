import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import NextTopLoader from 'nextjs-toploader';
import AuthProvider from "@/components/providers/AuthProvider";
import ImagekitProvider from "@/components/providers/ImagekitProvider";


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "Cartel | Make Believe",
  description: "cartel power system  automatic rescue device Manufacturing Company.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <AuthProvider>
        <body
          suppressHydrationWarning
          className={`${inter.variable}`}
        >
          <Toaster />
          <NextTopLoader color="#fad000" showSpinner={false} />
          <ImagekitProvider>
            {children}
          </ImagekitProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
