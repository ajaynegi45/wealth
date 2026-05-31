"use server";

import { db } from "@/db";
import { fixedDeposits, stocks, mutualFunds, ppfAccounts, ppfTransactions, bankAccounts } from "@/db/schema";
import { auth } from "@/../auth";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { calculatePPFLedger, calculatePPFMaturity, validatePPFDeposit } from "@/lib/calculations/ppf";

export async function addAsset(data: {
  type: "FD" | "Stock" | "Mutual Fund" | "PPF" | "Bank Balance";
  amount: number;
  startDate: Date;
  metadata?: any;
}) {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    throw new Error("Unauthorized");
  }

  const userRecord = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, session.user!.email!),
  });

  if (!userRecord) throw new Error("User not found");

  if (data.type === "FD") {
    await db.insert(fixedDeposits).values({
      userId: userRecord.id,
      bankName: data.metadata.bankName,
      amount: data.amount.toString(),
      interestRate: data.metadata.interestRate.toString(),
      startDate: data.startDate,
      durationYears: data.metadata.durationYears,
      durationMonths: data.metadata.durationMonths,
      durationDays: data.metadata.durationDays,
      interestPayout: data.metadata.interestPayout,
      compoundingFrequency: data.metadata.compoundingFrequency,
      autoRenew: data.metadata.autoRenew,
    });
  } else if (data.type === "Stock") {
    await db.insert(stocks).values({
      userId: userRecord.id,
      ticker: data.metadata.ticker,
      quantity: data.metadata.quantity.toString(),
      amount: data.amount.toString(),
      startDate: data.startDate,
    });
  } else if (data.type === "Mutual Fund") {
    await db.insert(mutualFunds).values({
      userId: userRecord.id,
      ticker: data.metadata.ticker,
      quantity: data.metadata.quantity.toString(),
      amount: data.amount.toString(),
      startDate: data.startDate,
    });
  } else if (data.type === "PPF") {
    const existing = await db.query.ppfAccounts.findFirst({
      where: (p, { eq }) => eq(p.userId, userRecord.id)
    });
    if (existing) {
      throw new Error("You can only have one PPF account");
    }
    
    if (data.amount % 50 !== 0) throw new Error("Deposit amount must be a multiple of ₹50");
    if (data.amount > 150000) throw new Error("Max allowed deposit in a year is ₹1,50,000");

    const newAccount = await db.insert(ppfAccounts).values({
      userId: userRecord.id,
      openingDate: data.startDate,
      extensionBlocks: 0
    }).returning();

    if (newAccount[0] && data.amount > 0) {
      await db.insert(ppfTransactions).values({
        accountId: newAccount[0].id,
        amount: data.amount.toString(),
        transactionDate: data.startDate,
        type: 'Deposit'
      });
    }
  } else if (data.type === "Bank Balance") {
    await db.insert(bankAccounts).values({
      userId: userRecord.id,
      bankName: data.metadata.bankName,
      accountType: data.metadata.accountType,
      balance: data.amount.toString(),
      interestRate: data.metadata.interestRate?.toString() || "0",
      interestPayout: data.metadata.interestPayout,
      openedAt: data.startDate,
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/portfolio");
  return { success: true };
}

export async function deleteAsset(id: number, type: "FD" | "Stock" | "Mutual Fund" | "PPF" | "Bank Balance") {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    throw new Error("Unauthorized");
  }

  const userRecord = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, session.user!.email!),
  });

  if (!userRecord) throw new Error("User not found");

  if (type === "FD") {
    await db.delete(fixedDeposits).where(and(eq(fixedDeposits.id, id), eq(fixedDeposits.userId, userRecord.id)));
  } else if (type === "Stock") {
    await db.delete(stocks).where(and(eq(stocks.id, id), eq(stocks.userId, userRecord.id)));
  } else if (type === "Mutual Fund") {
    await db.delete(mutualFunds).where(and(eq(mutualFunds.id, id), eq(mutualFunds.userId, userRecord.id)));
  } else if (type === "PPF") {
    await db.delete(ppfAccounts).where(and(eq(ppfAccounts.id, id), eq(ppfAccounts.userId, userRecord.id)));
  } else if (type === "Bank Balance") {
    await db.delete(bankAccounts).where(and(eq(bankAccounts.id, id), eq(bankAccounts.userId, userRecord.id)));
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/portfolio");
  return { success: true };
}

