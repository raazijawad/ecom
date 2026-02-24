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
    original_price?: number | null;
    discount_percentage?: number | null;
    discounted_price?: number | null;
    stock: number;
    sizes: string[] | null;
    colors: string[] | null;
    color_image_urls?: {
        color: string;
        product_image: string | null;
        image_gallery: string[];
    }[] | null;
    image_url: string | null;
    is_featured: boolean;
    category?: Category;
};

export type HeroBanner = {
    id: number;
    title: string;
    badge_text: string | null;
    headline: string | null;
    description: string | null;
    cta_text: string | null;
    image_path: string | null;
    product_id: number | null;
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
