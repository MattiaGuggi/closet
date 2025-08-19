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
