import { db } from "@/db";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import { PPFClient } from "./PPFClient";

export default async function PPFPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const userRecord = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, session.user!.email!),
  });
  if (!userRecord) redirect("/login");

  const account = await db.query.ppfAccounts.findFirst({
    where: (p, { eq }) => eq(p.userId, userRecord.id),
    with: { transactions: true }
  });

  if (!account) {
    redirect("/dashboard/portfolio");
  }

  const serializableAccount = {
    ...account,
    openingDate: account.openingDate.toISOString(),
    transactions: account.transactions.map(t => ({
      ...t,
      amount: Number(t.amount),
      transactionDate: t.transactionDate.toISOString()
    }))
  };

  return <PPFClient account={serializableAccount} />;
}
