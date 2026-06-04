import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { style_error, style_success } from "@/utils/toast-style";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} relative`}>
        <Toaster
          reverseOrder={false}
          toastOptions={{
            success: style_success,
            error: style_error,
          }}
        />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
