"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, ArrowLeftRight, User, LogOut, ChevronLeft, ChevronRight, Calculator, Plus } from "lucide-react";
import { signOut } from "next-auth/react";
import { AddAssetModal } from "@/components/portfolio/AddAssetModal";
import { useUIStore } from "@/store/useUIStore";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Portfolio", href: "/dashboard/portfolio", icon: Wallet },
  { name: "Tax Calculator", href: "/dashboard/tax", icon: Calculator },
  { name: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const setAddAssetModalOpen = useUIStore((state) => state.setAddAssetModalOpen);
  
  const MOBILE_NAV_ITEMS = NAV_ITEMS.filter(item => item.name !== "Transactions");

  return (
    <div className="flex min-h-screen bg-background relative">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-separator/30 bg-card/50 backdrop-blur-xl transition-all duration-300 ease-in-out sticky top-0 self-start h-screen ${
          isSidebarCollapsed ? "w-20" : "w-54"
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
                className={`flex items-center h-12 rounded-lg transition-all duration-300 group overflow-hidden whitespace-nowrap ${
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
      <main className="flex-1 w-full pb-24 md:pb-0 px-6 md:px-10 lg:px-12 bg-background">
        <div className="max-w-7xl mx-auto py-8">
          {children}
        </div>
      </main>
      
      <AddAssetModal hideTrigger={true} />

      {/* Mobile Bottom Navigation */}
      <nav 
        className="md:hidden fixed bottom-0 w-full z-40 bg-card/85 backdrop-blur-2xl border-t border-separator/30 pb-[env(safe-area-inset-bottom)]"
        style={{
          maskImage: 'radial-gradient(circle at 50% 0px, transparent 36px, black 37px)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 0px, transparent 36px, black 37px)'
        }}
      >
        <div className="flex items-center justify-between h-16 px-2">
          {MOBILE_NAV_ITEMS.map((item, index) => {
            const isActive = pathname === item.href;
            const isMiddle = index === 2; // Insert space before 3rd item (index 2)
            
            return (
              <Fragment key={item.name}>
                {isMiddle && <div className="w-20 h-full flex-shrink-0" aria-hidden="true" />}
                <Link
                  href={item.href}
                  className="relative flex flex-col items-center justify-center w-full h-full transition-colors group"
                >
                  {isActive && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-tint rounded-b-full shadow-[0_2px_8px_rgba(var(--tint),0.5)]" />
                  )}
                  <item.icon className={`w-6 h-6 transition-all duration-300 ${isActive ? "text-tint scale-110" : "text-muted-foreground hover:text-foreground"}`} />
                </Link>
              </Fragment>
            );
          })}
        </div>
      </nav>

      {/* FAB - Placed outside the nav so it doesn't get masked */}
      <div 
        className="md:hidden fixed left-1/2 -translate-x-1/2 z-[50]"
        style={{ bottom: 'calc(36px + env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={() => setAddAssetModalOpen(true)}
          className="w-14 h-14 bg-tint text-background rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(var(--tint-rgb),0.4)] hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
