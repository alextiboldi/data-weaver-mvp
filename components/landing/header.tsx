"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Header() {
  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Data Weaver
            </Link>
          </div>
          <nav className="hidden md:flex space-x-10">
            <Link
              href="#features"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" className="hidden sm:inline-flex">
              Log in
            </Button>
            <Button>Sign up</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
