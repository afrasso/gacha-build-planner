import type { Metadata } from "next";

import localFont from "next/font/local";

import "./globals.css";

import Header from "@/components/Header";
import { AuthProvider } from "@/contexts/AuthContext";
import { StorageProvider } from "@/contexts/StorageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import getEnvVariable from "@/utils/getenvvariable";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  description: "Manage your Genshin Impact character builds.",
  title: "Genshin Impact Build Manager",
};

const apiUrl = getEnvVariable("API_URL");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider apiUrl={apiUrl}>
          <ThemeProvider>
            <StorageProvider>
              <Header />
              {children}
            </StorageProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
