import { pgTable, uuid, varchar, text, real, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users Table
export const users = pgTable("users", {
  _id: uuid("_id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  pfp: text("pfp").default("https://www.starksfamilyfh.com/image/9/original"),
});

// Clothes Table
export const clothes = pgTable("clothes", {
  _id: uuid("_id").defaultRandom().primaryKey(),
  creator: uuid("creator")
    .notNull()
    .references(() => users._id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  image: text("image").default(""),
  modelFile: text("model_file").default(""),
  scale: real("scale").default(1),
  position: jsonb("position").$type<number[]>().default([0, 0, 0]),
  description: text("description").default(""),
  type: varchar("type", { enum: ["top", "mid", "bottom"] }).notNull(),
  layer: varchar("layer", { enum: ["base", "mid", "outer"] }), 
});

// Gadgets Table
export const gadgets = pgTable("gadgets", {
  _id: uuid("_id").defaultRandom().primaryKey(),
  creator: uuid("creator")
    .notNull()
    .references(() => users._id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  image: text("image").default(""),
  modelFile: text("model_file").default(""),
  scale: real("scale").default(1),
  position: jsonb("position").$type<number[]>().default([0, 0, 0]),
  description: text("description").default(""),
  type: varchar("type", { enum: ["hat", "glasses", "bracelet", "fragrance", "watch"] }).notNull(),
});

// Outfits Table
export const outfits = pgTable("outfits", {
  _id: uuid("_id").defaultRandom().primaryKey(),
  creator: uuid("creator")
    .notNull()
    .references(() => users._id, { onDelete: "cascade" }),
  
  topBase: uuid("top_base").references(() => clothes._id, { onDelete: "cascade" }),
  topMid: uuid("top_mid").references(() => clothes._id, { onDelete: "cascade" }),
  topOuter: uuid("top_outer").references(() => clothes._id, { onDelete: "cascade" }),

  mid: uuid("mid")
    .notNull()
    .references(() => clothes._id, { onDelete: "cascade" }),
  bottom: uuid("bottom")
    .notNull()
    .references(() => clothes._id, { onDelete: "cascade" }),
});

// Relational Definitions
export const clothesRelations = relations(clothes, ({ one }) => ({
  creatorUser: one(users, {
    fields: [clothes.creator],
    references: [users._id],
  }),
}));

export const gadgetsRelations = relations(gadgets, ({ one }) => ({
  creatorUser: one(users, {
    fields: [gadgets.creator],
    references: [users._id],
  }),
}));

export const outfitsRelations = relations(outfits, ({ one }) => ({
  creatorUser: one(users, {
    fields: [outfits.creator],
    references: [users._id],
  }),
  topBaseItem: one(clothes, {
    fields: [outfits.topBase],
    references: [clothes._id],
  }),
  topMidItem: one(clothes, {
    fields: [outfits.topMid],
    references: [clothes._id],
  }),
  topOuterItem: one(clothes, {
    fields: [outfits.topOuter],
    references: [clothes._id],
  }),
  midItem: one(clothes, {
    fields: [outfits.mid],
    references: [clothes._id],
  }),
  bottomItem: one(clothes, {
    fields: [outfits.bottom],
    references: [clothes._id],
  }),
}));

export type IUser = typeof users.$inferSelect;
export type IClothes = typeof clothes.$inferSelect;
export type IGadget = typeof gadgets.$inferSelect;
export type IOutfit = typeof outfits.$inferSelect;