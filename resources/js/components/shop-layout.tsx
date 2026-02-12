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
            <div className="min-h-screen bg-slate-50 text-slate-900">
                <header className="border-b border-slate-200 bg-white">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                        <Link href="/" className="text-xl font-bold text-slate-900">
                            SoleStyle
                        </Link>
                        <nav className="flex items-center gap-4 text-sm font-medium">
                            <Link href="/" className="hover:text-blue-600">
                                Shoes
                            </Link>
                            {auth.user ? (
                                <>
                                    <Link href="/sign-in" className="hover:text-blue-600">
                                        {auth.user.name}
                                    </Link>
                                    <button type="button" onClick={() => router.post('/sign-out')} className="hover:text-blue-600">
                                        Sign out
                                    </button>
                                </>
                            ) : (
                                <Link href="/sign-in" className="hover:text-blue-600">
                                    Sign in
                                </Link>
                            )}
                            <Link href="/cart" className="rounded bg-slate-900 px-3 py-2 text-white hover:bg-slate-700">
                                Cart ({cartSummary?.count ?? 0})
                            </Link>
                        </nav>
                    </div>
                </header>
                <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
            </div>
        </>
    );
}
