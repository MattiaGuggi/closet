export type Position = "top" | "mid" | "bottom";

export type clothesType = {
    _id?: number;
    name: string;
    image: string;
    modelFile: string;
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

export const items: clothesType[] = [
    {
        _id: 1,
        name: "T-Shirt",
        image: "/images/tshirt.png",
        modelFile: "/models/tshirt.glb",
        scale: 1,
        position: [0, -0.4, 0],
        description: "A comfortable cotton t-shirt",
        type: "top",
    },
    {
        _id: 2,
        name: "Hoodie",
        image: "/images/hoodie.webp",
        modelFile: "/models/hoodie.glb",
        scale: 0.7,
        position: [0, 0, 0],
        description: "A cozy fleece hoodie for cooler days",
        type: "top",
    },
    {
        _id: 3,
        name: "Jacket",
        image: "/images/jacket.png",
        modelFile: "/models/jacket.glb",
        scale: 1,
        position: [0, 0, 0],
        description: "A stylish leather jacket for layering",
        type: "top",
    },
    {
        _id: 4,
        name: "Jeans",
        image: "/images/jeans.png",
        modelFile: "/models/jeans.glb",
        scale: 0.7,
        position: [0, 0, 0],
        description: "Classic slim-fit denim jeans",
        type: "mid",
    },
    {
        _id: 5,
        name: "Joggers",
        image: "/images/joggers.png",
        modelFile: "/models/joggers.glb",
        scale: 1,
        position: [0, 0, 0],
        description: "Casual cotton joggers for everyday wear",
        type: "mid",
    },
    {
        _id: 6,
        name: "Shorts",
        image: "/images/shorts.png",
        modelFile: "/models/shorts.glb",
        scale: 1,
        position: [0, 0, 0],
        description: "Lightweight shorts for summer days",
        type: "mid",
    },
    {
        _id: 7,
        name: "Sneakers",
        image: "/images/sneakers.png",
        modelFile: "/models/sneakers.glb",
        scale: 0.7,
        position: [0, 0, 0],
        description: "Classic white sneakers that match everything",
        type: "bottom",
    },
    {
        _id: 8,
        name: "Running Shoes",
        image: "/images/running_shoes.png",
        modelFile: "/models/running_shoes.glb",
        scale: 1,
        position: [0, 0, 0],
        description: "Lightweight running shoes for training",
        type: "bottom",
    },
    {
        _id: 9,
        name: "Boots",
        image: "/images/boots.png",
        modelFile: "/models/boots.glb",
        scale: 1,
        position: [0, 0, 0],
        description: "Durable leather boots for outdoor wear",
        type: "bottom",
    },
];
