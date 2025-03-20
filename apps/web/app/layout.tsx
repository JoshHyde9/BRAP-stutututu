import { Open_Sans } from "next/font/google";

import "@workspace/ui/globals.css";

import { ThemeProvider } from "@/providers/theme-provider";

import ReactQueryProviders from "@/lib/query-client";

import { ModalProvider } from "../providers/modal-provider";
import { SocketProvider } from "../providers/ws-provider";

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
        className={`${fontSans.variable} bg-white font-sans antialiased dark:bg-[#313338]`}
      >
        <ReactQueryProviders>
          <ThemeProvider>
            <SocketProvider>
              <ModalProvider />
              {children}
            </SocketProvider>
          </ThemeProvider>
        </ReactQueryProviders>
      </body>
    </html>
  );
}
