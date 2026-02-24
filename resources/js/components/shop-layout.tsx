import { Head, router, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import AppLink from '@/components/app-link';
import type { Auth } from '@/types/auth';
import type { CartSummary } from '@/types/shop';

type Props = PropsWithChildren<{
    title: string;
    cartSummary?: CartSummary;
}>;

type SharedProps = {
    auth: Auth;
    collections: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
};

export default function ShopLayout({ title, cartSummary, children }: Props) {
    const { auth, collections } = usePage<SharedProps>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dashboardHref = auth.user?.role === 'admin' ? '/admin' : '/customer/dashboard';

    return (
        <>
            <Head title={title} />
            <div className=" bg-[#f7f8fa] text-slate-900">
                <header className="relative z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">
                    <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5">
                        <AppLink href="/" className="text-xl font-bold tracking-tight text-slate-900">
                            AERO <span className="text-blue-600">Step</span>
                        </AppLink>

                        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-700 md:flex">
                            <AppLink href="/" className="transition hover:text-slate-900">
                                Home
                            </AppLink>
                            <div className="group relative">
                                <button type="button" className="transition hover:text-slate-900">
                                    Collections
                                </button>
                                <div className="invisible absolute left-0 top-full z-20 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100">
                                    {collections.length > 0 ? (
                                        collections.map((collection) => (
                                            <AppLink
                                                key={collection.id}
                                                href={`/collections/${collection.slug}`}
                                                className="block rounded-md px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                                            >
                                                {collection.name}
                                            </AppLink>
                                        ))
                                    ) : (
                                        <span className="block px-3 py-2 text-sm text-slate-500">No collections found</span>
                                    )}
                                </div>
                            </div>
                            <AppLink href="/shoes" className="transition hover:text-slate-900">
                                Shoes
                            </AppLink>
                            <AppLink href="/" className="transition hover:text-slate-900">
                                Quick find
                            </AppLink>
                            <AppLink href="/" className="transition hover:text-slate-900">
                                Pages
                            </AppLink>
                        </nav>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-900 transition hover:border-slate-400 md:hidden"
                                onClick={() => setIsMobileMenuOpen(true)}
                                aria-label="Open menu"
                            >
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            {auth.user ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => router.post('/sign-out')}
                                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                                    >
                                        Sign out
                                    </button>
                                    <AppLink href={dashboardHref} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                                        Dashboard
                                    </AppLink>
                                </>
                            ) : (
                                <AppLink href="/sign-in" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                                    Sign in
                                </AppLink>
                            )}

                            <button
                                type="button"
                                className="hidden rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 md:inline-flex"
                            >
                                Contact Us
                            </button>
                            <AppLink
                                href="/cart"
                                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-900 hover:border-slate-400"
                            >
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <circle cx="9" cy="20" r="1.5" />
                                    <circle cx="17" cy="20" r="1.5" />
                                    <path
                                        d="M3 4h2l2.3 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 7H7.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span className="absolute -top-1 -right-1 rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
                                    {cartSummary?.count ?? 0}
                                </span>
                            </AppLink>
                        </div>
                    </div>
                </header>

                {isMobileMenuOpen ? (
                    <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true">
                        <button
                            type="button"
                            className="absolute inset-0 bg-slate-950/35"
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-label="Close menu"
                        />
                        <aside className="absolute right-0 top-0 h-full w-72 bg-white p-5 shadow-2xl">
                            <div className="mb-6 flex items-center justify-between">
                                <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">Menu</span>
                                <button
                                    type="button"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-700"
                                    aria-label="Close menu"
                                >
                                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>

                            <nav className="space-y-4 text-sm font-medium text-slate-700">
                                <AppLink href="/" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                                    Home
                                </AppLink>
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Collections</p>
                                    {collections.length > 0 ? (
                                        collections.map((collection) => (
                                            <AppLink
                                                key={collection.id}
                                                href={`/collections/${collection.slug}`}
                                                className="block rounded-md px-2 py-1"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {collection.name}
                                            </AppLink>
                                        ))
                                    ) : (
                                        <span className="block px-2 py-1 text-slate-500">No collections found</span>
                                    )}
                                </div>
                                <AppLink href="/shoes" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                                    Shoes
                                </AppLink>
                                <AppLink href="/" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                                    Quick find
                                </AppLink>
                                <AppLink href="/" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                                    Pages
                                </AppLink>
                            </nav>
                        </aside>
                    </div>
                ) : null}

                <section className="mb-10">
                    <div className="relative overflow-hidden border-y border-slate-200 bg-[#f7f5f1]">
                        <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.25)_1px,transparent_0)] [background-size:28px_28px]" />
                        <div className="pointer-events-none absolute right-[15%] top-12 h-52 w-52 rounded-full bg-red-500/20 blur-3xl" />
                        <div className="pointer-events-none absolute bottom-12 right-[34%] h-44 w-44 rounded-full bg-red-400/20 blur-3xl" />

                        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.45fr]">
                                <div className="max-w-md text-left">
                                    <p className="text-sm font-medium tracking-wide text-slate-400">Skip the Impossible</p>
                                    <h1 className="mt-3 text-4xl leading-tight font-black text-black sm:text-5xl">Extraordinary Performance</h1>
                                    <p className="mt-4 text-sm font-semibold text-red-600">
                                        Our Exclusive <span className="font-extrabold text-black">Nike Air Max Alpha Trainer</span>
                                    </p>

                                    <button
                                        type="button"
                                        className="mt-8 inline-flex bg-black px-6 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-slate-800"
                                    >
                                        VIEW COLLECTIONS
                                    </button>
                                </div>

                                <div className="relative min-h-[360px] lg:min-h-[420px]">
                                    <div className="absolute left-4 top-8 z-20 hidden space-y-7 lg:block">
                                        {[
                                            'Extraordinary Performance',
                                            'Excellent Energy Return',
                                            'Superior Grip',
                                        ].map((feature) => (
                                            <div key={feature} className="flex items-center gap-2 text-xs font-semibold text-black uppercase tracking-wide">
                                                <span className="inline-block h-px w-14 bg-black" />
                                                <span className="h-2 w-2 rounded-full bg-black" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="absolute right-2 top-8 z-20 hidden space-y-7 text-right lg:block">
                                        <p className="text-xs font-semibold tracking-wide text-black uppercase">Durable Daily Trainer</p>
                                        <div className="flex items-center justify-end gap-3">
                                            <p className="text-xs font-semibold tracking-wide text-black uppercase">Affordable Price</p>
                                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">$34</span>
                                        </div>
                                        <p className="text-xs font-semibold tracking-wide text-black uppercase">Modern Design</p>
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <img
                                            className="relative z-10 w-full max-w-2xl object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.3)]"
                                            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80"
                                            alt="Nike Air Max Alpha Trainer shoe"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-7 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <button type="button" className="rounded-full border border-slate-400 p-2 hover:bg-slate-100" aria-label="Previous slide">
                                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="m15 5-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <button type="button" className="rounded-full border border-slate-400 p-2 hover:bg-slate-100" aria-label="Next slide">
                                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="m9 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                                    <span className="h-2 w-2 rounded-full bg-slate-800" />
                                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                                </div>
                            </div>
                        </div>

                        <div className="relative border-t border-slate-300 bg-[#1f242a]">
                            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                                <div className="flex items-center gap-2 text-sm font-medium text-white">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold">✓</span>
                                    Add to Cart
                                </div>
                                <button type="button" className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600">
                                    View cart
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <main className="relative z-0 mx-auto max-w-6xl px-4 py-8">{children}</main>
            </div>
        </>
    );
}
