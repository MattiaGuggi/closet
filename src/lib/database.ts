import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import * as schema from "./schema";
import { users, clothes, outfits } from "./schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

/**
 * Neon serverless connections are stateless HTTP requests,
 * so explicit connection logic is no longer required.
 */
export const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env or .env.local and restart the server."
    );
  }
};

/**
 * Recupera tutti gli utenti dal database Postgres
 */
export const getUsersFromDb = async () => {
  return await db.select().from(users);
};

/**
 * Trova un utente nel DB tramite email
 */
export const getUserFromDb = async (email: string) => {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0] || null;
};

/**
 * Crea un nuovo utente nel DB memorizzando la password cifrata
 */
export const createUserInDb = async (username: string, email: string, password: string) => {
  const existingUser = await getUserFromDb(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const [newUser] = await db
    .insert(users)
    .values({
      username,
      email,
      password: hashedPassword,
    })
    .returning();

  return newUser;
};

/**
 * Updates an existing user
 */
export const updateUserInDb = async (user: schema.UserSelect) => {
  try {
    const [updated] = await db
      .update(users)
      .set(user)
      .where(eq(users.id, user.id))
      .returning();
    return updated;
  } catch (err) {
    console.error("Error updating user", err);
    throw err;
  }
};

/**
 * Deletes a user from the DB
 */
export const deleteUserFromDb = async (user: schema.UserSelect) => {
  try {
    await db.delete(users).where(eq(users.id, user.id));
  } catch (err) {
    console.error("Error deleting user", err);
  }
};

/**
 * Helper function to get every clothing item from DB
 */
export const getAllClothesFromDb = async () => {
  return await db.select().from(clothes);
};

/**
 * Finds clothing items in DB based on creator ID
 */
export const getUserClothesFromDb = async (creatorId: string) => {
  return await db.select().from(clothes).where(eq(clothes.creatorId, creatorId));
};

/**
 * Finds a clothing item in DB based on item ID
 */
export const getClothingFromDb = async (id: string) => {
  const result = await db.select().from(clothes).where(eq(clothes.id, id));
  return result[0] || null;
};

/**
 * Creates clothing item in DB
 */
export const createClothingInDb = async (newClothes: schema.ClothesInsert) => {
  const [created] = await db.insert(clothes).values(newClothes).returning();
  return created;
};

/**
 * Updates an existing clothes item
 */
export const updateClothingInDb = async (clothesItem: schema.ClothesSelect) => {
  try {
    const [updated] = await db
      .update(clothes)
      .set(clothesItem)
      .where(eq(clothes.id, clothesItem.id))
      .returning();
    return updated;
  } catch (err) {
    console.error("Error updating clothes", err);
    throw err;
  }
};

/**
 * Deletes clothing item from DB
 */
export const deleteClothingFromDb = async (clothesItem: schema.ClothesSelect) => {
  try {
    await db.delete(clothes).where(eq(clothes.id, clothesItem.id));
  } catch (err) {
    console.error("Error deleting clothes", err);
  }
};

/**
 * Finds outfits for a specific user, populating top, mid, and bottom references
 */
export const getUserOutfitsFromDb = async (creatorId: string) => {
  return await db.query.outfits.findMany({
    where: eq(outfits.creatorId, creatorId),
    with: {
      top: true,
      mid: true,
      bottom: true,
    },
  });
};

/**
 * Gets all outfits from DB with populated relations
 */
export const getOutfitsFromDb = async () => {
  return await db.query.outfits.findMany({
    with: {
      top: true,
      mid: true,
      bottom: true,
    },
  });
};

/**
 * Finds a single outfit in DB based on ID
 */
export const getOutfitFromDb = async (id: string) => {
  return await db.query.outfits.findFirst({
    where: eq(outfits.id, id),
    with: {
      top: true,
      mid: true,
      bottom: true,
    },
  });
};

/**
 * Creates outfit in DB storing relations by ID
 */
export const createOutfitInDb = async ({
  creatorId,
  topId,
  midId,
  bottomId,
}: {
  creatorId: string;
  topId: string;
  midId: string;
  bottomId: string;
}) => {
  const [outfit] = await db
    .insert(outfits)
    .values({ creatorId, topId, midId, bottomId })
    .returning();

  return outfit;
};

/**
 * Updates an existing outfit
 */
export const updateOutfitInDb = async (outfit: schema.OutfitSelect) => {
  try {
    const [updated] = await db
      .update(outfits)
      .set(outfit)
      .where(eq(outfits.id, outfit.id))
      .returning();
    return updated;
  } catch (err) {
    console.error("Error updating outfit", err);
  }
};

/**
 * Deletes an outfit from the database
 */
export const deleteOutfitFromDb = async (id: string) => {
  try {
    const [deleted] = await db.delete(outfits).where(eq(outfits.id, id)).returning();
    return { success: true, data: deleted };
  } catch (err) {
    console.error("Error deleting outfit", err);
    return { success: false, error: "Errore nel server" };
  }
};

/**
 * Deletes a clothing item from the database by ID
 */
export const deleteItemFromDb = async (id: string) => {
  try {
    const [deleted] = await db.delete(clothes).where(eq(clothes.id, id)).returning();
    return { success: true, data: deleted };
  } catch (err) {
    console.error("Error deleting item", err);
    return { success: false, error: "Errore nel server" };
  }
};