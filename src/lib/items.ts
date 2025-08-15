type itemType = {
    [key: string]: {
        id: number;
        name: string;
        image: string;
        model: string;
        description: string;
    }[];
};

export const items: itemType = {
    top: [
        {
            id: 1,
            name: "T-Shirt",
            image: "/images/tshirt.png",
            model: "/models/tshirt.glb",
            description: "A comfortable cotton t-shirt",
        },
        {
            id: 2,
            name: "Hoodie",
            image: "/images/hoodie.png",
            model: "/models/hoodie.glb",
            description: "A cozy fleece hoodie for cooler days",
        },
        {
            id: 3,
            name: "Jacket",
            image: "/images/jacket.png",
            model: "/models/jacket.glb",
            description: "A stylish leather jacket for layering",
        },
    ],
    mid: [
        {
            id: 4,
            name: "Jeans",
            image: "/images/jeans.png",
            model: "/models/jeans.glb",
            description: "Classic slim-fit denim jeans",
        },
        {
            id: 5,
            name: "Joggers",
            image: "/images/joggers.png",
            model: "/models/joggers.glb",
            description: "Casual cotton joggers for everyday wear",
        },
        {
            id: 6,
            name: "Shorts",
            image: "/images/shorts.png",
            model: "/models/shorts.glb",
            description: "Lightweight shorts for summer days",
        },
    ],
    bottom: [
        {
            id: 7,
            name: "Sneakers",
            image: "/images/sneakers.png",
            model: "/models/sneakers.glb",
            description: "Classic white sneakers that match everything",
        },
        {
            id: 8,
            name: "Running Shoes",
            image: "/images/running_shoes.png",
            model: "/models/running_shoes.glb",
            description: "Lightweight running shoes for training",
        },
        {
            id: 9,
            name: "Boots",
            image: "/images/boots.png",
            model: "/models/boots.glb",
            description: "Durable leather boots for outdoor wear",
        },
    ],
};
