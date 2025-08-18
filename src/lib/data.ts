export type itemStateType = {
    _id: number;
    name: string;
    image: string;
    model: string;
    scale: number;
    position: [number, number, number];
    description: string;
};

type itemsType = {
    [key: string]: itemStateType[];
};

export type Position = "top" | "mid" | "bottom";

export const items: itemsType = {
    top: [
        {
            _id: 1,
            name: "T-Shirt",
            image: "/images/tshirt.png",
            model: "/models/tshirt.glb",
            scale: 1,
            position: [0, -0.4, 0],
            description: "A comfortable cotton t-shirt",
        },
        {
            _id: 2,
            name: "Hoodie",
            image: "/images/hoodie.webp",
            model: "/models/hoodie.glb",
            scale: 0.7,
            position: [0, 0, 0],
            description: "A cozy fleece hoodie for cooler days",
        },
        {
            _id: 3,
            name: "Jacket",
            image: "/images/jacket.png",
            model: "/models/jacket.glb",
            scale: 1,
            position: [0, 0, 0],
            description: "A stylish leather jacket for layering",
        },
    ],
    mid: [
        {
            _id: 4,
            name: "Jeans",
            image: "/images/jeans.png",
            model: "/models/jeans.glb",
            scale: 0.7,
            position: [0, 0, 0],
            description: "Classic slim-fit denim jeans",
        },
        {
            _id: 5,
            name: "Joggers",
            image: "/images/joggers.png",
            model: "/models/joggers.glb",
            scale: 1,
            position: [0, 0, 0],
            description: "Casual cotton joggers for everyday wear",
        },
        {
            _id: 6,
            name: "Shorts",
            image: "/images/shorts.png",
            model: "/models/shorts.glb",
            scale: 1,
            position: [0, 0, 0],
            description: "Lightweight shorts for summer days",
        },
    ],
    bottom: [
        {
            _id: 7,
            name: "Sneakers",
            image: "/images/sneakers.png",
            model: "/models/sneakers.glb",
            scale: 0.7,
            position: [0, 0, 0],
            description: "Classic white sneakers that match everything",
        },
        {
            _id: 8,
            name: "Running Shoes",
            image: "/images/running_shoes.png",
            model: "/models/running_shoes.glb",
            scale: 1,
            position: [0, 0, 0],
            description: "Lightweight running shoes for training",
        },
        {
            _id: 9,
            name: "Boots",
            image: "/images/boots.png",
            model: "/models/boots.glb",
            scale: 1,
            position: [0, 0, 0],
            description: "Durable leather boots for outdoor wear",
        },
    ],
};
