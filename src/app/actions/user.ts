"use server";

import { auth } from "@/../auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateProfile(name: string, phone: string | null) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const userId = parseInt(session.user.id, 10);

  if (!name || name.trim() === "") {
    throw new Error("Name cannot be empty");
  }

  await db
    .update(users)
    .set({
      name: name.trim(),
      phone: phone ? phone.trim() : null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  revalidatePath("/dashboard/profile");
  
  return { success: true };
}
