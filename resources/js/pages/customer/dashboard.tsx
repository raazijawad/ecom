import { Head, router, usePage } from '@inertiajs/react';
import { FormEvent, useMemo, useState } from 'react';
import ShopLayout from '@/components/shop-layout';
import type { Auth } from '@/types/auth';

type RecentOrder = {
    id: number;
    orderNumber: string;
    orderDate: string;
    status: string;
    total: string;
};

type SharedProps = {
    auth: Auth;
    recentOrders: RecentOrder[];
};

type Address = {
    id: number;
    type: 'Shipping' | 'Billing';
    label: string;
    line1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
};

type Notification = {
    id: number;
    title: string;
    message: string;
    type: 'order' | 'promo' | 'info';
};

const starterAddresses: Address[] = [
    {
        id: 1,
        type: 'Shipping',
        label: 'Home',
        line1: '14 Lakeview Avenue',
        city: 'Austin',
        state: 'TX',
        zip: '78701',
        country: 'United States',
    },
    {
        id: 2,
        type: 'Billing',
        label: 'Office',
        line1: '220 Market Street',
        city: 'Austin',
        state: 'TX',
        zip: '78702',
        country: 'United States',
    },
];

const starterNotifications: Notification[] = [
    {
        id: 1,
        title: 'Order update',
        message: 'Your latest order has been shipped and is on the way.',
        type: 'order',
    },
    {
        id: 2,
        title: 'Rewards reminder',
        message: 'You have 240 reward points expiring next month.',
        type: 'info',
    },
    {
        id: 3,
        title: 'Weekend offer',
        message: 'Use code SAVE15 for 15% off footwear this weekend.',
        type: 'promo',
    },
];

const starterWishlist = [
    { id: 1, name: 'AERO CloudRunner', price: '$129.00' },
    { id: 2, name: 'AERO TrailEdge', price: '$159.00' },
    { id: 3, name: 'AERO SwiftLite', price: '$109.00' },
];

const starterCartItems = [
    { id: 1, name: 'AERO Daily Walk', qty: 1, total: '$99.00' },
    { id: 2, name: 'AERO Sport Socks', qty: 2, total: '$24.00' },
];

