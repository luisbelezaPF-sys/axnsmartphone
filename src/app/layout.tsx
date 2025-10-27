import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Import all available fonts for AI usage
import "../lib/fonts";
import { CartProvider } from "@/contexts/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AXN Smartphones - iPhones Premium com Garantia",
  description: "Compre iPhones novos e seminovos com garantia. Manutenção especializada e entrega rápida. AXN Smartphones - Tecnologia e Confiança.",
  openGraph: {
    title: "AXN Smartphones - iPhones Premium com Garantia",
    description: "Compre iPhones novos e seminovos com garantia. Manutenção especializada e entrega rápida. AXN Smartphones - Tecnologia e Confiança.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "AXN Smartphones - iPhones Premium com Garantia",
    description: "Compre iPhones novos e seminovos com garantia. Manutenção especializada e entrega rápida. AXN Smartphones - Tecnologia e Confiança.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}