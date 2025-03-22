import { Open_Sans } from "next/font/google";

import "@workspace/ui/globals.css";

import { ThemeProvider } from "@/providers/theme-provider";

import { Toaster } from "@workspace/ui/components/sonner";

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
              <Toaster
                toastOptions={{
                  unstyled: true,
                  duration: 2000,
                  className:
                    "py-4 px-10 rounded-md shadow-lg border border-current/12 text-sm flex gap-2 bg-zinc-200 items-center text-foreground dark:bg-[#1e1f22]",
                }}
              />
              {children}
            </SocketProvider>
          </ThemeProvider>
        </ReactQueryProviders>
      </body>
    </html>
  );
}