export default function CustomerDashboard() {
    const { auth, recentOrders } = usePage<SharedProps>().props;
    const [profile, setProfile] = useState({
        name: auth.user?.name ?? '',
        email: auth.user?.email ?? '',
        phone: auth.user?.phone ?? '',
    });
    const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [addresses, setAddresses] = useState<Address[]>(starterAddresses);
    const [addressDraft, setAddressDraft] = useState<Address>({
        id: 0,
        type: 'Shipping',
        label: '',
        line1: '',
        city: '',
        state: '',
        zip: '',
        country: '',
    });
    const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
    const [wishlist, setWishlist] = useState(starterWishlist);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const latestOrder = recentOrders[0];
    const cartTotal = useMemo(
        () => starterCartItems.reduce((sum, item) => sum + Number.parseFloat(item.total.replace('$', '')), 0).toFixed(2),
        [],
    );

    const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!profile.name || !profile.email) {
            setProfileMessage({ type: 'error', text: 'Name and email are required to update your profile.' });

            return;
        }

        setProfileMessage({ type: 'success', text: 'Your account information has been updated successfully.' });
    };

    const resetAddressDraft = () => {
        setAddressDraft({ id: 0, type: 'Shipping', label: '', line1: '', city: '', state: '', zip: '', country: '' });
        setEditingAddressId(null);
    };

    const handleAddressSave = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!addressDraft.label || !addressDraft.line1 || !addressDraft.city || !addressDraft.country) {
            return;
        }

        if (editingAddressId) {
            setAddresses((current) => current.map((address) => (address.id === editingAddressId ? { ...addressDraft, id: editingAddressId } : address)));
        } else {
            setAddresses((current) => [...current, { ...addressDraft, id: Date.now() }]);
        }

        resetAddressDraft();
    };

    const startAddressEdit = (address: Address) => {
        setAddressDraft(address);
        setEditingAddressId(address.id);
    };

    const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const currentPassword = String(formData.get('currentPassword') ?? '');
        const newPassword = String(formData.get('newPassword') ?? '');
        const confirmPassword = String(formData.get('confirmPassword') ?? '');

        if (!currentPassword || !newPassword) {
            setPasswordMessage({ type: 'error', text: 'Please complete all password fields.' });

            return;
        }

        if (newPassword.length < 8) {
            setPasswordMessage({ type: 'error', text: 'New password must be at least 8 characters long.' });

            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Password confirmation does not match.' });

            return;
        }

        setPasswordMessage({ type: 'success', text: 'Password updated successfully.' });
        event.currentTarget.reset();
    };

    return (
        <ShopLayout title="Customer Dashboard">
            <Head title="Customer Dashboard" />
            <div className="space-y-6 pb-10">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-900">Hello, {auth.user?.name ?? 'Customer'}</h1>
                    <p className="mt-2 text-slate-600">Welcome back to your account dashboard. Track orders, update details, and manage your shopping preferences.</p>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-slate-900">Recent Orders</h2>
                        {latestOrder ? <p className="text-sm text-blue-700">Latest activity: {latestOrder.status} · {latestOrder.orderDate}</p> : null}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="rounded-l-lg px-4 py-3 font-medium">Order ID</th>
                                    <th className="px-4 py-3 font-medium">Order Date</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Total Amount</th>
                                    <th className="rounded-r-lg px-4 py-3 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className={order.id === latestOrder?.id ? 'bg-blue-50/50' : ''}>
                                            <td className="px-4 py-3 font-medium text-slate-800">{order.orderNumber}</td>
                                            <td className="px-4 py-3 text-slate-600">{order.orderDate}</td>
                                            <td className="px-4 py-3">
                                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-700">{order.total}</td>
                                            <td className="px-4 py-3">
                                                <button
                                                    type="button"
                                                    onClick={() => router.get(`/checkout/success/${order.id}`)}
                                                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                                                >
                                                    View Order
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                                            No recent orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-2">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">Profile / Account Information</h2>
                        <form className="mt-4 space-y-3" onSubmit={handleProfileSubmit}>
                            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Name" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
                            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Email" type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} />
                            <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Phone" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} />
                            <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Save Profile</button>
                            {profileMessage ? (
                                <p className={profileMessage.type === 'success' ? 'text-sm text-emerald-600' : 'text-sm text-rose-600'}>{profileMessage.text}</p>
                            ) : null}
                        </form>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">Change Password</h2>
                        <form className="mt-4 space-y-3" onSubmit={handlePasswordSubmit}>
                            <input name="currentPassword" type="password" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Current password" />
                            <input name="newPassword" type="password" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="New password" />
                            <input name="confirmPassword" type="password" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Confirm new password" />
                            <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Update Password</button>
                            {passwordMessage ? (
                                <p className={passwordMessage.type === 'success' ? 'text-sm text-emerald-600' : 'text-sm text-rose-600'}>{passwordMessage.text}</p>
                            ) : null}
                        </form>
                    </section>
                </div>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900">Address Book</h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {addresses.map((address) => (
                            <article key={address.id} className="rounded-xl border border-slate-200 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{address.type}</p>
                                <p className="mt-2 font-semibold text-slate-900">{address.label}</p>
                                <p className="text-sm text-slate-600">{address.line1}</p>
                                <p className="text-sm text-slate-600">
                                    {address.city}, {address.state} {address.zip}
                                </p>
                                <p className="text-sm text-slate-600">{address.country}</p>
                                <div className="mt-3 flex gap-2">
                                    <button type="button" onClick={() => startAddressEdit(address)} className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold">Edit Address</button>
                                    <button type="button" onClick={() => setAddresses((current) => current.filter((item) => item.id !== address.id))} className="rounded-md border border-rose-300 px-3 py-1 text-xs font-semibold text-rose-600">Delete Address</button>
                                </div>
                            </article>
                        ))}
                    </div>
                    <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={handleAddressSave}>
                        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Label (Home, Office)" value={addressDraft.label} onChange={(event) => setAddressDraft({ ...addressDraft, label: event.target.value })} />
                        <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={addressDraft.type} onChange={(event) => setAddressDraft({ ...addressDraft, type: event.target.value as Address['type'] })}>
                            <option value="Shipping">Shipping</option>
                            <option value="Billing">Billing</option>
                        </select>
                        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Street address" value={addressDraft.line1} onChange={(event) => setAddressDraft({ ...addressDraft, line1: event.target.value })} />
                        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="City" value={addressDraft.city} onChange={(event) => setAddressDraft({ ...addressDraft, city: event.target.value })} />
                        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="State" value={addressDraft.state} onChange={(event) => setAddressDraft({ ...addressDraft, state: event.target.value })} />
                        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="ZIP" value={addressDraft.zip} onChange={(event) => setAddressDraft({ ...addressDraft, zip: event.target.value })} />
                        <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Country" value={addressDraft.country} onChange={(event) => setAddressDraft({ ...addressDraft, country: event.target.value })} />
                        <div className="md:col-span-2 flex flex-wrap gap-2">
                            <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">{editingAddressId ? 'Update Address' : 'Add New Address'}</button>
                            {editingAddressId ? (
                                <button type="button" onClick={resetAddressDraft} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
                            ) : null}
                        </div>
                    </form>
                </section>

                <div className="grid gap-6 lg:grid-cols-2">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">Wishlist</h2>
                        <ul className="mt-4 space-y-3">
                            {wishlist.map((item) => (
                                <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
                                    <div>
                                        <p className="font-semibold text-slate-900">{item.name}</p>
                                        <p className="text-sm text-slate-500">{item.price}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="button" className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">Add to Cart</button>
                                        <button type="button" onClick={() => setWishlist((current) => current.filter((product) => product.id !== item.id))} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">Remove</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">Cart Preview</h2>
                        <ul className="mt-4 space-y-3 text-sm">
                            {starterCartItems.map((item) => (
                                <li key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                                    <span>
                                        {item.name} <span className="text-slate-500">x{item.qty}</span>
                                    </span>
                                    <span className="font-semibold text-slate-900">{item.total}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-4 text-sm font-semibold text-slate-800">Total: ${cartTotal}</p>
                        <button type="button" onClick={() => router.get('/checkout')} className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Go to Checkout</button>
                    </section>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">Notifications / Alerts</h2>
                        <ul className="mt-4 space-y-3 text-sm">
                            {starterNotifications.map((notification) => (
                                <li key={notification.id} className="rounded-xl border border-slate-200 p-3">
                                    <p className="font-semibold text-slate-900">{notification.title}</p>
                                    <p className="mt-1 text-slate-600">{notification.message}</p>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">Coupons / Rewards</h2>
                        <div className="mt-4 space-y-3 text-sm text-slate-700">
                            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">ACTIVE COUPON: SAVE15 (expires in 3 days)</p>
                            <p>Reward points: <span className="font-semibold">240 points</span></p>
                            <p>Points expiration: 31 Mar 2026</p>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">Support / Help Center</h2>
                        <form className="mt-4 space-y-3">
                            <textarea className="h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Describe your issue"></textarea>
                            <div className="flex flex-wrap gap-2">
                                <button type="button" className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">Contact Support</button>
                                <button type="button" className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700">FAQ</button>
                                <button type="button" className="rounded-md border border-blue-300 px-3 py-1.5 text-xs font-semibold text-blue-700">Open Ticket</button>
                            </div>
                        </form>
                    </section>
                </div>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                    <button type="button" onClick={() => router.post('/sign-out')} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white">
                        Logout
                    </button>
                </section>
            </div>
        </ShopLayout>
    );
}
