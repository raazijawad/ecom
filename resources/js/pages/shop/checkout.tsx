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
        payment_method: 'paypal',
        payment_paypal_email: '',
        payment_cardholder_name: '',
        payment_card_number: '',
        payment_exp_month: '',
        payment_exp_year: '',
        payment_cvv: '',
    });

    return (
        <ShopLayout title="Checkout" cartSummary={cartSummary}>
            <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.post('/checkout');
                }}
                className="grid gap-6 lg:grid-cols-3"
            >
                <div className="space-y-6 lg:col-span-2">
                    <section className="space-y-4 rounded bg-white p-5 shadow">
                        <h2 className="font-semibold">Shipping details</h2>
                        <input className="w-full rounded border px-3 py-2" placeholder="Full name" value={form.data.customer_name} onChange={(e) => form.setData('customer_name', e.target.value)} />
                        <input className="w-full rounded border px-3 py-2" placeholder="Email" value={form.data.customer_email} onChange={(e) => form.setData('customer_email', e.target.value)} />
                        <input className="w-full rounded border px-3 py-2" placeholder="Phone" value={form.data.customer_phone} onChange={(e) => form.setData('customer_phone', e.target.value)} />
                        <textarea className="w-full rounded border px-3 py-2" rows={4} placeholder="Shipping address" value={form.data.shipping_address} onChange={(e) => form.setData('shipping_address', e.target.value)} />
                    </section>

                    <section className="space-y-4 rounded bg-white p-5 shadow">
                        <h2 className="font-semibold">Billing details</h2>

                        <div className="flex flex-wrap gap-5 text-sm">
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="payment_method"
                                    checked={form.data.payment_method === 'paypal'}
                                    onChange={() => form.setData('payment_method', 'paypal')}
                                />
                                PayPal
                            </label>
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="payment_method"
                                    checked={form.data.payment_method === 'card'}
                                    onChange={() => form.setData('payment_method', 'card')}
                                />
                                Visa / Mastercard
                            </label>
                        </div>

                        {form.data.payment_method === 'paypal' ? (
                            <>
                                <input
                                    className="w-full rounded border px-3 py-2"
                                    placeholder="PayPal email"
                                    value={form.data.payment_paypal_email}
                                    onChange={(e) => form.setData('payment_paypal_email', e.target.value)}
                                />
                                {form.errors.payment_paypal_email ? <p className="text-sm text-red-600">{form.errors.payment_paypal_email}</p> : null}
                            </>
                        ) : (
                            <>
                                <input className="w-full rounded border px-3 py-2" placeholder="Cardholder name" value={form.data.payment_cardholder_name} onChange={(e) => form.setData('payment_cardholder_name', e.target.value)} />
                                <input className="w-full rounded border px-3 py-2" placeholder="Card number" value={form.data.payment_card_number} onChange={(e) => form.setData('payment_card_number', e.target.value)} />
                                <div className="grid grid-cols-3 gap-3">
                                    <input className="rounded border px-3 py-2" placeholder="MM" value={form.data.payment_exp_month} onChange={(e) => form.setData('payment_exp_month', e.target.value)} />
                                    <input className="rounded border px-3 py-2" placeholder="YYYY" value={form.data.payment_exp_year} onChange={(e) => form.setData('payment_exp_year', e.target.value)} />
                                    <input className="rounded border px-3 py-2" placeholder="CVV" value={form.data.payment_cvv} onChange={(e) => form.setData('payment_cvv', e.target.value)} />
                                </div>
                                {form.errors.payment_card_number ? <p className="text-sm text-red-600">{form.errors.payment_card_number}</p> : null}
                            </>
                        )}
                    </section>
                </div>

                <aside className="h-fit rounded bg-white p-5 shadow">
                    <h2 className="font-semibold">Shoe order total</h2>
                    <p className="mt-2 text-2xl font-bold">${cartSummary.total.toFixed(2)}</p>
                    <button className="mt-4 w-full rounded bg-slate-900 px-4 py-2 font-semibold text-white" disabled={form.processing}>
                        Pay & place shoe order
                    </button>
                </aside>
            </form>
        </ShopLayout>
    );
}
