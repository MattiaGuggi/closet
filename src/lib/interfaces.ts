import { Types, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  pfp?: string;
}

export interface IClothes extends Document {
  name: string;
  image: string;
  modelFile: string;
  scale: number;
  position: [number, number, number];
  description: string;
}

export interface IOutfit extends Document {
  creator: Types.ObjectId | IUser;
  clothes: IClothes[];
}