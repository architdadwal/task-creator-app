// Update your root layout to include the AuthProvider.

import { Inter } from "next/font/google";
import "./globals.css"; // Assuming you have this
import { AuthProvider } from "../context/AuthContext"; // Adjust path

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Task Creator App",
  description: "A simple task creator with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
