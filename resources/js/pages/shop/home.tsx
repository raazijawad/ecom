import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
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
    cartSummary: CartSummary;
    heroBanners: HeroBanner[];
};

type SharedProps = {
    auth: Auth;
    flash?: {
        success?: string;
    };
};

export default function Home({ filters, featuredProducts, products, bestSellingShoes, categories, testimonials, cartSummary, heroBanners }: Props) {
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

    const viewProductDetails = (productId: number) => {
        router.get(`/products/${productId}`);
    };

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

    const fallbackHeroBanner: HeroBanner = {
        id: 0,
        eyebrow: 'Our Exclusive',
        title: 'Adidas Campus',
        description: 'Step into the future of comfort with our latest high-performance athletic collection.',
        accent_text: 'RUN',
        image_url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80',
        cta_label: 'VIEW COLLECTIONS',
        product_id: null,
        home_banner_product_id: null,
        cta_link: '/shoes',
        off_percentage: null,
        badge_price: 34,
        product_price: null,
        discount_price: null,
        sort_order: 0,
        is_active: true,
    };

    const sliderBanners = heroBanners.length > 0 ? heroBanners : [fallbackHeroBanner];
    const [activeHeroBanner, setActiveHeroBanner] = useState(0);
    const [isDraggingBanner, setIsDraggingBanner] = useState(false);
    const bannerDragStartX = useRef<number | null>(null);

    useEffect(() => {
        search.setData('q', filters.q);
        search.setData('category', filters.category);
    }, [filters.q, filters.category]);

    useEffect(() => {
        setActiveHeroBanner(0);
    }, [sliderBanners.length]);

    useEffect(() => {
        if (sliderBanners.length < 2) {
            return;
        }

        const interval = window.setInterval(() => {
            setActiveHeroBanner((current) => (current + 1) % sliderBanners.length);
        }, 3000);

        return () => {
            window.clearInterval(interval);
        };
    }, [sliderBanners.length]);

    useEffect(() => {
        return () => {
            if (searchDebounce.current !== null) {
                window.clearTimeout(searchDebounce.current);
            }
        };
    }, []);

    const handleBannerPointerDown = (event: React.PointerEvent<HTMLElement>) => {
        if (sliderBanners.length < 2) {
            return;
        }

        bannerDragStartX.current = event.clientX;
        setIsDraggingBanner(true);
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handleBannerPointerUp = (event: React.PointerEvent<HTMLElement>) => {
        if (bannerDragStartX.current === null) {
            setIsDraggingBanner(false);
            return;
        }

        const dragDistance = event.clientX - bannerDragStartX.current;
        const dragThreshold = 40;

        if (Math.abs(dragDistance) >= dragThreshold) {
            setActiveHeroBanner((current) => {
                if (dragDistance < 0) {
                    return (current + 1) % sliderBanners.length;
                }

                return (current - 1 + sliderBanners.length) % sliderBanners.length;
            });
        }

        bannerDragStartX.current = null;
        setIsDraggingBanner(false);
        event.currentTarget.releasePointerCapture(event.pointerId);
    };

    const handleBannerPointerCancel = () => {
        bannerDragStartX.current = null;
        setIsDraggingBanner(false);
    };

    const submitTestimonial = (e: React.FormEvent) => {
        e.preventDefault();

        testimonialForm.post('/testimonials', {
            preserveScroll: true,
            onSuccess: () => testimonialForm.reset('comment'),
        });
    };

    return (
        <ShopLayout title="Shoe Store" cartSummary={cartSummary}>
            <section
                className={`relative mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-[#f7f7f5] px-6 py-10 lg:px-10 lg:py-14 ${isDraggingBanner ? 'cursor-grabbing' : 'cursor-grab'}`}
                onPointerDown={handleBannerPointerDown}
                onPointerUp={handleBannerPointerUp}
                onPointerCancel={handleBannerPointerCancel}
            >
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-16 left-12 h-52 w-52 rounded-full bg-red-200/40 blur-3xl" />
                    <div className="absolute right-20 bottom-8 h-44 w-44 rounded-full bg-red-300/30 blur-3xl" />
                    <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 1200 700" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M80 120C210 40 350 180 500 120C640 70 720 180 860 130C980 90 1080 130 1140 180" stroke="#e5e7eb" strokeWidth="1.4" />
                        <path d="M40 240C170 160 330 300 490 240C650 180 740 300 900 240C1030 190 1120 220 1180 280" stroke="#d1d5db" strokeWidth="1.4" />
                        <path d="M20 360C150 280 320 420 470 360C630 300 740 420 900 360C1030 310 1120 340 1180 400" stroke="#e5e7eb" strokeWidth="1.4" />
                    </svg>
                </div>

                <button
                    type="button"
                    onClick={() => setActiveHeroBanner((current) => (current - 1 + sliderBanners.length) % sliderBanners.length)}
                    className="absolute top-1/2 left-2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white/90 text-lg text-slate-700 shadow md:flex"
                    aria-label="Previous slide"
                >
                    ‹
                </button>
                <button
                    type="button"
                    onClick={() => setActiveHeroBanner((current) => (current + 1) % sliderBanners.length)}
                    className="absolute top-1/2 right-2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-300 bg-white/90 text-lg text-slate-700 shadow md:flex"
                    aria-label="Next slide"
                >
                    ›
                </button>

                <div className="relative z-10 overflow-hidden">
                    <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${activeHeroBanner * 100}%)` }}>
                        {sliderBanners.map((banner) => (
                            <article key={banner.id} className="w-full shrink-0">
                                <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.25fr]">
                                    <div>
                                        <p className="text-sm font-semibold tracking-[0.2em] text-red-500 uppercase">{banner.eyebrow ?? 'Our Exclusive'}</p>
                                        <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-950 lg:text-7xl">{banner.title}</h1>
                                        <p className="mt-4 max-w-md text-slate-600">
                                            {banner.description ?? 'Step into the future of comfort with our latest high-performance athletic collection.'}
                                        </p>

                                        {(() => {
                                            const bannerHref = banner.product_id ? `/products/${banner.product_id}` : banner.cta_link;

                                            return bannerHref ? (
                                                <AppLink href={bannerHref} className="mt-7 inline-flex bg-black px-7 py-3 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-slate-800">
                                                    {banner.cta_label ?? 'VIEW COLLECTIONS'}
                                                </AppLink>
                                            ) : (
                                                <button className="mt-7 inline-flex bg-black px-7 py-3 text-sm font-semibold tracking-wide text-white uppercase">
                                                    {banner.cta_label ?? 'VIEW COLLECTIONS'}
                                                </button>
                                            );
                                        })()}
                                    </div>

                                    <div className="relative flex min-h-[300px] items-center justify-center lg:min-h-[390px]">
                                        <p className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[110px] leading-none font-black tracking-[0.08em] text-red-600/85 md:text-[150px]">
                                            {banner.accent_text ?? 'RUN'}
                                        </p>
                                        <img
                                            src={banner.image_url ?? ''}
                                            alt={banner.title}
                                            className="relative z-10 h-[250px] w-full object-contain drop-shadow-[0_24px_20px_rgba(0,0,0,0.25)] lg:h-[340px]"
                                        />
                                        <div className="absolute right-10 top-10 z-20 flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-center text-2xl font-black text-white shadow-lg">
                                            ${Number(banner.badge_price ?? 34).toFixed(0)}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                {sliderBanners.length > 1 && (
                    <div className="relative z-20 mt-8 flex items-center justify-center gap-2">
                        {sliderBanners.map((sliderBanner, index) => (
                            <button
                                key={sliderBanner.id}
                                type="button"
                                onClick={() => setActiveHeroBanner(index)}
                                className={`h-3 w-3 rounded-full transition ${activeHeroBanner === index ? 'border border-black bg-white' : 'bg-slate-400/70 hover:bg-slate-600'}`}
                                aria-label={`Show banner ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
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
                    className="col-span-2 rounded border border-slate-300 px-3 py-2"
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
                <button className="rounded bg-slate-900 px-4 py-2 font-semibold text-white">Apply</button>
            </form>

            {searchedProducts.length > 0 && (
                <section className="mb-8">
                    <h2 className="mb-4 text-xl font-semibold">Search results</h2>
                    <div className="grid gap-4 md:grid-cols-4">
                        {searchedProducts.map((product) => (
                            <article key={product.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <img src={product.image_url ?? ''} alt={product.name} className="mb-3 h-36 w-full rounded object-cover" />
                                <h3 className="font-semibold">{product.name}</h3>
                                <p className="mt-1 text-sm text-slate-600">{product.category?.name}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">${Number(product.discounted_price ?? product.price).toFixed(2)}</span>
                                        {product.discounted_price && <span className="text-sm text-slate-400 line-through">${Number(product.price).toFixed(2)}</span>}
                                    </div>
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
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">${Number(product.discounted_price ?? product.price).toFixed(2)}</span>
                                        {product.discounted_price && <span className="text-sm text-slate-400 line-through">${Number(product.price).toFixed(2)}</span>}
                                    </div>
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
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">${Number(product.discounted_price ?? product.price).toFixed(2)}</span>
                                        {product.discounted_price && <span className="text-sm text-slate-400 line-through">${Number(product.price).toFixed(2)}</span>}
                                    </div>
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
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">${Number(product.discounted_price ?? product.price).toFixed(2)}</span>
                                        {product.discounted_price && <span className="text-sm text-slate-400 line-through">${Number(product.price).toFixed(2)}</span>}
                                    </div>
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