export async function getUserAssets() {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return [];
  }

  const userRecord = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, session.user!.email!),
  });

  if (!userRecord) return [];

  const [fds, stks, mfs, ppfs, bankAccountsData] = await Promise.all([
    db.query.fixedDeposits.findMany({ where: (fd, { eq }) => eq(fd.userId, userRecord.id) }),
    db.query.stocks.findMany({ where: (s, { eq }) => eq(s.userId, userRecord.id) }),
    db.query.mutualFunds.findMany({ where: (mf, { eq }) => eq(mf.userId, userRecord.id) }),
    db.query.ppfAccounts.findMany({ 
      where: (p, { eq }) => eq(p.userId, userRecord.id),
      with: { transactions: true }
    }),
    db.query.bankAccounts.findMany({ where: (b, { eq }) => eq(b.userId, userRecord.id) }),
  ]);

  const standardizedAssets = [
    ...fds.map(fd => ({
      id: fd.id,
      type: "FD" as const,
      amount: fd.amount,
      startDate: fd.startDate,
      metadata: {
        bankName: fd.bankName,
        interestRate: fd.interestRate,
        durationYears: fd.durationYears,
        durationMonths: fd.durationMonths,
        durationDays: fd.durationDays,
        interestPayout: fd.interestPayout,
        compoundingFrequency: fd.compoundingFrequency,
        autoRenew: fd.autoRenew,
      }
    })),
    ...stks.map(s => ({
      id: s.id,
      type: "Stock" as const,
      amount: s.amount,
      startDate: s.startDate,
      metadata: {
        ticker: s.ticker,
        quantity: s.quantity,
      }
    })),
    ...mfs.map(mf => ({
      id: mf.id,
      type: "Mutual Fund" as const,
      amount: mf.amount,
      startDate: mf.startDate,
      metadata: {
        ticker: mf.ticker,
        quantity: mf.quantity,
      }
    })),
    ...ppfs.map(ppf => {
      const { currentBalance } = calculatePPFLedger(ppf.openingDate, ppf.transactions.map(t => ({
        id: t.id,
        amount: Number(t.amount),
        transactionDate: t.transactionDate,
        type: t.type as 'Deposit' | 'Withdrawal' | 'Interest'
      })));
      const maturityDate = calculatePPFMaturity(ppf.openingDate, ppf.extensionBlocks);
      
      return {
        id: ppf.id,
        type: "PPF" as const,
        amount: currentBalance.toString(),
        startDate: ppf.openingDate,
        metadata: {
          maturityDate,
          extensionBlocks: ppf.extensionBlocks,
          transactionsCount: ppf.transactions.length,
          rawTransactions: ppf.transactions.map(t => ({
            id: t.id,
            amount: Number(t.amount),
            transactionDate: t.transactionDate,
            type: t.type
          }))
        }
      };
    }),
    ...bankAccountsData.map(b => ({
      id: b.id,
      type: "Bank Balance" as const,
      amount: b.balance,
      startDate: b.openedAt,
      metadata: {
        bankName: b.bankName,
        accountType: b.accountType,
        interestRate: b.interestRate,
        interestPayout: b.interestPayout,
      }
    }))
  ];

  return standardizedAssets.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

