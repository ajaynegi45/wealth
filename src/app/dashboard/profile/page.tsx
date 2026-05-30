import { redirect } from "next/navigation";
import { auth } from "@/../auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }

  const userId = parseInt(session.user.id, 10);
  
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const user = result[0];

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="w-full max-w-2xl mx-auto h-full px-4 sm:px-0">
      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile</h1>
        <p className="text-foreground/70 mt-1">Manage your personal information.</p>
      </div>

      <ProfileForm 
        initialName={user.name} 
        initialEmail={user.email} 
        initialPhone={user.phone || ""} 
      />
    </div>
  );
}
