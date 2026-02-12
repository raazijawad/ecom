import { Head, Link, router, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import type { Auth } from '@/types/auth';
import type { CartSummary } from '@/types/shop';

type Props = PropsWithChildren<{
    title: string;
    cartSummary?: CartSummary;
}>;

type SharedProps = {
    auth: Auth;
};

export default function ShopLayout({ title, cartSummary, children }: Props) {
    const { auth } = usePage<SharedProps>().props;

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
                <header className="border-b border-slate-200/70 bg-white/90 backdrop-blur">
                    <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5">
                        <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
                            AERO <span className="text-blue-600">Step</span>
                        </Link>

                        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-700 md:flex">
                            <Link href="/" className="transition hover:text-slate-900">
                                Home
                            </Link>
                            <Link href="/" className="transition hover:text-slate-900">
                                Collections
                            </Link>
                            <Link href="/" className="transition hover:text-slate-900">
                                Shoes
                            </Link>
                            <Link href="/" className="transition hover:text-slate-900">
                                Quick find
                            </Link>
                            <Link href="/" className="transition hover:text-slate-900">
                                Pages
                            </Link>
                        </nav>

                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <button
                                    type="button"
                                    onClick={() => router.post('/sign-out')}
                                    className="text-sm font-medium text-slate-600 hover:text-slate-900"
                                >
                                    Sign out
                                </button>
                            ) : (
                                <Link href="/sign-in" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                                    Sign in
                                </Link>
                            )}

                            <button
                                type="button"
                                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                            >
                                Contact Us
                            </button>
                            <Link
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
                            </Link>
                        </div>
                    </div>
                </header>
                <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
            </div>
        </>
    );
}
