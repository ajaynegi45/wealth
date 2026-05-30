"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Must be a valid 10-digit Indian phone number").optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function registerUser(data: z.infer<typeof registerSchema>) {
  try {
    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
      return { error: "Invalid input data" };
    }

    const { name, email, phone, password } = parsed.data;

    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return { error: "User with this email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Failed to register user" };
  }
}
