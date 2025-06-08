// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, Search, ShoppingCart } from "lucide-react";
import { Input } from "./ui/input";
import { ModeToggle } from "./ui/modeToggler";

export default function Navbar() {
  const [cartCount] = useState(3); // Mock count
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Implement actual navigation or API call
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="w-full bg-background shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-foreground">
          Buoyant
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-foreground">
            <Link href="/" className="hover:text-gray-400">
                Home
            </Link>
            <Link href="/products" className="hover:text-gray-400">
                Products
            </Link>
            <Link href="/orders" className="hover:text-gray-400">
                Orders
            </Link>
        </nav>

         <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center w-1/2 mx-6"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2"
            />
          </div>
        </form>

        {/* Cart + Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-2 -right-2 text-xs px-1.5 py-0.5">
                {cartCount}
              </Badge>
            )}
          </Link>
          <ModeToggle />

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="mt-6 space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </form>

                {/* Mobile Nav Links */}
                <nav className="flex flex-col gap-4 text-sm font-medium text-gray-600">
                  <Link href="/products" className="hover:text-black">
                    Products
                  </Link>
                  <Link href="/about" className="hover:text-black">
                    About
                  </Link>
                  <Link href="/contact" className="hover:text-black">
                    Contact
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
