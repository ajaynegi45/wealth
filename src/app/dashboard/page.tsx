import { redirect } from "next/navigation";
import { auth } from "@/../auth";
import { NetWorthChart } from "@/components/dashboard/NetWorthChart";
import { getUserAssets } from "@/app/actions/assets";
import { calculateFDCurrentValue } from "@/lib/calculations";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const firstName = session.user?.name?.split(" ")[0] || "User";
  
  // Fetch Assets
  const assets = await getUserAssets();

  return (
    <div className="w-full h-full">
      <div className="mb-8 max-w-lg mx-auto md:mx-0 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
          Welcome back,<br />
          {firstName}.
        </h1>
        <p className="text-foreground/70 text-lg">
          Here is a summary of your financial landscape today.
        </p>
      </div>

      <NetWorthChart assets={assets} />
    </div>
  );
}
