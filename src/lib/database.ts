import mongoose from "mongoose";
import { Outfit, User, Clothes } from "./models";
import { IClothes, IOutfit, IUser } from "./interfaces";
import { outfitType } from "./types";

/**
 * Connects to MongoDB
 */
export const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error(
            'MONGODB_URI is not set. Add it to .env.local or set it in your environment variables and restart the dev server.'
        );
    }
    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
/**
 * Helper function to get every user from MongoDB
 */
export const getUsersFromDb = async () => {
    await connectDB();
    return await User.find({});
}
/**
 * Finds user in DB based on email/username
 *
 * @param {email} email - The email
 * @returns {User} User - A user saved in the DB
 */
export const getUserFromDb = async (email: string) => {
    await connectDB();
    return await User.findOne({ email: email });
};
/**
 * Creates user in DB 
 *
 * @param {username} username - Username of the new user
 * @param {email} email - Email of the new user
 * @param {password} password - Password of the new user
*/
export const createUserInDb = async (username: string, email: string, password: string) => {
    await connectDB();
    const existingUser = await User.find({ email: email });
    // Check if the user already exists
    if (existingUser.length > 0) {
        throw new Error('User already exists');
    }
    const user = new User({ username, email, password });
    await user.save();
};
/**
 * Updates an existing user
 *
 * @param {user} user - the user you need to update
 * @returns {void}
 */
export const updateUserInDb = async (user: IUser) => {
    await connectDB();
    try  {
        await User.findByIdAndUpdate(user._id, { $set: user }, { new: true }); // Update the user and return the updated document
    } catch (err) {
        console.error('Error updating user', err);
    }
};
/**
 * Updates every users' outfit reference from the oldName to the newName
 *
 * @param {user} user - the user you need to delete
 * @returns {void}
 */
export const deleteUserFromDb = async (user: IUser) => {
    await connectDB();
    try {
        await User.findByIdAndDelete(user._id); // Delete the user by ID
    } catch (err) {
        console.error('Error deleting user', err);
    }
};
/**
 * Helper function to get every clothing item from MongoDB
 */
export const getAllClothesFromDb = async () => {
    await connectDB();
    return await Clothes.find({});
}
/**
 * Finds clothing item in DB based on name/type
 *
 * @param {criteria} criteria - The criteria (format: { creator: userId })
 * @returns {Clothes} Clothes - A clothing item saved in the DB for that specific user
 */
export const getUserClothesFromDb = async (criteria: any) => {
    await connectDB();
    return await Clothes.find(criteria);
};
/**
 * Finds clothing item in DB based on name/type
 *
 * @param {criteria} criteria - The criteria(name/type)
 * @returns {Clothes} Clothes - A clothing item saved in the DB
 */
export const getClothingFromDb = async (criteria: any) => {
    await connectDB();
    return await Clothes.findOne(criteria);
};
/**
 * Creates clothing item in DB 
 *
 * @param {newClothes} newClothes - Clothing item to create in DB
 * @returns {Clothes} - The created clothing item
*/
export const createClothingInDb = async (newClothes: IClothes) => {
    await connectDB();
    const clothes = new Clothes(newClothes);
    await clothes.save();
    return clothes; // Return the created clothing item
};
/**
 * Updates an existing clothes
 *
 * @param {clothes} clothes - the clothing item you need to update
 * @returns {void}
 */
export const updateClothingInDb = async (clothes: IClothes) => {
  await connectDB();
  try {
    const updated = await Clothes.findByIdAndUpdate(
      clothes._id,
      { $set: clothes },
      { new: true } // return the updated document
    );
    return updated;
  } catch (err) {
    console.error("Error updating clothes", err);
    throw err;
  }
};
/**
 * Updates every clothes' outfit reference from the oldName to the newName
 *
 * @param {clothes} clothes - the clothes you need to delete
 * @returns {void}
 */
export const deleteClothingFromDb = async (clothes: IClothes) => {
    await connectDB();
    try {
        await Clothes.findByIdAndDelete(clothes._id); // Delete the clothing item by ID
    } catch (err) {
        console.error('Error deleting clothes', err);
    }
};
/**
 * Finds outfit in DB based on id
 *
 * @param {criteria} criteria - The criteria (in format: { creator: userId })
 * @returns {Outfit} Outfit - A outfit saved in the DB
 */
export const getUserOutfitsFromDb = async (criteria: any) => {
    await connectDB();
    return await Outfit.find(criteria);
};
/**
 * Helper function to get every outfit from MongoDB
 */
export const getOutfitsFromDb = async () => {
    await connectDB();
    return await Outfit.find({});
}
/**
 * Finds outfit in DB based on id
 *
 * @param {criteria} criteria - The criteria(id)
 * @returns {Outfit} Outfit - A outfit saved in the DB
 */
export const getOutfitFromDb = async (criteria: any) => {
    await connectDB();
    return await Outfit.findOne(criteria);
};
/**
 * Creates outfit in DB
 *
 * @param {top, mid, bottom, creator} params of an outfit - Outfit to create in DB
 * @returns {Outfit} Outfit - The created outfit
*/
export const createOutfitInDb = async ({ top, mid, bottom, creator }: outfitType) => {
    await connectDB();
    const outfit = new Outfit({ top, mid, bottom, creator });
    await outfit.save();

    return outfit;
};
/**
 * Updates an existing outfit
 *
 * @param {outfit} outfit - the outfit you need to update
 * @returns {void}
 */
export const updateOutfitInDb = async (outfit: IOutfit) => {
    await connectDB();
    try  {
        await Outfit.findByIdAndUpdate(outfit._id, { $set: outfit }, { new: true }); // Update the user and return the updated document
    } catch (err) {
        console.error('Error updating outfit', err);
    }
};
/**
 * Deletes a outfit from the database
 *
 * @param {outfit} outfit - the outfit you need to delete
 * @returns {void}
 */
export const deleteOutfitFromDb = async (outfit: IOutfit) => {
    await connectDB();
    try {
        await Outfit.findByIdAndDelete(outfit._id); // Delete the user by ID
    } catch (err) {
        console.error('Error deleting outfit', err);
    }
};
