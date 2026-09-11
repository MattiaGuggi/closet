import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and, ne } from "drizzle-orm";
import bcrypt from "bcrypt";
import * as schema from "./schema";
import { users, clothes, outfits, IClothes, IOutfit, gadgets, IGadget } from "./schema";
import { clothesType, gadgetType, outfitType } from "./types";

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

export const getUserFromDb = async (criteria: { _id?: string; email?: string }) => {
  await connectDB();

  if (!criteria) return null;

  if (criteria._id) {
    const [user] = await db.select().from(users).where(eq(users._id, criteria._id));
    return user || null;
  }

  if (criteria.email) {
    const [user] = await db.select().from(users).where(eq(users.email, criteria.email));
    return user || null;
  }

  return null;
};

export const createUserInDb = async (username: string, email: string, password: string) => {
  await connectDB();

  const existingUser = await getUserFromDb({ email });
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

export const getAllGadgetsFromDb = async () => {
  await connectDB();
  return await db.select().from(gadgets);
}

export const getAllClothesFromDb = async () => {
  await connectDB();
  return await db.select().from(clothes);
};

export const getUserClothesFromDb = async (criteria: any) => {
  await connectDB();
  try {
    const creatorId = getId(criteria?.creator || criteria);
    // Clean query: gadgets are no longer in this table
    const rows = await db.query.clothes.findMany({
      where: eq(clothes.creator, creatorId),
    });
    
    return rows; 
  } catch(err) {
    console.error("Error fetching clothes", err);
    return { success: false, error: "Server error" };
  }
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

export const createClothingInDb = async (newClothes: clothesType) => {
  await connectDB();

  const creatorId = getId(newClothes.creator);
  if (!creatorId) {
    throw new Error("Missing creator ID in clothing item creation.");
  }

  if (newClothes.type === "gadget") {
    throw new Error("Gadgets must be saved in the gadgets table, not clothes.");
  }

  const clothesTypeEnum = newClothes.type as "top" | "mid" | "bottom";

  if (newClothes.name && clothesTypeEnum) {
    const existingClothes = await db.query.clothes.findFirst({
      where: and(
        eq(clothes.creator, creatorId),
        eq(clothes.name, newClothes.name),
        eq(clothes.type, clothesTypeEnum)
      )
    });

    if (existingClothes) {
      throw new Error("An item with this name and type already exists in your closet.");
    }
  }

  const payload: any = {
    creator: creatorId,
    name: newClothes.name,
    image: newClothes.image || "",
    modelFile: newClothes.modelFile || "",
    scale: newClothes.scale ?? 1,
    position: newClothes.position || [0, 0, 0],
    description: newClothes.description || "",
    type: clothesTypeEnum,
  };

  if (newClothes._id) payload._id = newClothes._id;

  const [item] = await db.insert(clothes).values(payload).returning();
  return item;
};

export const updateClothingInDb = async (clothesItem: clothesType) => {
  await connectDB();
  try {
    const itemId = getId(clothesItem);
    const creatorId = getId(clothesItem.creator);

    if (clothesItem.type === "gadget") {
      throw new Error("Gadgets must be updated via the gadget endpoint.");
    }

    const [currentClothes] = await db.select().from(clothes).where(eq(clothes._id, itemId));
    if (!currentClothes) throw new Error("Clothing item not found");

    const payload: Partial<IClothes> = {};
    if (clothesItem.name !== undefined) payload.name = clothesItem.name;
    if (clothesItem.image !== undefined) payload.image = clothesItem.image;
    if (clothesItem.modelFile !== undefined) payload.modelFile = clothesItem.modelFile;
    if (clothesItem.scale !== undefined) payload.scale = clothesItem.scale;
    if (clothesItem.position !== undefined) payload.position = clothesItem.position;
    if (clothesItem.description !== undefined) payload.description = clothesItem.description;
    
    if (clothesItem.type !== null && clothesItem.type !== undefined) {
      payload.type = clothesItem.type as "top" | "mid" | "bottom";
    }
    
    if (creatorId) payload.creator = creatorId;

    const mergedName = payload.name ?? currentClothes.name;
    const mergedType = payload.type ?? currentClothes.type;
    const mergedCreator = payload.creator ?? currentClothes.creator;

    const duplicate = await db.query.clothes.findFirst({
      where: and(
        eq(clothes.creator, mergedCreator),
        eq(clothes.name, mergedName),
        eq(clothes.type, mergedType as "top" | "mid" | "bottom")
      )
    });

    if (duplicate && duplicate._id !== itemId) {
      throw new Error("Another item with this name and type already exists in your closet.");
    }

    const [updated] = await db.update(clothes).set(payload).where(eq(clothes._id, itemId)).returning();
      
    return updated;
  } catch (err) {
    console.error("Error updating clothes", err);
    throw err; 
  }
};

export const deleteClothingFromDb = async (clothesItem: clothesType) => {
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

export const getOutfitFromDb = async (criteria: string | number | outfitType) => {
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

  const existingOutfit = await db.query.outfits.findFirst({
    where: and(
      eq(outfits.creator, creatorId),
      eq(outfits.top, topId),
      eq(outfits.mid, midId),
      eq(outfits.bottom, bottomId)
    )
  });

  if (existingOutfit) {
    throw new Error("This outfit combination already exists!");
  }

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

export const getUserGadgetsFromDb = async (criteria: any) => {
  await connectDB();
  try {
    const creatorId = getId(criteria?.creator || criteria);
    const rows = await db.query.gadgets.findMany({
      where: eq(gadgets.creator, creatorId),
    });
    
    return rows;
  } catch(err) {
    console.error("Error fetching gadgets", err);
    return { success: false, error: "Server error" };
  }
};

export const updateOutfitInDb = async (outfit: outfitType) => {
  await connectDB();
  try {
    const outfitId = getId(outfit);

    // Fetch the current outfit to compare changes
    const [currentOutfit] = await db.select().from(outfits).where(eq(outfits._id, outfitId));
    if (!currentOutfit) throw new Error("Outfit not found");

    const payload: Partial<IOutfit> = {};
    if (outfit.creator) payload.creator = getId(outfit.creator);
    if (outfit.top) payload.top = getId(outfit.top);
    if (outfit.mid) payload.mid = getId(outfit.mid);
    if (outfit.bottom) payload.bottom = getId(outfit.bottom);

    // Calculate what the "new" outfit combination will be after update
    const mergedCreator = payload.creator ?? currentOutfit.creator;
    const mergedTop = payload.top ?? currentOutfit.top;
    const mergedMid = payload.mid ?? currentOutfit.mid;
    const mergedBottom = payload.bottom ?? currentOutfit.bottom;

    const duplicate = await db.query.outfits.findFirst({
      where: and(
        eq(outfits.creator, mergedCreator),
        eq(outfits.top, mergedTop),
        eq(outfits.mid, mergedMid),
        eq(outfits.bottom, mergedBottom)
      )
    });

    if (duplicate && duplicate._id !== outfitId) {
      throw new Error("An outfit with this exact combination already exists!");
    }

    const [updated] = await db
      .update(outfits)
      .set(payload)
      .where(eq(outfits._id, outfitId))
      .returning();
      
    return updated;
  } catch (err) {
    console.error("Error updating outfit", err);
    throw err;
  }
};

export const updateGadgetInDb = async (gadget: gadgetType) => {
  await connectDB();
  try {
    const gadgetId = getId(gadget);
    const [currentGadget] = await db.select().from(gadgets).where(eq(gadgets._id, gadgetId));
    if (!currentGadget) throw new Error("Gadget not found");

    const payload: Partial<IGadget> = {};
    if (gadget.creator) payload.creator = getId(gadget.creator);
    if (gadget.name) payload.name = gadget.name;
    if (gadget.image) payload.image = gadget.image;
    if (gadget.description) payload.description = gadget.description;
    if (gadget.type) payload.type = gadget.type;
    if (gadget.modelFile) payload.modelFile = gadget.modelFile;
    if (gadget.scale) payload.scale = gadget.scale;
    if (gadget.position) payload.position = gadget.position;

    const [updated] = await db.update(gadgets).set(payload).where(eq(gadgets._id, gadgetId)).returning();
    return updated;
  } catch (err) {
    console.error("Error updating gadget", err);
    throw err;
  }
}

export const deleteOutfitFromDb = async (id: string | number) => {
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

export const deleteItemFromDb = async (id: string | number) => {
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

export const deleteGadgetFromDb = async (id: string) => {
  await connectDB();
  try {
    const [deletedItem] = await db.delete(gadgets).where(eq(gadgets._id, id)).returning();
      
    if (!deletedItem) {
      throw new Error("Gadget not found or already deleted");
    }
    
    return deletedItem;
  } catch (err) {
    console.error("Error deleting gadget:", err);
    throw new Error("Failed to delete gadget from database");
  }
};

export const createGadgetInDb = async (newGadget: gadgetType) => {
  await connectDB();

  const creatorId = getId(newGadget.creator);
  if (!creatorId) {
    throw new Error("Missing creator ID in gadget creation.");
  }

  // Check for duplicates in the new gadgets table
  if (newGadget.name && newGadget.type) {
    const existingGadget = await db.query.gadgets.findFirst({
      where: and(
        eq(gadgets.creator, creatorId),
        eq(gadgets.name, newGadget.name),
        eq(gadgets.type, newGadget.type)
      )
    });

    if (existingGadget) {
      throw new Error("A gadget with this name and type already exists.");
    }
  }

  const payload: any = {
    creator: creatorId,
    name: newGadget.name,
    image: newGadget.image || "",
    description: newGadget.description || "",
    type: newGadget.type || "gadget",
  };

  if (newGadget._id) payload._id = newGadget._id;

  const [item] = await db.insert(gadgets).values(payload).returning();
  console.log("Created new gadget in DB:", item);
  return item;
};

export const getGadgetFromDb = async (id: string) => {
  await connectDB();
  try {
    const [item] = await db.select().from(gadgets).where(eq(gadgets._id, id));
    return item || null;
  } catch (err) {
    console.error("Error fetching gadget:", err);
    throw new Error("Failed to fetch gadget from database");
  }
};
