import { useEffect, useMemo, useState } from 'react';
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

const fallbackCategories = ['Running', 'Bestsellers', 'Limited Edition', 'Performance'];

const featureSets = {
    left: [
        {
            title: 'Extraordinary Performance',
            description: 'Designed with an aerodynamic silhouette to optimize every stride.',
            icon: <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />,
        },
        {
            title: 'High-Energy Return',
            description: 'The foam-cushioned midsole provides superior impact protection.',
            icon: (
                <>
                    <rect x="7" y="8" width="10" height="8" rx="2" />
                    <path d="M17 11h2m-2 2h2" />
                </>
            ),
        },
        {
            title: 'Seamless Fit',
            description: 'Engineered mesh upper adapts to your foot for a personalized feel.',
            icon: (
                <>
                    <path d="M8 12a4 4 0 0 1 4-4h4" />
                    <path d="M16 12a4 4 0 0 1-4 4H8" />
                    <path d="m10 10-2 2 2 2m4-4 2 2-2 2" />
                </>
            ),
        },
    ],
    right: [
        {
            title: 'Durable Daily Trainer',
            description: 'Built to withstand high-intensity workouts and daily wear.',
            icon: (
                <>
                    <rect x="4" y="6" width="16" height="14" rx="2" />
                    <path d="M8 3v4m8-4v4M4 10h16" />
                </>
            ),
        },
        {
            title: 'Affordable Excellence',
            description: 'Premium athletic technology delivered at a competitive price.',
            icon: (
                <>
                    <path d="M6 4h8l4 4v12H6z" />
                    <path d="M14 4v4h4" />
                    <path d="M9 13h6m-6 3h4" />
                </>
            ),
        },
        {
            title: 'Best Quality and Design',
            description: 'A sleek combination of breathable mesh and rugged gum-rubber soles.',
            icon: (
                <>
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 8v4l3 2" />
                </>
            ),
        },
    ],
};

export default function Shoes({ products, cartSummary }: Props) {
    const categorizedProducts = useMemo(() => {
        const groupedProducts = new Map<string, Product[]>();

        products.data.forEach((product, index) => {
            const category = product.category?.name ?? fallbackCategories[index % fallbackCategories.length];
            const existingCategoryProducts = groupedProducts.get(category) ?? [];
            groupedProducts.set(category, [...existingCategoryProducts, product]);
        });

        return Array.from(groupedProducts.entries()).map(([category, categoryProducts]) => ({
            category,
            id: `category-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            products: categoryProducts,
        }));
    }, [products.data]);

    const [activeCategory, setActiveCategory] = useState(categorizedProducts[0]?.id ?? '');

    useEffect(() => {
        if (!categorizedProducts.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntry = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

                if (visibleEntry?.target.id) {
                    setActiveCategory(visibleEntry.target.id);
                }
            },
            {
                root: null,
                rootMargin: '-80px 0px 0px 0px',
                threshold: [0.25, 0.5, 0.75],
            },
        );

        categorizedProducts.forEach(({ id }) => {
            const section = document.getElementById(id);
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, [categorizedProducts]);

    const addToCart = (productId: number) => {
        router.post('/cart', { product_id: productId, quantity: 1 }, { preserveScroll: true });
    };

    return (
        <ShopLayout title="All Shoes" cartSummary={cartSummary}>
            <section>
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-black">Shoe Collection</h1>
                    <p className="mt-2 text-sm text-slate-500">Discover high-performance sneakers designed for every move.</p>
                </div>

                <nav className="sticky top-4 z-10 mb-10 overflow-x-auto rounded-full border border-slate-200 bg-white/95 p-2 backdrop-blur">
                    <ul className="flex min-w-max items-center gap-2">
                        {categorizedProducts.map(({ id, category }) => (
                            <li key={id}>
                                <button
                                    type="button"
                                    onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                        activeCategory === id ? 'bg-black text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {category}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="space-y-10">
                    {categorizedProducts.map(({ id, category, products: categoryProducts }) => (
                        <section key={id} id={id} className="scroll-mt-24">
                            <h2 className="mb-5 text-2xl font-bold text-black">{category}</h2>

                            <div className="grid gap-6 xl:grid-cols-2">
                                {categoryProducts.map((product) => {
                                    const currentPrice = Number(product.price);

                                    return (
                                        <article
                                            key={product.id}
                                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.07)]"
                                        >
                                            <div
                                                className="grid gap-6 rounded-2xl bg-white p-4 lg:grid-cols-[1fr_1.1fr_1fr]"
                                                style={{
                                                    backgroundImage: 'radial-gradient(circle at center, rgba(226,232,240,0.5) 1px, transparent 1px)',
                                                    backgroundSize: '24px 24px',
                                                }}
                                            >
                                                <div className="space-y-6">
                                                    {featureSets.left.map((feature) => (
                                                        <div key={feature.title} className="flex items-start gap-3 text-right lg:justify-end">
                                                            <div className="flex-1">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <h3 className="text-sm font-bold text-black">{feature.title}</h3>
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="rgb(37, 99, 235)"
                                                                        strokeWidth="1.8"
                                                                        className="h-4 w-4 shrink-0"
                                                                        aria-hidden="true"
                                                                    >
                                                                        {feature.icon}
                                                                    </svg>
                                                                </div>
                                                                <p className="mt-1 text-xs text-slate-400">{feature.description}</p>
                                                            </div>
                                                            <div className="mt-1 h-px w-8 bg-black" />
                                                            <span className="mt-[-2px] h-2.5 w-2.5 rounded-full bg-black" />
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex flex-col items-center justify-center rounded-2xl bg-white/90 p-4 text-center">
                                                    <img
                                                        src={product.image_url ?? ''}
                                                        alt={product.name}
                                                        className="h-44 w-full object-contain drop-shadow-[0_20px_20px_rgba(15,23,42,0.2)]"
                                                    />
                                                    <h3 className="mt-4 text-lg font-bold text-black">
                                                        {product.name || 'Nike Air Max Alpha Trainer'}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-slate-400">Grey mesh · Black swoosh · Air Max heel</p>
                                                    <div className="mt-4 flex items-center gap-3">
                                                        <span className="text-lg font-bold text-black">${currentPrice.toFixed(2)}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => addToCart(product.id)}
                                                            className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                                                        >
                                                            Add to cart
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    {featureSets.right.map((feature) => (
                                                        <div key={feature.title} className="flex items-start gap-3">
                                                            <span className="mt-[-2px] h-2.5 w-2.5 rounded-full bg-black" />
                                                            <div className="mt-1 h-px w-8 bg-black" />
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="rgb(37, 99, 235)"
                                                                        strokeWidth="1.8"
                                                                        className="h-4 w-4 shrink-0"
                                                                        aria-hidden="true"
                                                                    >
                                                                        {feature.icon}
                                                                    </svg>
                                                                    <h3 className="text-sm font-bold text-black">{feature.title}</h3>
                                                                </div>
                                                                <p className="mt-1 text-xs text-slate-400">{feature.description}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>
            </section>
        </ShopLayout>
    );
}
