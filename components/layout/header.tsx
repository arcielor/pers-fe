"use client";

import { Bell, Moon, Sun, Search, MessageSquare, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

interface HeaderProps {
    title: string;
    description?: string;
}

export function Header({ title, description }: HeaderProps) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains("dark");
        setIsDark(isDarkMode);
    }, []);

    const toggleTheme = () => {
        document.documentElement.classList.toggle("dark");
        setIsDark(!isDark);
    };

    return (
        <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-border bg-card/80 backdrop-blur-xl px-4 lg:px-6">
            <div className="flex flex-col lg:ml-0 ml-12">
                <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
                <div className="hidden md:flex relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        className="pl-9 pr-12 w-48 lg:w-64 h-10 rounded-xl bg-background border-border focus:ring-2 focus:ring-primary/20"
                    />
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        ⌘K
                    </kbd>
                </div>

                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="h-10 w-10 rounded-xl hover:bg-accent"
                >
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>

                {/* Messages */}
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl hover:bg-accent hidden sm:flex">
                    <MessageSquare className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl hover:bg-accent">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-white">
                        3
                    </span>
                </Button>

                {/* Separator */}
                <div className="hidden lg:block h-8 w-px bg-border mx-1" />

                {/* Profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 gap-3 rounded-xl px-2 hover:bg-accent">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarFallback className="rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-semibold">
                                    HR
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden lg:flex flex-col items-start">
                                <span className="text-sm font-medium text-foreground">HR Admin</span>
                                <span className="text-xs text-muted-foreground">Administrator</span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-xl">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium">HR Admin</p>
                                <p className="text-xs text-muted-foreground">admin@company.com</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="rounded-lg cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            Profile Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg cursor-pointer">Preferences</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive rounded-lg cursor-pointer">Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
