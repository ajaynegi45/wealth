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

export const usersRelations = relations(users, ({ many }) => ({
  fixedDeposits: many(fixedDeposits),
  stocks: many(stocks),
  mutualFunds: many(mutualFunds),
}));
