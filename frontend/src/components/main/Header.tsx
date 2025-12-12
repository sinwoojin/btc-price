"use client";

import { useTheme } from "@/lib/utils/theme-context";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Moon, Search, Sun } from "lucide-react";
import Link from "next/link";

import { useAuth, useUser } from "@/context/AuthUserProvider";
import { useRouter } from "next/navigation";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { accessToken, clearAccessToken } = useAuth();
  const { clearUser } = useUser();
  const router = useRouter();
  const isDark = theme === "dark";

  const textColor = isDark ? "text-white" : "text-black";

  const handleLogout = () => {
    clearAccessToken();
    clearUser();
    router.push("/login");
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  C
                </span>
              </div>
              <span className={`text-xl font-bold ${textColor}`}>
                Coin Arena
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search coins..."
                className={`pl-10 w-64 ${textColor}`}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={`${textColor}`}
            >
              {theme ? (
                <Sun className="w-4 h-4 " />
              ) : (
                <Moon className="w-4 h-4 " />
              )}
            </Button>

            <Link href="/account" className={`${textColor} font-medium hover:opacity-80`}>
              Account
            </Link>

            {accessToken ? (
              <Button onClick={handleLogout} variant="ghost" className={textColor}>
                Logout
              </Button>
            ) : (
              <>
                <Link href={"/login"} className={`${textColor} font-medium hover:opacity-80`}>
                  Login
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
