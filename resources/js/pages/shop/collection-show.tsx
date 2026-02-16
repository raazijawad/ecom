import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AddToCartToast from '@/components/add-to-cart-toast';
import AppLink from '@/components/app-link';
import ShopLayout from '@/components/shop-layout';
import type { CartSummary, Category, Product } from '@/types/shop';

type PaginatedProducts = {
    data: Product[];
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    category: Category;
    products: PaginatedProducts;
    cartSummary: CartSummary;
};

export default function CollectionShow({ category, products, cartSummary }: Props) {
    const [showCartMessage, setShowCartMessage] = useState(false);
    const [lastAddedProductName, setLastAddedProductName] = useState('');

    useEffect(() => {
        if (!showCartMessage) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setShowCartMessage(false);
        }, 3000);

        return () => window.clearTimeout(timeout);
    }, [showCartMessage]);

    const addToCart = (productId: number, productName: string) => {
        router.post(
            '/cart',
            { product_id: productId, quantity: 1 },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setLastAddedProductName(productName);
                    setShowCartMessage(true);
                },
            },
        );
    };

    return (
        <ShopLayout title={`${category.name} Products`} cartSummary={cartSummary}>
            <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">Collection</p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">{category.name}</h1>
                <p className="mt-3 text-slate-600">{category.description ?? `Browse products from the ${category.name} collection.`}</p>
            </section>

            <AddToCartToast productName={lastAddedProductName} isVisible={showCartMessage} />

            <section>
                <div className="mb-4 flex items-center justify-between gap-2">
                    <h2 className="text-xl font-semibold">Products</h2>
                    <AppLink href="/" className="rounded border border-slate-300 px-3 py-2 text-sm">
                        Back to home
                    </AppLink>
                </div>

                {products.data.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
                        No products available in this collection yet.
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 md:grid-cols-3">
                            {products.data.map((product) => (
                                <article key={product.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <img src={product.image_url ?? ''} alt={product.name} className="mb-3 h-40 w-full rounded object-cover" />
                                    <h3 className="font-semibold">{product.name}</h3>
                                    <p className="mt-2 text-sm text-slate-700">{product.description}</p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="font-bold">${Number(product.price).toFixed(2)}</span>
                                        <div className="flex gap-2">
                                            <AppLink href={`/products/${product.id}`} className="rounded border border-slate-300 px-3 py-2 text-sm">
                                                View
                                            </AppLink>
                                            <button
                                                onClick={() => addToCart(product.id, product.name)}
                                                className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">
                            {products.links.map((link, idx) => (
                                <AppLink
                                    key={idx}
                                    href={link.url ?? '#'}
                                    className={`rounded border px-3 py-2 text-sm ${link.active ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </>
                )}
            </section>
        </ShopLayout>
    );
}
