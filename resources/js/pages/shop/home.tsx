import { Link, router, useForm } from '@inertiajs/react';
import ShopLayout from '@/components/shop-layout';
import { CartSummary, Category, Product } from '@/types/shop';

type PaginatedProducts = {
    data: Product[];
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    filters: { q: string; category: string };
    featuredProducts: Product[];
    products: PaginatedProducts;
    categories: Category[];
    cartSummary: CartSummary;
};

export default function Home({ filters, featuredProducts, products, categories, cartSummary }: Props) {
    const search = useForm({ q: filters.q, category: filters.category });

    const submitFilters = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/', search.data, { preserveState: true, replace: true });
    };

    const addToCart = (productId: number) => {
        router.post('/cart', { product_id: productId, quantity: 1 }, { preserveScroll: true });
    };

    return (
        <ShopLayout title="Shop" cartSummary={cartSummary}>
            <section className="mb-8 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-900 px-6 py-10 text-white">
                <h1 className="text-3xl font-bold">Complete E-Commerce Storefront</h1>
                <p className="mt-2 max-w-2xl text-slate-200">Browse products, add items to cart, and place orders with a seamless checkout flow.</p>
            </section>

            <section className="relative mb-8 overflow-hidden rounded-2xl bg-slate-950 px-6 py-12 text-white">
                <p className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-black tracking-[0.35em] text-white/10 sm:text-7xl md:text-8xl">
                    NOVACART
                </p>
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <img
                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"
                        alt="Red athletic shoe"
                        className="h-52 w-full max-w-3xl rounded-2xl object-cover shadow-2xl shadow-slate-900/70"
                    />
                    <p className="text-sm text-slate-300">Step into style with NovaCart</p>
                </div>
            </section>

            <form onSubmit={submitFilters} className="mb-8 grid gap-3 rounded-xl bg-white p-4 shadow sm:grid-cols-4">
                <input
                    value={search.data.q}
                    onChange={(e) => search.setData('q', e.target.value)}
                    placeholder="Search products..."
                    className="col-span-2 rounded border border-slate-300 px-3 py-2"
                />
                <select
                    value={search.data.category}
                    onChange={(e) => search.setData('category', e.target.value)}
                    className="rounded border border-slate-300 px-3 py-2"
                >
                    <option value="">All categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button className="rounded bg-slate-900 px-4 py-2 font-semibold text-white">Apply</button>
            </form>

            {featuredProducts.length > 0 && (
                <section className="mb-10">
                    <h2 className="mb-4 text-xl font-semibold">Featured products</h2>
                    <div className="grid gap-4 md:grid-cols-4">
                        {featuredProducts.map((product) => (
                            <article key={product.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <img src={product.image_url ?? ''} alt={product.name} className="mb-3 h-32 w-full rounded object-cover" />
                                <h3 className="font-semibold">{product.name}</h3>
                                <p className="mt-1 text-sm text-slate-600">${Number(product.price).toFixed(2)}</p>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            <section>
                <h2 className="mb-4 text-xl font-semibold">All products</h2>
                <div className="grid gap-4 md:grid-cols-3">
                    {products.data.map((product) => (
                        <article key={product.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <img src={product.image_url ?? ''} alt={product.name} className="mb-3 h-40 w-full rounded object-cover" />
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="mt-1 text-sm text-slate-600">{product.category?.name}</p>
                            <p className="mt-2 text-sm text-slate-700">{product.description}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="font-bold">${Number(product.price).toFixed(2)}</span>
                                <div className="flex gap-2">
                                    <Link href={`/products/${product.id}`} className="rounded border border-slate-300 px-3 py-2 text-sm">
                                        View
                                    </Link>
                                    <button
                                        onClick={() => addToCart(product.id)}
                                        className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                    {products.links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.url ?? '#'}
                            className={`rounded px-3 py-2 text-sm ${link.active ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </section>
        </ShopLayout>
    );
}
