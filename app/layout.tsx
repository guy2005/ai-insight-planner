import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Insight & Action Plan Generator",
  description:
    "วิเคราะห์เนื้อหา สรุปใจความสำคัญ และสกัดเป็น Action Plan อย่างมีระบบด้วย Google Gemini AI",
  keywords: ["AI", "Action Plan", "Gemini 3.8 Flash", "Next.js", "Summarizer"],
  authors: [{ name: "AI Mini-Project Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
