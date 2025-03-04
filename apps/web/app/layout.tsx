import { Open_Sans } from "next/font/google";

import "@workspace/ui/globals.css";

import ReactQueryProviders from "@/lib/query-client";

import { ThemeProvider } from "@/app/providers/theme-provider";
import { ModalProvider } from "./providers/modal-provider";

const fontSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} font-sans antialiased bg-white dark:bg-[#313338]`}
      >
        <ReactQueryProviders>
          <ThemeProvider>
            <ModalProvider />
            {children}
          </ThemeProvider>
        </ReactQueryProviders>
      </body>
    </html>
  );
}
