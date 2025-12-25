"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    HeartHandshake,
    Database,
    Activity,
    Menu,
    ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Employees", href: "/employees", icon: Users },
    { name: "Interventions", href: "/interventions", icon: HeartHandshake },
    { name: "Data Integration", href: "/data-integration", icon: Database },
    { name: "Model Monitoring", href: "/model-monitoring", icon: Activity },
];

function NavLinks({ onNavigate, collapsed }: { onNavigate?: () => void; collapsed?: boolean }) {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-1">
            {!collapsed && (
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Menu
                </p>
            )}
            {navigation.map((item) => {
                const isActive = pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={onNavigate}
                        className={cn(
                            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                            collapsed && "justify-center px-2",
                            isActive
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                        title={collapsed ? item.name : undefined}
                    >
                        <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "" : "text-muted-foreground group-hover:text-foreground")} />
                        {!collapsed && <span>{item.name}</span>}
                    </Link>
                );
            })}
        </nav>
    );
}

export function Sidebar() {
    const [open, setOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            {/* Mobile sidebar trigger */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="bg-card shadow-md border-border">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 p-0 border-r border-sidebar-border">
                        <div className="flex h-full flex-col bg-sidebar">
                            {/* Logo */}
                            <div className="flex h-[72px] items-center gap-3 border-b border-sidebar-border px-6">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                                    <Activity className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <div>
                                    <span className="text-lg font-bold tracking-tight text-foreground">PERS</span>
                                    <p className="text-xs text-muted-foreground">Employee Retention</p>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex-1 overflow-auto px-4 py-5">
                                <NavLinks onNavigate={() => setOpen(false)} />
                            </div>

                            {/* Footer */}
                            <div className="border-t border-sidebar-border p-4">
                                <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4">
                                    <p className="text-sm font-semibold text-foreground">Predictive Analytics</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        AI-powered retention insights
                                    </p>
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop sidebar */}
            <aside className={cn(
                "hidden lg:flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 sticky top-0",
                collapsed ? "w-[72px]" : "w-72"
            )}>
                {/* Logo */}
                <div className={cn(
                    "flex h-[72px] items-center border-b border-sidebar-border",
                    collapsed ? "justify-center px-2" : "gap-3 px-6"
                )}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                        <Activity className="h-5 w-5 text-primary-foreground" />
                    </div>
                    {!collapsed && (
                        <div>
                            <span className="text-lg font-bold tracking-tight text-foreground">PERS</span>
                            <p className="text-xs text-muted-foreground">Employee Retention</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-auto px-3 py-5">
                    <NavLinks collapsed={collapsed} />
                </div>

                {/* Footer with collapse toggle */}
                <div className="border-t border-sidebar-border p-3">
                    {!collapsed && (
                        <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 mb-3">
                            <p className="text-sm font-semibold text-foreground">Predictive Analytics</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                AI-powered retention insights
                            </p>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCollapsed(!collapsed)}
                        className={cn(
                            "w-full justify-center text-muted-foreground hover:text-foreground",
                            collapsed && "px-2"
                        )}
                    >
                        <ChevronLeft className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            collapsed && "rotate-180"
                        )} />
                        {!collapsed && <span className="ml-2 text-xs">Collapse</span>}
                    </Button>
                </div>
            </aside>
        </>
    );
}
