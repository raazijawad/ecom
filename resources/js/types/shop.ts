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
    sizes: string[] | null;
    colors: string[] | null;
    color_image_urls?: Record<string, string> | null;
    angle_image_urls?: string[] | null;
    image_url: string | null;
    is_featured: boolean;
    category?: Category;
};

export type CartItem = {
    item_key: string;
    product_id: number;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    line_total: number;
    image_url: string | null;
    size: string | null;
    color: string | null;
};

export type HeroBanner = {
    id: number;
    eyebrow: string | null;
    title: string;
    description: string | null;
    image_url: string | null;
    cta_label: string | null;
    product_id: number | null;
    off_percentage: number | null;
    product_price?: number | null;
    discount_price?: number | null;
    cta_link: string | null;
    sort_order: number;
    is_active: boolean;
};

export type CartSummary = {
    items: CartItem[];
    count: number;
    subtotal: number;
    shipping_fee: number;
    total: number;
};

export type Testimonial = {
    id: number;
    comment: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
};
