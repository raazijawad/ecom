import { Link, router } from '@inertiajs/react';
import ShopLayout from '@/components/shop-layout';
import type { CartSummary, Product } from '@/types/shop';

type PaginatedProducts = {
    data: Product[];
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    products: PaginatedProducts;
    cartSummary: CartSummary;
};

export default function Shoes({ products, cartSummary }: Props) {
    const addToCart = (productId: number) => {
        router.post('/cart', { product_id: productId, quantity: 1 }, { preserveScroll: true });
    };

    return (
        <ShopLayout title="All Shoes" cartSummary={cartSummary}>
            <section>
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">All Shoes</h1>
                    <p className="mt-2 text-sm text-slate-600">Browse every shoe available in our store.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {products.data.map((product) => (
                        <article key={product.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                            <img src={product.image_url ?? ''} alt={product.name} className="mb-3 h-40 w-full rounded object-cover" />
                            <h2 className="font-semibold">{product.name}</h2>
                            <p className="mt-1 text-sm text-slate-600">{product.category?.name}</p>
                            <p className="mt-2 text-sm text-slate-700">{product.description}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="font-bold">${Number(product.price).toFixed(2)}</span>
                                <div className="flex gap-2">
                                    <Link href={`/products/${product.id}`} className="rounded border border-slate-300 px-3 py-2 text-sm">
                                        View
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => addToCart(product.id)}
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
                    {products.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url ?? '#'}
                            className={`rounded px-3 py-2 text-sm ${link.active ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </section>
        </ShopLayout>
    );
}
