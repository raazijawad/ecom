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
    const bestSellers = products.data.slice(0, 4);
    const newArrivals = products.data.slice(4, 8);
    const dealOfTheDay = products.data.slice(0, 3);

    const testimonials = [
        {
            name: 'Ava Thompson',
            role: 'Marathon Runner',
            quote: 'My training pair arrived fast and fits perfectly. SoleStyle is now my go-to shoe shop.',
        },
        {
            name: 'Marcus Lee',
            role: 'Sneaker Collector',
            quote: 'Clean product pages, accurate sizing info, and premium quality shoes every time.',
        },
        {
            name: 'Sofia Patel',
            role: 'Daily Commuter',
            quote: 'I needed all-day comfort for city walks, and SoleStyle delivered exactly that.',
        },
    ];

    const submitFilters = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/', search.data, { preserveState: true, replace: true });
    };

    const addToCart = (productId: number) => {
        router.post('/cart', { product_id: productId, quantity: 1 }, { preserveScroll: true });
    };

    return (
        <ShopLayout title="Shoe Store" cartSummary={cartSummary}>
            <section className="mb-8 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-900 px-6 py-10 text-white">
                <h1 className="text-3xl font-bold">SoleStyle Shoe Shop</h1>
                <p className="mt-2 max-w-2xl text-slate-200">Discover running, casual, basketball, and hiking shoes with fast delivery and easy checkout.</p>
            </section>

            <section className="relative mb-8 overflow-hidden rounded-2xl bg-slate-950 px-6 py-12 text-white">
                <p className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-black tracking-[0.35em] text-white/10 sm:text-7xl md:text-8xl">
                    SOLESTYLE
                </p>
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <img
                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"
                        alt="Red athletic sneaker"
                        className="h-52 w-full max-w-3xl rounded-2xl object-cover shadow-2xl shadow-slate-900/70"
                    />
                    <p className="text-sm text-slate-300">Step into comfort, performance, and street-ready style.</p>
                </div>
            </section>

            <form onSubmit={submitFilters} className="mb-8 grid gap-3 rounded-xl bg-white p-4 shadow sm:grid-cols-4">
                <input
                    value={search.data.q}
                    onChange={(e) => search.setData('q', e.target.value)}
                    placeholder="Search shoes..."
                    className="col-span-2 rounded border border-slate-300 px-3 py-2"
                />
                <select
                    value={search.data.category}
                    onChange={(e) => search.setData('category', e.target.value)}
                    className="rounded border border-slate-300 px-3 py-2"
                >
                    <option value="">All collections</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button className="rounded bg-slate-900 px-4 py-2 font-semibold text-white">Apply</button>
            </form>

            {categories.length > 0 && (
                <section className="mb-10">
                    <h2 className="mb-4 text-xl font-semibold">Shop by collection</h2>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {categories.slice(0, 8).map((category) => (
                            <article key={category.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">Collection</p>
                                <h3 className="mt-2 text-lg font-semibold text-slate-900">{category.name}</h3>
                                <p className="mt-2 text-sm text-slate-600">
                                    {category.description || `Explore best-selling ${category.name.toLowerCase()} built for every step.`}
                                </p>
                                <button
                                    onClick={() => search.setData('category', category.slug)}
                                    className="mt-4 rounded bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
                                >
                                    Shop now
                                </button>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {featuredProducts.length > 0 && (
                <section className="mb-10">
                    <h2 className="mb-4 text-xl font-semibold">Featured kicks</h2>
                    <div className="grid gap-4 md:grid-cols-4">
                        {featuredProducts.map((product) => (
                            <article key={product.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <img src={product.image_url ?? ''} alt={product.name} className="mb-3 h-36 w-full rounded object-cover" />
                                <h3 className="font-semibold">{product.name}</h3>
                                <p className="mt-1 text-sm text-slate-600">{product.category?.name}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="font-bold">${Number(product.price).toFixed(2)}</span>
                                    <button onClick={() => addToCart(product.id)} className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
                                        Add
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {bestSellers.length > 0 && (
                <section className="mb-10">
                    <h2 className="mb-4 text-xl font-semibold">Best-selling shoes</h2>
                    <div className="grid gap-4 md:grid-cols-4">
                        {bestSellers.map((product) => (
                            <article key={product.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <img src={product.image_url ?? ''} alt={product.name} className="mb-3 h-36 w-full rounded object-cover" />
                                <h3 className="font-semibold">{product.name}</h3>
                                <p className="mt-1 text-sm text-slate-600">{product.category?.name}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="font-bold">${Number(product.price).toFixed(2)}</span>
                                    <button onClick={() => addToCart(product.id)} className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
                                        Add
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {newArrivals.length > 0 && (
                <section className="mb-10">
                    <h2 className="mb-4 text-xl font-semibold">New arrivals</h2>
                    <div className="grid gap-4 md:grid-cols-4">
                        {newArrivals.map((product) => (
                            <article key={product.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <img src={product.image_url ?? ''} alt={product.name} className="mb-3 h-36 w-full rounded object-cover" />
                                <h3 className="font-semibold">{product.name}</h3>
                                <p className="mt-1 text-sm text-slate-600">{product.category?.name}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="font-bold">${Number(product.price).toFixed(2)}</span>
                                    <button onClick={() => addToCart(product.id)} className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
                                        Add
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {dealOfTheDay.length > 0 && (
                <section className="mb-10 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
                    <h2 className="text-xl font-semibold">Daily sneaker deals</h2>
                    <p className="mt-1 text-sm text-orange-100">Save 20% today on selected pairs. Limited stock available.</p>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                        {dealOfTheDay.map((product) => {
                            const basePrice = Number(product.price);
                            const discountedPrice = (basePrice * 0.8).toFixed(2);

                            return (
                                <article key={product.id} className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                                    <h3 className="font-semibold">{product.name}</h3>
                                    <p className="mt-2 text-sm line-through opacity-80">${basePrice.toFixed(2)}</p>
                                    <p className="text-lg font-bold">${discountedPrice}</p>
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}

            <section className="mb-10">
                <h2 className="mb-4 text-xl font-semibold">What customers say</h2>
                <div className="grid gap-4 md:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <article key={testimonial.name} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm leading-6 text-slate-700">“{testimonial.quote}”</p>
                            <p className="mt-4 font-semibold text-slate-900">{testimonial.name}</p>
                            <p className="text-xs text-slate-500">{testimonial.role}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="mb-10 rounded-2xl bg-slate-900 p-6 text-white">
                <h2 className="text-xl font-semibold">SoleStyle Newsletter</h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-300">
                    Get alerts on limited releases, runner picks, and member-only discounts.
                </p>
                <form className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full rounded border border-slate-500 bg-slate-800 px-4 py-2 text-white placeholder:text-slate-400"
                    />
                    <button className="rounded bg-blue-600 px-5 py-2 font-semibold text-white">Subscribe</button>
                </form>
            </section>

            <section>
                <h2 className="mb-4 text-xl font-semibold">All shoes</h2>
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
                                    <button onClick={() => addToCart(product.id)} className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
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

            <footer className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid gap-6 md:grid-cols-4">
                    <div>
                        <h3 className="font-semibold text-slate-900">Quick Links</h3>
                        <ul className="mt-2 space-y-1 text-sm text-slate-600">
                            <li>All Shoes</li>
                            <li>Featured Kicks</li>
                            <li>Best Sellers</li>
                            <li>New Arrivals</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Contact Info</h3>
                        <ul className="mt-2 space-y-1 text-sm text-slate-600">
                            <li>support@solestyle.com</li>
                            <li>+1 (800) 555-0199</li>
                            <li>Mon–Fri, 9AM–6PM</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Community</h3>
                        <ul className="mt-2 space-y-1 text-sm text-slate-600">
                            <li>Instagram</li>
                            <li>Run Club</li>
                            <li>Sneaker News</li>
                            <li>YouTube</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Policies & FAQ</h3>
                        <ul className="mt-2 space-y-1 text-sm text-slate-600">
                            <li>Shipping Policy</li>
                            <li>Returns & Exchanges</li>
                            <li>Size Guide</li>
                            <li>FAQ</li>
                        </ul>
                    </div>
                </div>
            </footer>
        </ShopLayout>
    );
}
