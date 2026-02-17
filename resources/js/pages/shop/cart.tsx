import { router } from '@inertiajs/react';
import AppLink from '@/components/app-link';
import ShopLayout from '@/components/shop-layout';
import type { CartSummary } from '@/types/shop';

type Props = { cartSummary: CartSummary };

export default function Cart({ cartSummary }: Props) {
    return (
        <ShopLayout title="Shoe Bag" cartSummary={cartSummary}>
            <h1 className="mb-6 text-2xl font-bold">Your Shoe Bag</h1>
            {cartSummary.items.length === 0 ? (
                <div className="rounded bg-white p-6 shadow">Your shoe bag is empty.</div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-3 lg:col-span-2">
                        {cartSummary.items.map((item) => (
                            <div key={item.item_key} className="flex items-center gap-4 rounded bg-white p-4 shadow">
                                <img src={item.image_url ?? ''} alt={item.name} className="h-20 w-20 rounded object-cover" />
                                <div className="flex-1">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-slate-600">${item.price.toFixed(2)}</p>
                                    {(item.size || item.color) && (
                                        <p className="text-sm text-slate-500">
                                            {item.size ? `Size: ${item.size}` : null}
                                            {item.size && item.color ? ' · ' : null}
                                            {item.color ? `Colour: ${item.color}` : null}
                                        </p>
                                    )}
                                </div>
                                <input
                                    type="number"
                                    min={0}
                                    value={item.quantity}
                                    onChange={(e) =>
                                        router.patch(
                                            `/cart/${item.product_id}`,
                                            { quantity: Number(e.target.value), item_key: item.item_key },
                                            { preserveScroll: true },
                                        )
                                    }
                                    className="w-16 rounded border border-slate-300 px-2 py-1"
                                />
                                <button
                                    onClick={() =>
                                        router.delete(`/cart/${item.product_id}`, {
                                            data: { item_key: item.item_key },
                                            preserveScroll: true,
                                        })
                                    }
                                    className="rounded border border-red-300 px-2 py-1 text-red-600"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <aside className="rounded bg-white p-5 shadow">
                        <h2 className="text-lg font-semibold">Bag Summary</h2>
                        <dl className="mt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <dt>Subtotal</dt>
                                <dd>${cartSummary.subtotal.toFixed(2)}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt>Shipping</dt>
                                <dd>${cartSummary.shipping_fee.toFixed(2)}</dd>
                            </div>
                            <div className="flex justify-between border-t pt-2 text-base font-bold">
                                <dt>Total</dt>
                                <dd>${cartSummary.total.toFixed(2)}</dd>
                            </div>
                        </dl>
                        <AppLink href="/checkout" className="mt-4 block rounded bg-blue-600 px-4 py-2 text-center font-semibold text-white">
                            Proceed to checkout
                        </AppLink>
                    </aside>
                </div>
            )}
        </ShopLayout>
    );
}
