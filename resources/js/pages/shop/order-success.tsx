import { Link } from '@inertiajs/react';
import ShopLayout from '@/components/shop-layout';

type Props = {
    order: {
        id: number;
        order_number: string;
        customer_name: string;
        total: string;
        payment_method: string | null;
        payment_brand: string | null;
        payment_last_four: string | null;
        items: { id: number; product_name: string; quantity: number; line_total: string }[];
    };
};

export default function OrderSuccess({ order }: Props) {
    const paymentLabel =
        order.payment_method === 'paypal'
            ? 'Paid with PayPal'
            : `Paid with ${order.payment_brand ?? 'card'} ending in ${order.payment_last_four ?? '••••'}`;

    return (
        <ShopLayout title="Order placed">
            <div className="mx-auto max-w-2xl rounded bg-white p-6 text-center shadow">
                <h1 className="text-2xl font-bold text-green-700">Shoe Order Confirmed 🎉</h1>
                <p className="mt-2">Thank you {order.customer_name}! Your shoe order number is {order.order_number}.</p>
                <p className="mt-4 text-lg font-semibold">Total paid: ${Number(order.total).toFixed(2)}</p>
                <p className="mt-1 text-sm text-slate-600">{paymentLabel}</p>
                <div className="mt-6 text-left">
                    <h2 className="font-semibold">Items</h2>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700">
                        {order.items.map((item) => (
                            <li key={item.id}>
                                {item.product_name} × {item.quantity} — ${Number(item.line_total).toFixed(2)}
                            </li>
                        ))}
                    </ul>
                </div>
                <Link href="/" className="mt-6 inline-block rounded bg-slate-900 px-4 py-2 font-semibold text-white">
                    Continue shopping shoes
                </Link>
            </div>
        </ShopLayout>
    );
}
