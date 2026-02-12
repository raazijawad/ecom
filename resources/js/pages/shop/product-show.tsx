import { Link, router } from '@inertiajs/react';
import ShopLayout from '@/components/shop-layout';
import { CartSummary, Product } from '@/types/shop';

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
                    <button
                        onClick={() => router.post('/cart', { product_id: product.id, quantity: 1 })}
                        className="mt-6 rounded bg-blue-600 px-4 py-3 font-semibold text-white"
                    >
                        Add to cart
                    </button>
                </div>
            </div>

            <section className="mt-10">
                <h2 className="mb-4 text-xl font-semibold">Related products</h2>
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
