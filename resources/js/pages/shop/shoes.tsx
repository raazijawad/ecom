import { router } from '@inertiajs/react';
import ShopLayout from '@/components/shop-layout';
import type { CartSummary, Product } from '@/types/shop';

type PaginatedProducts = {
    data: Product[];
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    products: PaginatedProducts;
    cartSummary: CartSummary;
};

type FeaturePoint = {
    title: string;
    description: string;
    icon: 'speed' | 'energy' | 'fit' | 'durable' | 'value' | 'design';
};

const leftFeatures: FeaturePoint[] = [
    {
        title: 'Extraordinary Performance',
        description: 'A sneaker designed for high-intensity training and speed.',
        icon: 'speed',
    },
    {
        title: 'Excellent Energy Return',
        description: 'Features a foam-cushioned midsole for superior impact protection.',
        icon: 'energy',
    },
    {
        title: 'Seamless Fit',
        description: 'Engineered mesh upper adapts to your foot for a personalized feel.',
        icon: 'fit',
    },
];

const rightFeatures: FeaturePoint[] = [
    {
        title: 'Durable Daily Trainer',
        description: 'Built to withstand daily wear and tear while maintaining its form.',
        icon: 'durable',
    },
    {
        title: 'Affordable Price',
        description: 'Premium athletic technology delivered at an accessible price point.',
        icon: 'value',
    },
    {
        title: 'Best Quality and Design',
        description: 'A sleek combination of breathable mesh and rugged gum-rubber soles.',
        icon: 'design',
    },
];

function FeatureIcon({ icon }: { icon: FeaturePoint['icon'] }) {
    const iconClassName = 'h-5 w-5 text-blue-500';

    if (icon === 'speed') {
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClassName}>
                <path d="M12 3v4" />
                <path d="m8 7 4-4 4 4" />
                <path d="M4 14h5" />
                <path d="M15 14h5" />
                <path d="M7 20h10" />
            </svg>
        );
    }

    if (icon === 'energy') {
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClassName}>
                <rect x="5" y="7" width="14" height="10" rx="2" />
                <path d="M19 10h2v4h-2" />
                <path d="m11 9-2 4h3l-1 4 4-5h-3l1-3" />
            </svg>
        );
    }

    if (icon === 'fit') {
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClassName}>
                <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" />
                <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
            </svg>
        );
    }

    if (icon === 'durable') {
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClassName}>
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M16 3v4" />
                <path d="M8 3v4" />
                <path d="M3 11h18" />
            </svg>
        );
    }

    if (icon === 'value') {
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClassName}>
                <path d="M20 7 9 18" />
                <circle cx="7" cy="7" r="3" />
                <circle cx="17" cy="17" r="3" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClassName}>
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8v5l3 2" />
        </svg>
    );
}

function FeatureCard({ feature, side }: { feature: FeaturePoint; side: 'left' | 'right' }) {
    return (
        <div className="relative rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div
                className={`pointer-events-none absolute top-1/2 hidden h-px w-16 -translate-y-1/2 bg-black lg:block xl:w-20 ${
                    side === 'left' ? 'right-[-4rem] xl:right-[-5rem]' : 'left-[-4rem] xl:left-[-5rem]'
                }`}
            >
                <span
                    className={`absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-black ${
                        side === 'left' ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'
                    }`}
                />
            </div>

            <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-50 p-2">
                    <FeatureIcon icon={feature.icon} />
                </div>
                <div>
                    <h3 className="text-sm font-bold tracking-wide text-black uppercase">{feature.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">{feature.description}</p>
                </div>
            </div>
        </div>
    );
}

export default function Shoes({ products, cartSummary }: Props) {
    const heroShoe = products.data[0];

    const addToCart = (productId: number) => {
        router.post('/cart', { product_id: productId, quantity: 1 }, { preserveScroll: true });
    };

    return (
        <ShopLayout title="All Shoes" cartSummary={cartSummary}>
            <section className="space-y-12">


                <div>
                    <h2 className="text-2xl font-bold text-black">Shop Performance Shoes</h2>
                    <p className="mt-1 text-sm text-slate-500">Premium picks inspired by the same technical design language.</p>

                    <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {products.data.map((product) => (
                            <article key={product.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="flex h-44 items-center justify-center rounded-xl bg-slate-50 p-3">
                                    <img src={product.image_url ?? ''} alt={product.name} className="h-full w-full object-contain" />
                                </div>
                                <h3 className="mt-4 text-base font-bold text-black">{product.name}</h3>
                                <p className="mt-1 text-sm text-slate-400">{product.category?.name ?? 'Training Shoe'}</p>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-lg font-bold text-black">${Number(product.price).toFixed(2)}</span>
                                    <button
                                        type="button"
                                        onClick={() => addToCart(product.id)}
                                        className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                                    >
                                        Add to cart
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </ShopLayout>
    );
}
