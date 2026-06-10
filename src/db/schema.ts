import { pgTable, serial, varchar, timestamp, integer, boolean, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  password: varchar("password", { length: 255 }).notNull(),
  grossIncome: numeric("gross_income", { precision: 15, scale: 2 }).default("0").notNull(),
  deduction80c: numeric("deduction_80c", { precision: 15, scale: 2 }).default("0").notNull(),
  otherDeductions: numeric("other_deductions", { precision: 15, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const fixedDeposits = pgTable("fixed_deposits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  bankName: varchar("bank_name", { length: 255 }).notNull(),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  interestRate: numeric("interest_rate", { precision: 5, scale: 2 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  durationYears: integer("duration_years").default(0).notNull(),
  durationMonths: integer("duration_months").default(0).notNull(),
  durationDays: integer("duration_days").default(0).notNull(),
  interestPayout: varchar("interest_payout", { length: 50 }).notNull(), // e.g. Maturity, Monthly, Quarterly
  compoundingFrequency: varchar("compounding_frequency", { length: 50 }).default("Quarterly").notNull(), // Daily, Monthly, Quarterly, Yearly
  autoRenew: boolean("auto_renew").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const stocks = pgTable("stocks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  ticker: varchar("ticker", { length: 50 }).notNull(),
  quantity: numeric("quantity", { precision: 15, scale: 4 }).notNull(),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(), // Total invested amount
  startDate: timestamp("start_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const mutualFunds = pgTable("mutual_funds", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  ticker: varchar("ticker", { length: 50 }),
  quantity: numeric("quantity", { precision: 15, scale: 4 }).notNull(),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(), // Total invested amount
  startDate: timestamp("start_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ppfAccounts = pgTable("ppf_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  openingDate: timestamp("opening_date").notNull(),
  extensionBlocks: integer("extension_blocks").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ppfTransactions = pgTable("ppf_transactions", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id")
    .references(() => ppfAccounts.id, { onDelete: "cascade" })
    .notNull(),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  transactionDate: timestamp("transaction_date").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // "Deposit" or "Withdrawal"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bankAccounts = pgTable("bank_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  bankName: varchar("bank_name", { length: 255 }).notNull(),
  accountType: varchar("account_type", { length: 50 }).notNull(), // "Savings" or "Current"
  balance: numeric("balance", { precision: 15, scale: 2 }).notNull(),
  interestRate: numeric("interest_rate", { precision: 5, scale: 2 }).default("0").notNull(),
  interestPayout: varchar("interest_payout", { length: 50 }), // e.g. Monthly, Quarterly, Yearly
  openedAt: timestamp("opened_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  fixedDeposits: many(fixedDeposits),
  stocks: many(stocks),
  mutualFunds: many(mutualFunds),
  ppfAccounts: many(ppfAccounts),
  bankAccounts: many(bankAccounts),
  feedbacks: many(feedbacks),
}));

export const ppfAccountsRelations = relations(ppfAccounts, ({ one, many }) => ({
  user: one(users, {
    fields: [ppfAccounts.userId],
    references: [users.id],
  }),
  transactions: many(ppfTransactions),
}));

export const ppfTransactionsRelations = relations(ppfTransactions, ({ one }) => ({
  account: one(ppfAccounts, {
    fields: [ppfTransactions.accountId],
    references: [ppfAccounts.id],
  }),
}));

export const feedbacks = pgTable("feedbacks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "set null" }),
  type: varchar("type", { length: 50 }).notNull(), // 'suggestion', 'bug', 'mistake', 'other'
  message: varchar("message", { length: 5000 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const feedbacksRelations = relations(feedbacks, ({ one }) => ({
  user: one(users, {
    fields: [feedbacks.userId],
    references: [users.id],
  }),
}));

