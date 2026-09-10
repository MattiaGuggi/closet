export type Gadget = "hat" | "glasses" | "bracelet" | "fragrance" | "watch";
export type OutfitPart = "top" | "mid" | "bottom"; // Local type to strictly define the carousel rows
export type Position = OutfitPart | "gadget";

export type clothesType = {
    _id?: number;
    creator?: userType | null;
    name: string;
    image: string;
    modelFile?: string;
    scale: number;
    position: [number, number, number];
    description: string;
    type: Position | null;
};

export type EditableClothesType = clothesType & {
  imageFile?: File;
  modelFileFile?: File;        // Actual file object
  imagePreview?: string;       // For previews
  modelFilePreview?: string;   // For previews
};

export type outfitType = {
    _id?: number;
    creator: userType | null;
    top: clothesType | undefined;
    mid: clothesType | undefined;
    bottom: clothesType | undefined;
};

export type userType = {
    _id: string;
    username: string;
    email: string;
    password: string;
    pfp?: string;
};

export type gadgetType = {
    _id?: number;
    creator: userType | null;
    name: string;
    image: string;
    description: string;
    type: Gadget | null;
};
