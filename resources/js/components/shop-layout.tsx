import { Head, router, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import AppLink from '@/components/app-link';
import HeroSection from '@/components/hero-section';
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

                <HeroSection />

                <main id="content" className="relative z-0 mx-auto max-w-6xl px-4 py-8">{children}</main>
            </div>
        </>
    );
}
