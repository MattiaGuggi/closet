import { Types, Document } from "mongoose";
import { Position } from "./types";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  pfp?: string;
}

export interface IClothes extends Document {
  creator: Types.ObjectId | IUser;
  name: string;
  image: string;
  modelFile?: string;
  scale: number;
  position: [number, number, number];
  description: string;
  type: Position;
}

export interface IOutfit extends Document {
  creator: Types.ObjectId | IUser;
  top: IClothes;
  mid: IClothes;
  bottom: IClothes;
}