"use client";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Product
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  href="#"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                >
                  Integrations
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                >
                  API
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  href="#"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  href="#"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </Link>
          </div>
          <p className="mt-8 text-base text-muted-foreground md:mt-0 md:order-1">
            &copy; 2023 StreamLine, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
