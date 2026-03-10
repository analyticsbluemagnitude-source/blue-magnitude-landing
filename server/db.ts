import { desc, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, quotes, InsertQuote, Quote } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Quotes (Lead Management)

export async function createQuote(quote: InsertQuote): Promise<Quote> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(quotes).values(quote);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(quotes).where(eq(quotes.id, insertedId)).limit(1);
  return inserted[0];
}

export async function getAllQuotes(): Promise<Quote[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db.select().from(quotes).orderBy(desc(quotes.createdAt));
}

export async function getQuoteById(id: number): Promise<Quote | undefined> {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(quotes).where(eq(quotes.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateQuoteStatus(id: number, status: Quote["status"], notes?: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const updateData: Partial<Quote> = { status };
  if (notes !== undefined) {
    updateData.notes = notes;
  }

  await db.update(quotes).set(updateData).where(eq(quotes.id, id));
}

export async function searchQuotes(searchTerm: string): Promise<Quote[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  const searchPattern = `%${searchTerm}%`;
  return await db
    .select()
    .from(quotes)
    .where(
      or(
        like(quotes.name, searchPattern),
        like(quotes.email, searchPattern),
        like(quotes.phone, searchPattern),
        like(quotes.city, searchPattern)
      )
    )
    .orderBy(desc(quotes.createdAt));
}

// Invites (Collaborator Invitations)

import { invites, InsertInvite, Invite } from "../drizzle/schema";
import { and } from "drizzle-orm";

export async function createInvite(email: string, role: "user" | "admin" = "admin"): Promise<Invite> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Generate a random token
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  // Set expiration to 30 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const invite: InsertInvite = {
    email,
    token,
    role,
    expiresAt,
  };

  const result = await db.insert(invites).values(invite);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(invites).where(eq(invites.id, insertedId)).limit(1);
  return inserted[0];
}

export async function getInviteByToken(token: string): Promise<Invite | undefined> {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db
    .select()
    .from(invites)
    .where(eq(invites.token, token))
    .limit(1);

  if (result.length === 0) return undefined;
  
  const invite = result[0];
  
  // Check if expired
  if (invite.expiresAt < new Date()) {
    return undefined;
  }
  
  // Check if already accepted
  if (invite.acceptedAt !== null) {
    return undefined;
  }

  return invite;
}

export async function acceptInvite(token: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(invites).set({ acceptedAt: new Date() }).where(eq(invites.token, token));
}
