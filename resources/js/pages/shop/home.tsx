import { router, useForm, usePage } from '@inertiajs/react';
import { useMemo, useRef } from 'react';
import AppLink from '@/components/app-link';
import ShopLayout from '@/components/shop-layout';
import type { Auth } from '@/types/auth';
import type { CartSummary, Category, HeroBanner, Product, Testimonial } from '@/types/shop';

type PaginatedProducts = {
    data: Product[];
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    filters: { q: string; category: string };
    featuredProducts: Product[];
    products: PaginatedProducts;
    bestSellingShoes: Product[];
    categories: Category[];
    testimonials: Testimonial[];
    heroBanners: HeroBanner[];
    cartSummary: CartSummary;
};

type SharedProps = {
    auth: Auth;
    flash?: {
        success?: string;
    };
};

export default function Home({ filters, featuredProducts, products, bestSellingShoes, categories, testimonials, heroBanners, cartSummary }: Props) {
    const { auth, flash } = usePage<SharedProps>().props;
    const search = useForm({ q: filters.q, category: filters.category });
    const testimonialForm = useForm({ comment: '' });
    const newsletterForm = useForm({
        name: auth.user?.name ?? '',
        email: auth.user?.email ?? '',
    });
    const searchDebounce = useRef<number | null>(null);
    const bestSellers = bestSellingShoes.slice(0, 4);
    const newArrivals = products.data.slice(4, 8);
    const dealOfTheDay = products.data.slice(0, 3);

    const activeHeroBanner = heroBanners[0] ?? null;
    const heroProduct = activeHeroBanner?.product_id ? [...featuredProducts, ...products.data].find((product) => product.id === activeHeroBanner.product_id) : null;
    const heroImage = resolveImageUrl(activeHeroBanner?.image_path) ?? resolveCardImage(heroProduct ?? featuredProducts[0] ?? products.data[0]);

    const viewProductDetails = (productId: number) => {
        router.get(`/products/${productId}`);
    };

    const submitFilters = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/', search.data, { preserveState: true, replace: true });
    };

    const applyFilters = (nextFilters: { q: string; category: string }) => {
        router.get('/', nextFilters, { preserveState: true, replace: true });
    };

    const queueSearch = (nextFilters: { q: string; category: string }) => {
        if (searchDebounce.current !== null) {
            window.clearTimeout(searchDebounce.current);
        }

        searchDebounce.current = window.setTimeout(() => {
            applyFilters(nextFilters);
        }, 250);
    };

    const resolveImageUrl = (path: string | null | undefined): string | null => {
        if (!path) {
            return null;
        }

        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
            return path;
        }

        return `/storage/${path}`;
    };

    const resolveCardImage = (product: Product): string => {
        const colorImage = product.color_image_urls?.find((entry) => Boolean(entry?.product_image))?.product_image;

        return resolveImageUrl(colorImage) ?? resolveImageUrl(product.image_url) ?? '';
    };

    const suggestions = useMemo(() => {
        const allNames = [...featuredProducts, ...products.data].map((product) => product.name.trim()).filter(Boolean);
        const uniqueNames = [...new Set(allNames)];

        if (!search.data.q.trim()) {
            return uniqueNames.slice(0, 8);
        }

        const query = search.data.q.toLowerCase();

        return uniqueNames.filter((name) => name.toLowerCase().includes(query)).slice(0, 8);
    }, [featuredProducts, products.data, search.data.q]);

    const searchedProducts = useMemo(() => {
        const query = search.data.q.trim().toLowerCase();

        if (!query) {
            return [];
        }

        const uniqueProducts = [...new Map([...featuredProducts, ...products.data].map((product) => [product.id, product])).values()];

        return uniqueProducts.filter((product) => product.name.toLowerCase().includes(query)).slice(0, 8);
    }, [featuredProducts, products.data, search.data.q]);

    const submitTestimonial = (e: React.FormEvent) => {
        e.preventDefault();

        testimonialForm.post('/testimonials', {
            preserveScroll: true,
            onSuccess: () => testimonialForm.reset('comment'),
        });
    };

    return (
        <ShopLayout title="Shoe Store" cartSummary={cartSummary}>


            

            <section className="relative mb-8 overflow-hidden rounded-3xl bg-[#16261f] px-6 py-10 text-white shadow-2xl sm:px-10 lg:px-14">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(145,175,137,0.35),transparent_45%),radial-gradient(circle_at_75%_25%,rgba(95,120,88,0.35),transparent_40%),linear-gradient(145deg,#101c17_15%,#1f3229_85%)]" />
                <div className="pointer-events-none absolute -left-10 top-8 h-48 w-48 rounded-full bg-emerald-200/10 blur-3xl" />
                <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-lime-100/10 blur-3xl" />
                <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-5">
                        <p className="inline-flex w-fit rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold tracking-[0.22em] uppercase text-emerald-100">
                            {activeHeroBanner?.badge_text || 'Editorial spotlight'}
                        </p>
                        <h1 className="max-w-xl text-3xl leading-tight font-semibold text-balance sm:text-4xl lg:text-5xl">
                            {activeHeroBanner?.headline || 'Earth-crafted performance for every stride'}
                        </h1>
                        <p className="max-w-lg text-sm leading-relaxed text-emerald-50/90 sm:text-base">
                            {activeHeroBanner?.description ||
                                'A high-end cinematic drop inspired by olive suede, cream leather, and breathable white mesh. Built to feel premium from pavement to trail.'}
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <AppLink
                                href={heroProduct ? `/products/${heroProduct.id}` : '/shoes'}
                                className="rounded-full bg-[#e8e0cf] px-5 py-2.5 text-sm font-semibold tracking-wide text-[#223227] transition hover:bg-[#f1ebde]"
                            >
                                {activeHeroBanner?.cta_text || 'Shop the look'}
                            </AppLink>
                            <AppLink
                                href="/shoes"
                                className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                Explore collections
                            </AppLink>
                        </div>
                    </div>
                    <div className="relative mx-auto w-full max-w-md">
                        <div className="rounded-[2rem] border border-white/20 bg-[#2b392f] p-4 shadow-[0_35px_70px_-35px_rgba(0,0,0,0.85)]">
                            <div className="aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[#4b4231]">
                                {heroImage ? (
                                    <img src={heroImage} alt={activeHeroBanner?.title || heroProduct?.name || 'Featured sneaker'} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#6f644f] to-[#3f3527] text-sm font-medium text-[#efe7d9]">
                                        Sneaker editorial preview
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <form onSubmit={submitFilters} className="mb-8 grid gap-3 rounded-xl bg-white p-4 shadow sm:grid-cols-4">
                <input
                    value={search.data.q}
                    onChange={(e) => {
                        const q = e.target.value;
                        const nextFilters = { ...search.data, q };

                        search.setData('q', q);
                        queueSearch(nextFilters);
                    }}
                    placeholder="Search shoes..."
                    list="shoe-suggestions"
                    className="w-full rounded border border-slate-300 px-3 py-2 sm:col-span-2"
                />
                <datalist id="shoe-suggestions">
                    {suggestions.map((name) => (
                        <option key={name} value={name} />
                    ))}
                </datalist>
                <select
                    value={search.data.category}
                    onChange={(e) => {
                        const category = e.target.value;
                        const nextFilters = { ...search.data, category };

                        search.setData('category', category);
                        applyFilters(nextFilters);
                    }}
                    className="rounded border border-slate-300 px-3 py-2"
                >
                    <option value="">All collections</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button className="w-full rounded bg-slate-900 px-4 py-2 font-semibold text-white sm:w-auto">Apply</button>
            </form>

            {searchedProducts.length > 0 && (
                <section className="mb-8">
                    <h2 className="mb-4 text-xl font-semibold">Search results</h2>
                    <div className="grid gap-4 md:grid-cols-4">
                        {searchedProducts.map((product) => (
                            <article key={product.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <img src={resolveCardImage(product)} alt={product.name} className="mb-3 h-36 w-full rounded object-cover" />
                                <h3 className="font-semibold">{product.name}</h3>
                                <p className="mt-1 text-sm text-slate-600">{product.category?.name}</p>
                                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">${Number(product.discounted_price ?? product.price).toFixed(2)}</span>
                                        {product.discounted_price && <span className="text-sm text-slate-400 line-through">${Number(product.price).toFixed(2)}</span>}
                                    </div>
                                    <button
                                        onClick={() => viewProductDetails(product.id)}
                                        className="w-full rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white sm:w-auto"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}

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
                                <AppLink
                                    href={`/collections/${category.slug}`}
                                    className="mt-4 inline-block rounded bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
                                >
                                    Shop now
                                </AppLink>
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
                                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">${Number(product.discounted_price ?? product.price).toFixed(2)}</span>
                                        {product.discounted_price && <span className="text-sm text-slate-400 line-through">${Number(product.price).toFixed(2)}</span>}
                                    </div>
                                    <button
                                        onClick={() => viewProductDetails(product.id)}
                                        className="w-full rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white sm:w-auto"
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
                                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">${Number(product.discounted_price ?? product.price).toFixed(2)}</span>
                                        {product.discounted_price && <span className="text-sm text-slate-400 line-through">${Number(product.price).toFixed(2)}</span>}
                                    </div>
                                    <button
                                        onClick={() => viewProductDetails(product.id)}
                                        className="w-full rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white sm:w-auto"
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
                                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">${Number(product.discounted_price ?? product.price).toFixed(2)}</span>
                                        {product.discounted_price && <span className="text-sm text-slate-400 line-through">${Number(product.price).toFixed(2)}</span>}
                                    </div>
                                    <button
                                        onClick={() => viewProductDetails(product.id)}
                                        className="w-full rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white sm:w-auto"
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
                            const discountedPrice = Number(product.discounted_price ?? product.price);

                            return (
                                <article key={product.id} className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                                    <h3 className="font-semibold">{product.name}</h3>
                                    {product.discounted_price && <p className="mt-2 text-sm line-through opacity-80">${basePrice.toFixed(2)}</p>}
                                    <p className="text-lg font-bold">${discountedPrice.toFixed(2)}</p>
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}

            <section className="mb-10">
                <h2 className="mb-4 text-xl font-semibold">What customers say</h2>
                {auth.user ? (
                    <form onSubmit={submitTestimonial} className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <label htmlFor="testimonial-comment" className="mb-2 block text-sm font-medium text-slate-800">
                            Leave a testimonial as {auth.user.name}
                        </label>
                        <textarea
                            id="testimonial-comment"
                            value={testimonialForm.data.comment}
                            onChange={(event) => testimonialForm.setData('comment', event.target.value)}
                            rows={3}
                            maxLength={1000}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900"
                            placeholder="Share your experience with our store..."
                        />
                        {testimonialForm.errors.comment ? <p className="mt-2 text-xs text-red-600">{testimonialForm.errors.comment}</p> : null}
                        <button
                            type="submit"
                            disabled={testimonialForm.processing}
                            className="mt-3 rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                        >
                            {testimonialForm.processing ? 'Submitting...' : 'Post testimonial'}
                        </button>
                    </form>
                ) : (
                    <p className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                        Please{' '}
                        <AppLink href="/sign-in" className="font-semibold text-blue-600 hover:underline">
                            sign in
                        </AppLink>{' '}
                        to comment testimonials.
                    </p>
                )}
                <div className="grid gap-4 md:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <article key={testimonial.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm leading-6 text-slate-700">“{testimonial.comment}”</p>
                            <p className="mt-4 font-semibold text-slate-900">{testimonial.user.name}</p>
                            <p className="text-xs text-slate-500">{testimonial.user.email}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="mb-10 rounded-2xl bg-slate-900 p-6 text-white">
                <h2 className="text-xl font-semibold">SoleStyle Newsletter</h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-300">Get alerts on limited releases, runner picks, and member-only discounts.</p>
                {flash?.success ? <p className="mt-3 rounded border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{flash.success}</p> : null}
                <form
                    className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
                    onSubmit={(event) => {
                        event.preventDefault();
                        newsletterForm.post('/newsletter/subscribe', { preserveScroll: true });
                    }}
                >
                    <input
                        type="text"
                        placeholder="Your name (optional)"
                        value={newsletterForm.data.name}
                        onChange={(event) => newsletterForm.setData('name', event.target.value)}
                        className="w-full rounded border border-slate-500 bg-slate-800 px-4 py-2 text-white placeholder:text-slate-400"
                    />
                    <div>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={newsletterForm.data.email}
                            onChange={(event) => newsletterForm.setData('email', event.target.value)}
                            className="w-full rounded border border-slate-500 bg-slate-800 px-4 py-2 text-white placeholder:text-slate-400"
                        />
                        {newsletterForm.errors.email ? <p className="mt-1 text-xs text-red-300">{newsletterForm.errors.email}</p> : null}
                    </div>
                    <button
                        type="submit"
                        disabled={newsletterForm.processing}
                        className="rounded bg-blue-600 px-5 py-2 font-semibold text-white disabled:opacity-60"
                    >
                        {newsletterForm.processing ? 'Subscribing...' : 'Subscribe'}
                    </button>
                </form>
            </section>

            <footer className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid gap-6 md:grid-cols-4">
                    <div>
                        <h3 className="font-semibold text-slate-900">Quick Links</h3>
                        <ul className="mt-2 space-y-1 text-sm text-slate-600">
                            <li>
                                <AppLink href="/shoes" className="hover:text-slate-900 hover:underline">
                                    All Shoes
                                </AppLink>
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
