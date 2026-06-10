"use server";

import { db } from "@/db";
import { feedbacks } from "@/db/schema";
import { auth } from "../../../auth";

export async function submitFeedback(data: { type: string; message: string }) {
  try {
    const session = await auth();
    // Allow anonymous feedback if session is null, though typically users might be logged in
    const userId = session?.user?.id ? parseInt(session.user.id) : null;

    if (!data.type || !data.message) {
      return { success: false, error: "Missing required fields" };
    }

    await db.insert(feedbacks).values({
      userId,
      type: data.type,
      message: data.message,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to submit feedback:", error);
    return { success: false, error: "Failed to submit feedback" };
  }
}
