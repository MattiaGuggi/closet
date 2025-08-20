export type Position = "top" | "mid" | "bottom";

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
  modelFileFile?: File;        // <- actual File object
  imagePreview?: string;       // <- for previews
  modelFilePreview?: string;   // <- for previews
};



export type outfitType = {
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
