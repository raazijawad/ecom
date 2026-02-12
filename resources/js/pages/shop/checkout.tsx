import { useForm } from '@inertiajs/react';
import ShopLayout from '@/components/shop-layout';
import { CartSummary } from '@/types/shop';

type Props = { cartSummary: CartSummary };

export default function Checkout({ cartSummary }: Props) {
    const form = useForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        shipping_address: '',
    });

    return (
        <ShopLayout title="Checkout" cartSummary={cartSummary}>
            <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                form.post('/checkout');
            }} className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2 rounded bg-white p-5 shadow">
                    <input className="w-full rounded border px-3 py-2" placeholder="Full name" value={form.data.customer_name} onChange={(e) => form.setData('customer_name', e.target.value)} />
                    <input className="w-full rounded border px-3 py-2" placeholder="Email" value={form.data.customer_email} onChange={(e) => form.setData('customer_email', e.target.value)} />
                    <input className="w-full rounded border px-3 py-2" placeholder="Phone" value={form.data.customer_phone} onChange={(e) => form.setData('customer_phone', e.target.value)} />
                    <textarea className="w-full rounded border px-3 py-2" rows={4} placeholder="Shipping address" value={form.data.shipping_address} onChange={(e) => form.setData('shipping_address', e.target.value)} />
                </div>
                <aside className="rounded bg-white p-5 shadow">
                    <h2 className="font-semibold">Order total</h2>
                    <p className="mt-2 text-2xl font-bold">${cartSummary.total.toFixed(2)}</p>
                    <button className="mt-4 w-full rounded bg-slate-900 px-4 py-2 font-semibold text-white" disabled={form.processing}>
                        Place order
                    </button>
                </aside>
            </form>
        </ShopLayout>
    );
}
