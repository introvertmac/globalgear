export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    sizes?: string[];
  }
  
  export const products: Product[] = [
    {
      id: 1,
      name: "GlobalGear T-Shirt",
      description: "Comfortable cotton t-shirt with the GlobalGear logo.",
      price: 25,
      image: "/images/products/tshirt.jpeg",
      sizes: ["S", "M", "L", "XL"]
    },
    {
      id: 2,
      name: "GlobalGear Cap",
      description: "Stylish cap featuring the GlobalGear emblem.",
      price: 20,
      image: "/images/products/cap.jpeg"
    },
    {
      id: 3,
      name: "GlobalGear Notebook",
      description: "High-quality notebook for all your ideas.",
      price: 15,
      image: "/images/products/notebook.jpeg"
    },
    {
      id: 4,
      name: "GlobalGear Mug",
      description: "Ceramic mug perfect for your morning coffee.",
      price: 12,
      image: "/images/products/mug.jpeg"
    },
    {
      id: 5,
      name: "GlobalGear Pen",
      description: "Smooth-writing pen with the GlobalGear logo.",
      price: 8,
      image: "/images/products/pen.jpeg"
    },
    {
      id: 6,
      name: "GlobalGear Water Bottle",
      description: "Eco-friendly water bottle with the GlobalGear logo.",
      price: 18,
      image: "/images/products/waterbottle.jpeg"
    }
    
  ];