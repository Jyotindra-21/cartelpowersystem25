import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/providers/AuthProvider";
import ImagekitProvider from "@/components/providers/ImagekitProvider";


const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <AuthProvider>

        <body
          suppressHydrationWarning
          className={inter.className}
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
