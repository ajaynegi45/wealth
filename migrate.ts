import 'dotenv/config';
import { db } from './src/db/index';
import { sql } from 'drizzle-orm';

async function migrate() {
  try {
    await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS gross_income numeric(15,2) DEFAULT '0' NOT NULL;`);
    await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS deduction_80c numeric(15,2) DEFAULT '0' NOT NULL;`);
    await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS other_deductions numeric(15,2) DEFAULT '0' NOT NULL;`);
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
  process.exit(0);
}

migrate();
