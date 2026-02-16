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

    const viewProductDetails = (productId: number) => {
        router.get(`/products/${productId}`);
    };

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

    const featureCallouts = {
        left: [
            {
                title: 'Extraordinary Performance',
                description: 'Designed with a lightweight aerodynamic frame for maximum speed.',
                icon: <path d="M10 4L5 12h5l-1 8 5-8H9l1-8z" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
            },
            {
                title: 'Premium Air Cushioning',
                description: 'The visible Air Max unit in the heel provides responsive, all-day comfort.',
                icon: <path d="M7 15c-2 0-4-1.6-4-3.7A4.1 4.1 0 017.7 7 4.8 4.8 0 0117 9.4c2.2 0 4 1.8 4 4s-1.8 3.6-4 3.6H7z" strokeWidth="1.6" />,
            },
            {
                title: 'Breathable Mesh Upper',
                description: 'Engineered mesh offers targeted support and enhanced airflow.',
                icon: <path d="M12 5a7 7 0 100 14 7 7 0 000-14zm-4 7h8M12 8v8" strokeWidth="1.6" />,
            },
        ],
        right: [
            {
                title: 'Superior Grip & Traction',
                description: 'Rugged gum-rubber outsole ensures stability on various surfaces.',
                icon: <path d="M12 3l8 4v5c0 4.4-2.8 7.8-8 9-5.2-1.2-8-4.6-8-9V7l8-4z" strokeWidth="1.6" />,
            },
            {
                title: 'Affordable Premium',
                description: 'Elite-level athletic technology delivered at an accessible price point.',
                icon: <path d="M4 8h9l7 7-5 5-7-7V4h4" strokeWidth="1.6" strokeLinejoin="round" />,
            },
            {
                title: 'Modern Aesthetic',
                description: 'A versatile silhouette that blends gym performance with street style.',
                icon: <path d="M12 4l2.4 4.8L20 10l-4 3.8.9 5.2-4.9-2.6L7.1 19l.9-5.2L4 10l5.6-1.2L12 4z" strokeWidth="1.6" strokeLinejoin="round" />,
            },
        ],
    };

    const submitFilters = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/', search.data, { preserveState: true, replace: true });
    };

    const addToCart = (productId: number) => {
        router.post('/cart', { product_id: productId, quantity: 1 }, { preserveScroll: true });
    };

    return (
        <ShopLayout title="Shoe Store" cartSummary={cartSummary}>
            <section className="relative mb-10 overflow-hidden rounded-3xl border border-slate-200/80 bg-[#f4f5f7] px-6 py-10 lg:px-10 lg:py-14">
                <div className="pointer-events-none absolute inset-0 opacity-60">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.1),transparent_38%),radial-gradient(circle_at_80%_75%,rgba(15,23,42,0.1),transparent_36%)]" />
                    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 700" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M-20 150C150 80 260 220 430 150C600 80 710 220 880 150C1020 95 1110 120 1220 170"
                            stroke="#cfd8e3"
                            strokeWidth="1.2"
                        />
                        <path
                            d="M-10 240C160 170 270 310 440 240C610 170 720 310 890 240C1030 185 1120 210 1230 260"
                            stroke="#d6dee8"
                            strokeWidth="1.2"
                        />
                        <path
                            d="M0 330C170 260 280 400 450 330C620 260 730 400 900 330C1040 275 1130 300 1240 350"
                            stroke="#dce3ec"
                            strokeWidth="1.2"
                        />
                    </svg>
                </div>

                <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
                    <div>
                        <p className="text-sm font-medium tracking-wide text-slate-500">Skip the Impossible.</p>
                        <h1 className="mt-3 max-w-xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                            Extraordinary Performance
                        </h1>
                        <p className="mt-4 max-w-lg text-slate-600">
                            Engineered for speed and comfort, AERO Step performance sneakers blend responsive cushioning with minimalist style.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <button className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-500">
                                Purchase Now
                            </button>
                            <button className="inline-flex items-center gap-2 rounded-full border border-slate-900 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white">
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-current text-[10px]">
                                    ▶
                                </span>
                                Watch Video
                            </button>
                        </div>
                    </div>

                    <div className="relative flex min-h-[280px] items-center justify-center lg:min-h-[360px]">
                        <img
                            src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80"
                            alt="AERO Step performance sneaker side profile"
                            className="absolute right-0 bottom-0 h-52 w-[88%] max-w-lg rotate-[-9deg] rounded-2xl object-cover shadow-2xl shadow-slate-500/25 lg:h-64"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1597248881519-db089d3744a5?auto=format&fit=crop&w=900&q=80"
                            alt="AERO Step performance sneaker heel and mesh texture"
                            className="absolute top-0 left-6 h-44 w-[70%] max-w-sm rotate-[8deg] rounded-2xl border border-slate-100 object-cover shadow-xl shadow-slate-500/20 saturate-50 lg:h-52"
                        />
                    </div>
                </div>

                <aside className="absolute top-1/2 right-3 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex">
                    <a href="#" className="rounded-full border border-slate-300 bg-white p-2 text-xs font-semibold text-slate-500">
                        in
                    </a>
                    <a href="#" className="rounded-full border border-slate-300 bg-white p-2 text-xs font-semibold text-slate-500">
                        ig
                    </a>
                    <a href="#" className="rounded-full border border-slate-300 bg-white p-2 text-xs font-semibold text-slate-500">
                        yt
                    </a>
                </aside>

                <p className="absolute right-4 bottom-4 text-[11px] font-semibold tracking-[0.3em] text-slate-500 uppercase">Scroll Down</p>
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

            <section className="relative mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-10 lg:px-10">
                <div className="pointer-events-none absolute inset-0 opacity-70">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(148,163,184,0.16),transparent_55%)]" />
                    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120c120-40 220 35 340 0s220-35 340 0 220 40 520-20" stroke="#dbe1e7" strokeWidth="1" />
                        <path d="M0 190c120-40 220 35 340 0s220-35 340 0 220 40 520-20" stroke="#e2e8f0" strokeWidth="1" />
                        <path d="M0 260c120-40 220 35 340 0s220-35 340 0 220 40 520-20" stroke="#dbe1e7" strokeWidth="1" />
                    </svg>
                </div>

                <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
                    <div className="space-y-6">
                        {featureCallouts.left.map((feature) => (
                            <article key={feature.title} className="group">
                                <div className="flex items-center gap-3">
                                    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 shrink-0 text-blue-600" stroke="currentColor">
                                        {feature.icon}
                                    </svg>
                                    <h3 className="text-lg font-bold text-slate-950">{feature.title}</h3>
                                    <span className="hidden h-px flex-1 bg-slate-300 lg:block" />
                                </div>
                                <p className="mt-2 pl-10 text-sm text-slate-500">{feature.description}</p>
                            </article>
                        ))}
                    </div>

                    <div className="relative mx-auto flex w-full max-w-md items-center justify-center py-8 lg:py-0">
                        <img
                            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"
                            alt="Nike Air Max side profile in grey mesh with black accents and gum outsole"
                            className="relative z-10 w-full max-w-md rounded-2xl object-cover shadow-xl shadow-slate-300/60"
                        />
                    </div>

                    <div className="space-y-6">
                        {featureCallouts.right.map((feature) => (
                            <article key={feature.title} className="group">
                                <div className="flex items-center gap-3">
                                    <span className="hidden h-px flex-1 bg-slate-300 lg:block" />
                                    <h3 className="text-right text-lg font-bold text-slate-950">{feature.title}</h3>
                                    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 shrink-0 text-blue-600" stroke="currentColor">
                                        {feature.icon}
                                    </svg>
                                </div>
                                <p className="mt-2 pr-10 text-right text-sm text-slate-500">{feature.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

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
                                <Link
                                    href={`/collections/${category.slug}`}
                                    className="mt-4 inline-block rounded bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
                                >
                                    Shop now
                                </Link>
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
                                    <button
                                        onClick={() => viewProductDetails(product.id)}
                                        className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
                                    >
                                        Buy Now
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
                                    <button
                                        onClick={() => viewProductDetails(product.id)}
                                        className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
                                    >
                                        Buy Now
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
                                    <button
                                        onClick={() => viewProductDetails(product.id)}
                                        className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
                                    >
                                        Buy Now
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
                <p className="mt-2 max-w-2xl text-sm text-slate-300">Get alerts on limited releases, runner picks, and member-only discounts.</p>
                <form className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full rounded border border-slate-500 bg-slate-800 px-4 py-2 text-white placeholder:text-slate-400"
                    />
                    <button className="rounded bg-blue-600 px-5 py-2 font-semibold text-white">Subscribe</button>
                </form>
            </section>

            <footer className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid gap-6 md:grid-cols-4">
                    <div>
                        <h3 className="font-semibold text-slate-900">Quick Links</h3>
                        <ul className="mt-2 space-y-1 text-sm text-slate-600">
                            <li>
                                <Link href="/shoes" className="hover:text-slate-900 hover:underline">
                                    All Shoes
                                </Link>
                            </li>
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
