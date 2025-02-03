"use client";

import { LogIn, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { User } from "@/types";

import { ThemeToggle } from "../ThemeToggle";
import DesktopMenu from "./DesktopMenu";
import { menuContents } from "./MenuContent";
import MobileMenu from "./MobileMenu";
import ProfileMenu from "./ProfileMenu";

// Mock user data - replace with actual user data in your implementation
const mockUser: User = {
  // avatar: "/placeholder.svg?height=32&width=32",
  email: "john@example.com",
  // name: "John Doe",
  id: "jasda",
};

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const router = useRouter();

  const handleLogin = () => {
    // Implement your login logic here
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Implement your logout logic here
    setIsLoggedIn(false);
    router.push("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold">Gacha Build Planner</span>
          </Link>
          <div className="hidden md:flex">
            <DesktopMenu menuContents={menuContents} />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <div className="hidden md:flex">
            {isLoggedIn ? (
              <ProfileMenu onLogout={handleLogout} user={mockUser} />
            ) : (
              <Button onClick={handleLogin} variant="ghost">
                <LogIn className="h-4 w-4" />
                <span className="ml-2">Log in</span>
              </Button>
            )}
          </div>
          <div className="md:hidden">
            <Button onClick={toggleMobileMenu} size="icon" variant="ghost">
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="absolute left-0 right-0 top-14 z-50">
          <MobileMenu
            isLoggedIn={isLoggedIn}
            menuContents={menuContents}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        </div>
      )}
    </header>
  );
}
