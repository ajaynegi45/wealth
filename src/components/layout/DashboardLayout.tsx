"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, ArrowLeftRight, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Portfolio", href: "/dashboard/portfolio", icon: Wallet },
  { name: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-separator/30 bg-card/50 backdrop-blur-xl transition-all duration-300 ease-in-out relative ${
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-4 top-15 bg-card border border-separator/50 rounded-full p-1.5 shadow-sm text-muted-foreground hover:text-foreground transition-all z-10 hover:cursor-pointer"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        <div className="flex items-center h-20 border-b border-separator/10 overflow-hidden w-full whitespace-nowrap">
          <div className="w-20 shrink-0 flex items-center justify-center">
            <Wallet className="w-8 h-8 text-tint shrink-0" />
          </div>
          <span className={`font-heading font-bold text-xl text-foreground transition-all duration-300 ${isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>Wealth</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center h-12 rounded-xl transition-all duration-300 group overflow-hidden whitespace-nowrap ${
                  isActive ? "bg-tint/10 text-tint" : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
                title={isSidebarCollapsed ? item.name : undefined}
              >
                <div className="w-[56px] shrink-0 flex items-center justify-center">
                  <item.icon className={`w-5 h-5 ${isActive ? "text-tint" : "text-muted-foreground group-hover:text-foreground"}`} />
                </div>
                <span className={`font-medium text-sm transition-all duration-300 ${isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-separator/10">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={`w-full flex items-center h-12 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-300 group overflow-hidden whitespace-nowrap`}
            title={isSidebarCollapsed ? "Logout" : undefined}
          >
            <div className="w-[56px] shrink-0 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <span className={`font-medium text-sm transition-all duration-300 ${isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto overscroll-contain pb-24 md:pb-0 px-6 md:px-10 lg:px-12 bg-background">
        <div className="max-w-7xl mx-auto py-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 bg-card/85 backdrop-blur-2xl border-t border-separator/30 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-16 px-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? "text-tint" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className={`w-6 h-6 ${isActive ? "text-tint fill-tint/10" : ""}`} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
