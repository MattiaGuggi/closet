import mongoose from "mongoose";
import { User, Outfit } from "./models.js";

/**
 * Connects to MongoDB
 */
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit the process with failure (0 successfull, 1 failure)
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
 * @param {criteria} criteria - The criteria(email/username)
 * @returns {User} User - A user saved in the DB
 */
export const getUserFromDb = async (criteria: any) => {
    await connectDB();
    return await User.findOne(criteria); // Ensure you're passing the correct criteria
};
/**
 * Creates user in DB 
 *
 * @param {newUser} newUser - User to create in DB
*/
export const createUserInDb = async (newUser: any) => {
    await connectDB();
    const existingUser = await User.find({ email: newUser.email });
    // Check if the user already exists
    if (existingUser.length > 0) {
        throw new Error('User already exists');
    }
    const user = new User(newUser);
    await user.save();
};
/**
 * Updates an existing user
 *
 * @param {user} user - the user you need to update
 * @returns {void}
 */
export const updateUserInDb = async (user: any) => {
    await connectDB();
    try  {
        await User.findByIdAndUpdate(user._id, { $set: user }, { new: true }); // Update the user and return the updated document
    } catch (err) {
        console.error('Error updating user', err);
    }
};
/**
 * Updates every users' formation reference from the oldUsername to the newUsername
 *
 * @param {user} user - the user you need to delete
 * @returns {void}
 */
export const deleteUserFromDb = async (user: any) => {
    await connectDB();
    try {
        await User.findByIdAndDelete(user._id); // Delete the user by ID
    } catch (err) {
        console.error('Error deleting user', err);
    }
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
    return await Outfit.findOne(criteria); // Ensure you're passing the correct criteria
};
/**
 * Creates outfit in DB
 *
 * @param {newOutfit} newOutfit - Outfit to create in DB
*/
export const createOutfitInDb = async (newOutfit: any) => {
    await connectDB();
    const outfit = new Outfit(newOutfit);
    await outfit.save();
};
/**
 * Updates an existing outfit
 *
 * @param {outfit} outfit - the outfit you need to update
 * @returns {void}
 */
export const updateOutfitInDb = async (outfit: any) => {
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
export const deleteOutfitFromDb = async (outfit: any) => {
    await connectDB();
    try {
        await Outfit.findByIdAndDelete(outfit._id); // Delete the user by ID
    } catch (err) {
        console.error('Error deleting outfit', err);
    }
};