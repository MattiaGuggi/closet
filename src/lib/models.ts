import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    pfp: { type: String, default: 'https://www.starksfamilyfh.com/image/9/original' },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);

const clothesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, default: '' },
    rating: { type: Number, default: 1500 },
    model: { type: String, required: true },
    scale: { type: Number, default: 1 },
    position: { type: [Number], default: [0, 0, 0] },
    description: { type: String, default: '' },
}, { _id: false });

const outfitSchema = new mongoose.Schema({
  creator: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  clothes: { type: [clothesSchema], required: true },
});

export const Outfit = mongoose.models.Outfit || mongoose.model('Outfit', outfitSchema);
