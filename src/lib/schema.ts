import { pgTable, uuid, varchar, text, real, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users Table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  pfp: text("pfp").default("https://www.starksfamilyfh.com/image/9/original"),
});

// Clothes Table
export const clothes = pgTable("clothes", {
  id: uuid("id").defaultRandom().primaryKey(),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  image: text("image").default(""),
  modelFile: text("model_file").default(""),
  scale: real("scale").default(1),
  position: jsonb("position").$type<number[]>().default([0, 0, 0]),
  description: text("description").default(""),
  type: varchar("type", { enum: ["top", "mid", "bottom"] }).notNull(),
});

// Outfits Table (references Clothes for top, mid, bottom)
export const outfits = pgTable("outfits", {
  id: uuid("id").defaultRandom().primaryKey(),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  topId: uuid("top_id")
    .notNull()
    .references(() => clothes.id, { onDelete: "cascade" }),
  midId: uuid("mid_id")
    .notNull()
    .references(() => clothes.id, { onDelete: "cascade" }),
  bottomId: uuid("bottom_id")
    .notNull()
    .references(() => clothes.id, { onDelete: "cascade" }),
});

// Relational Definitions (Allows populated queries similar to Mongoose)
export const clothesRelations = relations(clothes, ({ one }) => ({
  creator: one(users, {
    fields: [clothes.creatorId],
    references: [users.id],
  }),
}));

export const outfitsRelations = relations(outfits, ({ one }) => ({
  creator: one(users, {
    fields: [outfits.creatorId],
    references: [users.id],
  }),
  top: one(clothes, {
    fields: [outfits.topId],
    references: [clothes.id],
  }),
  mid: one(clothes, {
    fields: [outfits.midId],
    references: [clothes.id],
  }),
  bottom: one(clothes, {
    fields: [outfits.bottomId],
    references: [clothes.id],
  }),
}));

// Export inferred TypeScript types
export type UserSelect = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
export type ClothesSelect = typeof clothes.$inferSelect;
export type ClothesInsert = typeof clothes.$inferInsert;
export type OutfitSelect = typeof outfits.$inferSelect;
export type OutfitInsert = typeof outfits.$inferInsert;