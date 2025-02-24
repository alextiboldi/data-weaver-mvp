import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Data Weaver",
  description: "Visualize, Explore, and Trace Your Data with Ease",
};

async function getProjects() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/projects/list`);
  if (!res.ok) return [];
  return res.json();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const projects = await getProjects();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppSidebar projects={projects} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
