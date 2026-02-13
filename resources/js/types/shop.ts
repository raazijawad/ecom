export type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
};

export type Product = {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string;
    price: string;
    stock: number;
    image_url: string | null;
    is_featured: boolean;
    category?: Category;
};


export type Banner = {
    id: number;
    title: string;
    subtitle: string | null;
    image_url: string | null;
    button_text: string | null;
    button_url: string | null;
    sort_order: number;
    is_active: boolean;
};

export type CartItem = {
    product_id: number;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    line_total: number;
    image_url: string | null;
};

export type CartSummary = {
    items: CartItem[];
    count: number;
    subtotal: number;
    shipping_fee: number;
    total: number;
};
