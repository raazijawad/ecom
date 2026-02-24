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

                    {/* Hero Section */}
                    <div className="relative bg-gray-900 py-12 sm:py-16 lg:py-20 xl:pt-32 xl:pb-44">
                        <div className="absolute inset-0 hidden lg:block">
                            <img
                                className="h-full w-full object-cover object-right-bottom"
                                src="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/hero/1/background.png"
                                alt=""
                            />
                        </div>

                        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-md lg:text-left xl:max-w-lg">

                                <h1 className="text-3xl font-bold text-white sm:text-4xl xl:text-5xl xl:leading-tight">
                                    Build SaaS Landing Page without Writing a Single Code
                                </h1>

                                <p className="mt-8 text-base leading-7 font-normal text-gray-400 lg:max-w-md lg:pr-16 xl:pr-0">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In nunc nisl eu
                                    consectetur. Mi massa elementum odio eu viverra amet.
                                </p>

                                <div className="mt-8 flex items-center justify-center space-x-5 lg:justify-start xl:mt-16">
                                    <a
                                        href="#"
                                        className="inline-flex items-center justify-center rounded-md border border-transparent
                       bg-white px-3 py-3 text-base leading-7 font-bold text-gray-900 transition-all
                       duration-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white
                       focus:ring-offset-2 focus:ring-offset-gray-900 sm:px-6"
                                    >
                                        Get UI Kit Now
                                    </a>

                                    <a
                                        href="#"
                                        className="inline-flex items-center justify-center rounded-md border border-transparent
                       bg-transparent px-2 py-3 text-base leading-7 font-bold text-white transition-all
                       duration-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700
                       focus:ring-offset-2 focus:ring-offset-gray-900 sm:px-4"
                                    >
                                        Check live preview
                                    </a>
                                </div>

                            </div>
                        </div>

                        {/* Mobile Background Image */}
                        <div className="mt-8 lg:hidden">
                            <img
                                className="h-full w-full object-cover"
                                src="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/hero/1/bg.png"
                                alt=""
                            />
                        </div>
                    </div>
                </section>

                <main className="relative z-0 mx-auto max-w-6xl px-4 py-8">{children}</main>
            </div>
        </>
    );
}
