import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcrypt";
import * as schema from "./schema";
import { users, clothes, outfits } from "./schema";

const dbUrl = process.env.DATABASE_URL || process.env.MONGODB_URI || "";
const sql = neon(dbUrl);
export const db = drizzle(sql, { schema });

/**
 * Normalizes input to extract string IDs whether passed as a string or an object
 */
const getId = (val: any): string => {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val._id || val.id || val.creator || "";
};

export const connectDB = async () => {
  if (!dbUrl) {
    throw new Error(
      "DATABASE_URL or MONGODB_URI is not set in environment variables."
    );
  }
};

export const getUsersFromDb = async () => {
  await connectDB();
  return await db.select().from(users);
};

export const getUserFromDb = async (email: string) => {
  await connectDB();
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0] || null;
};

export const createUserInDb = async (username: string, email: string, password: string) => {
  await connectDB();

  const existingUser = await getUserFromDb(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const [user] = await db
    .insert(users)
    .values({
      username,
      email,
      password: hashedPassword,
    })
    .returning();

  return user;
};

export const updateUserInDb = async (user: any) => {
  await connectDB();
  try {
    const userId = getId(user);
    const [updated] = await db
      .update(users)
      .set(user)
      .where(eq(users._id, userId))
      .returning();
    return updated;
  } catch (err) {
    console.error("Error updating user", err);
  }
};

export const deleteUserFromDb = async (user: any) => {
  await connectDB();
  try {
    const userId = getId(user);
    await db.delete(users).where(eq(users._id, userId));
  } catch (err) {
    console.error("Error deleting user", err);
  }
};

export const getAllClothesFromDb = async () => {
  await connectDB();
  return await db.select().from(clothes);
};

export const getUserClothesFromDb = async (criteria: any) => {
  await connectDB();
  const creatorId = getId(criteria?.creator || criteria);
  return await db.select().from(clothes).where(eq(clothes.creator, creatorId));
};

export const getClothingFromDb = async (criteria: any) => {
  await connectDB();
  if (typeof criteria === "string") {
    const result = await db.select().from(clothes).where(eq(clothes._id, criteria));
    return result[0] || null;
  }
  if (criteria?._id || criteria?.id) {
    const id = getId(criteria);
    const result = await db.select().from(clothes).where(eq(clothes._id, id));
    return result[0] || null;
  }
  if (criteria?.name && criteria?.type) {
    const result = await db
      .select()
      .from(clothes)
      .where(and(eq(clothes.name, criteria.name), eq(clothes.type, criteria.type)));
    return result[0] || null;
  }
  return null;
};

export const createClothingInDb = async (newClothes: any) => {
  await connectDB();

  const creatorId = getId(newClothes.creator || newClothes.creatorId);
  if (!creatorId) {
    throw new Error("Missing creator ID in clothing item creation.");
  }

  const payload: any = {
    creator: creatorId,
    name: newClothes.name,
    image: newClothes.image || "",
    modelFile: newClothes.modelFile || newClothes.model_file || "",
    scale: newClothes.scale ?? 1,
    position: newClothes.position || [0, 0, 0],
    description: newClothes.description || "",
    type: newClothes.type,
  };

  if (newClothes._id) payload._id = newClothes._id;

  const [item] = await db.insert(clothes).values(payload).returning();
  return item;
};

export const updateClothingInDb = async (clothesItem: any) => {
  await connectDB();
  try {
    const itemId = getId(clothesItem);
    const [updated] = await db
      .update(clothes)
      .set(clothesItem)
      .where(eq(clothes._id, itemId))
      .returning();
    return updated;
  } catch (err) {
    console.error("Error updating clothes", err);
    throw err;
  }
};

export const deleteClothingFromDb = async (clothesItem: any) => {
  await connectDB();
  try {
    const itemId = getId(clothesItem);
    await db.delete(clothes).where(eq(clothes._id, itemId));
  } catch (err) {
    console.error("Error deleting clothes", err);
  }
};

export const getUserOutfitsFromDb = async (criteria: any) => {
  await connectDB();
  const creatorId = getId(criteria?.creator || criteria);
  const rows = await db.query.outfits.findMany({
    where: eq(outfits.creator, creatorId),
    with: {
      topItem: true,
      midItem: true,
      bottomItem: true,
    },
  });

  return rows.map((o) => ({
    _id: o._id,
    creator: o.creator,
    top: o.topItem,
    mid: o.midItem,
    bottom: o.bottomItem,
  }));
};

export const getOutfitsFromDb = async () => {
  await connectDB();
  const rows = await db.query.outfits.findMany({
    with: {
      topItem: true,
      midItem: true,
      bottomItem: true,
    },
  });

  return rows.map((o) => ({
    _id: o._id,
    creator: o.creator,
    top: o.topItem,
    mid: o.midItem,
    bottom: o.bottomItem,
  }));
};

export const getOutfitFromDb = async (criteria: any) => {
  await connectDB();
  const id = getId(criteria);
  const o = await db.query.outfits.findFirst({
    where: eq(outfits._id, id),
    with: {
      topItem: true,
      midItem: true,
      bottomItem: true,
    },
  });

  if (!o) return null;

  return {
    _id: o._id,
    creator: o.creator,
    top: o.topItem,
    mid: o.midItem,
    bottom: o.bottomItem,
  };
};

export const createOutfitInDb = async ({ top, mid, bottom, creator }: any) => {
  await connectDB();

  const creatorId = getId(creator);
  const topId = getId(top);
  const midId = getId(mid);
  const bottomId = getId(bottom);

  const [created] = await db
    .insert(outfits)
    .values({
      creator: creatorId,
      top: topId,
      mid: midId,
      bottom: bottomId,
    })
    .returning();

  const fullOutfit = await getOutfitFromDb(created._id);
  return fullOutfit || created;
};

export const updateOutfitInDb = async (outfit: any) => {
  await connectDB();
  try {
    const outfitId = getId(outfit);
    const [updated] = await db
      .update(outfits)
      .set(outfit)
      .where(eq(outfits._id, outfitId))
      .returning();
    return updated;
  } catch (err) {
    console.error("Error updating outfit", err);
  }
};

export const deleteOutfitFromDb = async (id: any) => {
  await connectDB();
  try {
    const outfitId = getId(id);
    const [deleted] = await db.delete(outfits).where(eq(outfits._id, outfitId)).returning();
    return { success: true, data: deleted };
  } catch (err) {
    console.error("Error deleting outfit", err);
    return { success: false, error: "Errore nel server" };
  }
};

export const deleteItemFromDb = async (id: any) => {
  await connectDB();
  try {
    const itemId = getId(id);
    const [deleted] = await db.delete(clothes).where(eq(clothes._id, itemId)).returning();
    return { success: true, data: deleted };
  } catch (err) {
    console.error("Error deleting item", err);
    return { success: false, error: "Errore nel server" };
  }
};