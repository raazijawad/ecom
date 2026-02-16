import { Link } from '@inertiajs/react';

type Props = {
    productName: string;
    isVisible: boolean;
};

export default function AddToCartToast({ productName, isVisible }: Props) {
    if (!isVisible) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
            <div className="pointer-events-auto flex w-full max-w-2xl items-center gap-3 rounded-full bg-slate-900 px-4 py-3 text-white shadow-[0_20px_45px_rgba(15,23,42,0.45)]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
                        <path d="M5 10.5l3.2 3.2L15 7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>

                <p className="min-w-0 flex-1 text-sm sm:text-base">
                    <span className="font-bold">&quot;{productName}&quot;</span> has been added to your cart.
                </p>

                <Link href="/cart" className="rounded-full bg-blue-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-400">
                    View cart
                </Link>
            </div>
        </div>
    );
}
