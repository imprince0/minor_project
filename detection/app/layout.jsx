"use client";
import { Josefin_Sans } from "next/font/google";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`bg-white ${poppins.variable} ${josefin.variable} bg-no-repeat`}>
        <Providers>
          <SessionProvider>
            <div>
              {children}
            </div>
            <Toaster
              toastOptions={{
                success: {
                  theme: 'dark',
                  style: {
                    background: '#333',
                    color: '#fff',
                  }
                },
                error: {
                  theme: 'dark',
                  style: {
                    background: '#ff3333',
                    color: '#fff',
                  }
                }
              }}
              closeOnClick={true}
              draggable={true}
              position="bottom-center"
              reverseOrder={false}
            />
          </SessionProvider>
        </Providers>
      </body>
    </html >
  );
}

