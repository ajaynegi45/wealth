import Link from "next/link";
import { Wallet } from "lucide-react";
import { auth, signOut } from "@/../auth";

export async function Header() {
  const session = await auth();

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-separator/50">
      <div className="flex justify-between items-center px-6 md:px-10 h-16 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-foreground hover:scale-95 transition-transform cursor-pointer">
          <Wallet className="w-6 h-6 text-tint" />
          <span className="font-heading text-xl font-bold tracking-tight text-foreground">
            Wealth
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#how-it-works" className="font-medium text-sm text-foreground/80 hover:text-tint transition-colors">
            How it Works
          </Link>
          <Link href="/#insights" className="font-medium text-sm text-foreground/80 hover:text-tint transition-colors">
            Insights
          </Link>
          <Link href="/#security" className="font-medium text-sm text-foreground/80 hover:text-tint transition-colors">
            Security
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="hidden md:block font-medium text-sm text-foreground">
                Hello, {session.user?.name}
              </span>
              <form action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}>
                <button type="submit" className="font-medium text-sm px-4 py-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors">
                  Log Out
                </button>
              </form>
              <Link href="/dashboard" className="flow-gradient-btn font-medium text-sm px-5 py-2.5 rounded-full shadow-md">
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden md:block font-medium text-sm px-4 py-2 text-tint hover:bg-tint/10 rounded-full transition-colors">
                Log In
              </Link>
              <Link href="/register" className="flow-gradient-btn font-medium text-sm px-5 py-2.5 rounded-full shadow-md">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