export async function addPPFTransaction(accountId: number, amount: number, date: Date, type: "Deposit" | "Withdrawal") {
  const session = await auth();
  if (!session || !session.user || !session.user.email) throw new Error("Unauthorized");
  
  const userRecord = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, session.user!.email!),
  });
  if (!userRecord) throw new Error("User not found");

  const account = await db.query.ppfAccounts.findFirst({
    where: (p, { and, eq }) => and(eq(p.id, accountId), eq(p.userId, userRecord.id)),
    with: { transactions: true }
  });
  
  if (!account) throw new Error("PPF Account not found");
  
  if (type === 'Deposit') {
    const formattedTx = account.transactions.map(t => ({
      ...t,
      amount: Number(t.amount),
      type: t.type as 'Deposit'|'Withdrawal'
    }));
    const validation = validatePPFDeposit(formattedTx, date, amount);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
  }

  await db.insert(ppfTransactions).values({
    accountId: account.id,
    amount: amount.toString(),
    transactionDate: date,
    type: type,
  });

  revalidatePath("/dashboard/portfolio/ppf");
  revalidatePath("/dashboard/portfolio");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function extendPPFMaturity(accountId: number) {
  const session = await auth();
  if (!session || !session.user || !session.user.email) throw new Error("Unauthorized");
  
  const userRecord = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, session.user!.email!),
  });
  if (!userRecord) throw new Error("User not found");

  const account = await db.query.ppfAccounts.findFirst({
    where: (p, { and, eq }) => and(eq(p.id, accountId), eq(p.userId, userRecord.id)),
  });
  
  if (!account) throw new Error("PPF Account not found");

  await db.update(ppfAccounts).set({
    extensionBlocks: account.extensionBlocks + 1
  }).where(eq(ppfAccounts.id, accountId));

  revalidatePath("/dashboard/portfolio/ppf");
  revalidatePath("/dashboard/portfolio");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deletePPFTransaction(transactionId: number) {
  const session = await auth();
  if (!session || !session.user || !session.user.email) throw new Error("Unauthorized");
  
  const userRecord = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, session.user!.email!),
  });
  if (!userRecord) throw new Error("User not found");

  const transaction = await db.query.ppfTransactions.findFirst({
    where: (t, { eq }) => eq(t.id, transactionId),
  });
  
  if (!transaction) throw new Error("Transaction not found");

  const account = await db.query.ppfAccounts.findFirst({
    where: (p, { and, eq }) => and(eq(p.id, transaction.accountId), eq(p.userId, userRecord.id)),
  });

  if (!account) throw new Error("Unauthorized to delete this transaction");

  await db.delete(ppfTransactions).where(eq(ppfTransactions.id, transactionId));

  revalidatePath("/dashboard/portfolio/ppf");
  revalidatePath("/dashboard/portfolio");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updatePPFTransaction(transactionId: number, amount: number, date: Date, type: "Deposit" | "Withdrawal") {
  const session = await auth();
  if (!session || !session.user || !session.user.email) throw new Error("Unauthorized");
  
  const userRecord = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, session.user!.email!),
  });
  if (!userRecord) throw new Error("User not found");

  const transaction = await db.query.ppfTransactions.findFirst({
    where: (t, { eq }) => eq(t.id, transactionId),
  });
  
  if (!transaction) throw new Error("Transaction not found");

  const account = await db.query.ppfAccounts.findFirst({
    where: (p, { and, eq }) => and(eq(p.id, transaction.accountId), eq(p.userId, userRecord.id)),
    with: { transactions: true }
  });

  if (!account) throw new Error("Unauthorized to edit this transaction");

  if (type === 'Deposit') {
    const formattedTx = account.transactions
      .filter(t => t.id !== transactionId)
      .map(t => ({
        ...t,
        amount: Number(t.amount),
        type: t.type as 'Deposit'|'Withdrawal'
      }));
    const validation = validatePPFDeposit(formattedTx, date, amount);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
  }

  await db.update(ppfTransactions).set({
    amount: amount.toString(),
    transactionDate: date,
    type: type,
  }).where(eq(ppfTransactions.id, transactionId));

  revalidatePath("/dashboard/portfolio/ppf");
  revalidatePath("/dashboard/portfolio");
  revalidatePath("/dashboard");
  return { success: true };
}
