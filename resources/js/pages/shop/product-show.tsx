import { Link, router } from '@inertiajs/react';
import ShopLayout from '@/components/shop-layout';
import type { CartSummary, Product } from '@/types/shop';

type Props = {
    product: Product;
    relatedProducts: Product[];
    cartSummary: CartSummary;
};

export default function ProductShow({ product, relatedProducts, cartSummary }: Props) {
    return (
        <ShopLayout title={product.name} cartSummary={cartSummary}>
            <div className="grid gap-8 md:grid-cols-2">
                <img src={product.image_url ?? ''} alt={product.name} className="w-full rounded-xl object-cover" />
                <div>
                    <p className="text-sm text-slate-500">{product.category?.name}</p>
                    <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
                    <p className="mt-4 text-slate-700">{product.description}</p>
                    <p className="mt-5 text-2xl font-bold">${Number(product.price).toFixed(2)}</p>

                    {product.sizes?.length ? (
                        <div className="mt-5">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Size</h2>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {product.sizes.map((size) => (
                                    <span key={size} className="rounded border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700">
                                        {size}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {product.colors?.length ? (
                        <div className="mt-5">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Colour</h2>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {product.colors.map((color) => (
                                    <span key={color} className="rounded bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                                        {color}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {product.shipping_details ? (
                        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Shipping</h2>
                            <p className="mt-1 text-sm text-slate-700">{product.shipping_details}</p>
                        </div>
                    ) : null}

                    {product.review_summary ? (
                        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Review</h2>
                            <p className="mt-1 text-sm text-slate-700">{product.review_summary}</p>
                        </div>
                    ) : null}

                    <button
                        onClick={() => router.post('/cart', { product_id: product.id, quantity: 1 })}
                        className="mt-6 rounded bg-blue-600 px-4 py-3 font-semibold text-white"
                    >
                        Add to shoe bag
                    </button>
                </div>
            </div>

            <section className="mt-10">
                <h2 className="mb-4 text-xl font-semibold">More shoes you may like</h2>
                <div className="grid gap-4 md:grid-cols-4">
                    {relatedProducts.map((item) => (
                        <Link key={item.id} href={`/products/${item.id}`} className="rounded border border-slate-200 bg-white p-3 shadow-sm">
                            <img src={item.image_url ?? ''} alt={item.name} className="mb-2 h-28 w-full rounded object-cover" />
                            <p className="font-medium">{item.name}</p>
                        </Link>
                    ))}
                </div>
            </section>
        </ShopLayout>
    );
}
