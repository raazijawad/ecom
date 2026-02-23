import { router } from '@inertiajs/react';
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
    const resolveImageUrl = (path: string | null | undefined): string | null => {
        if (!path) {
            return null;
        }

        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
            return path;
        }

        return `/storage/${path}`;
    };

    const resolveCardImage = (product: Product): string => {
        const colorImage = product.color_image_urls?.find((entry) => Boolean(entry?.product_image))?.product_image;

        return resolveImageUrl(colorImage) ?? resolveImageUrl(product.image_url) ?? '';
    };

    const viewProductDetails = (productId: number) => {
        router.visit(`/products/${productId}`);
    };

    return (
        <ShopLayout title={`${category.name} Products`} cartSummary={cartSummary}>
            <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">Collection</p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">{category.name}</h1>
                <p className="mt-3 text-slate-600">{category.description ?? `Browse products from the ${category.name} collection.`}</p>
            </section>

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
                                <article key={product.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <AppLink href={`/products/${product.id}`} className="block">
                                        <div className="flex h-44 items-center justify-center rounded-xl bg-slate-50 p-3">
                                            <img src={resolveCardImage(product)} alt={product.name} className="h-full w-full object-contain" />
                                        </div>
                                    </AppLink>
                                    <h4 className="mt-4 text-base font-bold text-black">{product.name}</h4>
                                    <p className="mt-1 text-sm text-slate-400">{product.category?.name ?? 'Shoes'}</p>
                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-black">${Number(product.discounted_price ?? product.price).toFixed(2)}</span>
                                            {product.discounted_price && (
                                                <span className="text-sm text-slate-400 line-through">${Number(product.price).toFixed(2)}</span>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => viewProductDetails(product.id)}
                                            className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                                        >
                                            Buy now
                                        </button>
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
