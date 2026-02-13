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

const discountRates = [20, 15, 18, 25];
const fallbackCategories = ['Running', 'Bestsellers', 'Limited Edition', 'Performance'];

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

    // Scroll spy effect
    useEffect(() => {
        if (!categorizedProducts.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // Find the section closest to the top of the viewport
                const visibleEntry = entries
                    .filter(entry => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

                if (visibleEntry?.target.id) {
                    setActiveCategory(visibleEntry.target.id);
                }
            },
            {
                root: null,
                rootMargin: '-80px 0px 0px 0px', // Adjust for sticky navbar
                threshold: [0.25, 0.5, 0.75],
            }
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
                    <h1 className="text-3xl font-bold text-slate-900">Shoe Collection</h1>
                    <p className="mt-2 text-sm text-slate-600">Discover high-performance sneakers designed for every move.</p>
                </div>

                {/* Category Navbar */}
                <nav className="sticky top-4 z-10 mb-10 overflow-x-auto rounded-full border border-slate-200 bg-white/95 p-2 backdrop-blur">
                    <ul className="flex min-w-max items-center gap-2">
                        {categorizedProducts.map(({ id, category }) => (
                            <li key={id}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                    }
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                        activeCategory === id
                                            ? 'bg-blue-900 text-white shadow' // Dark blue active
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {category}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Product Sections */}
                <div className="space-y-10">
                    {categorizedProducts.map(({ id, category, products: categoryProducts }) => (
                        <section key={id} id={id} className="scroll-mt-24">
                            <h2 className="mb-5 text-2xl font-bold text-slate-900">{category}</h2>

                            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                                {categoryProducts.map((product, index) => {
                                    const discount = discountRates[index % discountRates.length];
                                    const currentPrice = Number(product.price);
                                    const originalPrice = currentPrice / (1 - discount / 100);

                                    return (
                                        <article
                                            key={product.id}
                                            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
                                        >
                                            <div className="absolute top-4 left-4 flex items-center gap-2">
                                                <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow">
                                                    Sale!
                                                </span>
                                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                                    {discount}% off
                                                </span>
                                            </div>

                                            <div className="mx-auto mt-8 flex h-48 w-48 items-center justify-center rounded-full bg-slate-100 p-4">
                                                <img src={product.image_url ?? ''} alt={product.name} className="h-full w-full object-contain" />
                                            </div>

                                            <h3 className="mt-5 text-lg font-bold text-slate-900">
                                                {product.name || 'Air Max Performance Sneaker'}
                                            </h3>
                                            <p className="mt-1 text-sm text-slate-400">{category}</p>

                                            <div className="mt-3 flex justify-center gap-1 text-yellow-400" aria-label="5 star rating">
                                                {Array.from({ length: 5 }).map((_, starIndex) => (
                                                    <span key={starIndex}>★</span>
                                                ))}
                                            </div>

                                            <div className="mt-4 flex items-center justify-center gap-2">
                                                <span className="text-sm text-slate-400 line-through">${originalPrice.toFixed(2)}</span>
                                                <span className="text-lg font-bold text-slate-900">${currentPrice.toFixed(2)}</span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => addToCart(product.id)}
                                                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                >
                                                    <circle cx="9" cy="20" r="1" />
                                                    <circle cx="18" cy="20" r="1" />
                                                    <path d="M2 3h3l2.2 10.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H7" />
                                                </svg>
                                                Add to cart
                                            </button>
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
