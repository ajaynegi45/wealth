"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/../auth";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function getUserTaxProfile() {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    throw new Error("Unauthorized");
  }

  const userRecord = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, session.user!.email!),
  });

  if (!userRecord) throw new Error("User not found");

  return {
    grossIncome: Number(userRecord.grossIncome || 0),
    deduction80c: Number(userRecord.deduction80c || 0),
    otherDeductions: Number(userRecord.otherDeductions || 0),
  };
}

export async function updateUserTaxProfile(data: {
  grossIncome: number;
  deduction80c: number;
  otherDeductions: number;
}) {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    throw new Error("Unauthorized");
  }

  const userRecord = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, session.user!.email!),
  });

  if (!userRecord) throw new Error("User not found");

  await db
    .update(users)
    .set({
      grossIncome: data.grossIncome.toString(),
      deduction80c: data.deduction80c.toString(),
      otherDeductions: data.otherDeductions.toString(),
    })
    .where(eq(users.id, userRecord.id));

  revalidatePath("/dashboard/tax");
  return { success: true };
}
