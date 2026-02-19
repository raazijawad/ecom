import { Head, usePage } from '@inertiajs/react';
import type { Auth } from '@/types/auth';

type SharedProps = {
    auth: Auth;
};

export default function CustomerDashboard() {
    const { auth } = usePage<SharedProps>().props;

    return (
        <>
            <Head title="Customer Dashboard" />
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
                <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-900">Customer Dashboard</h1>
                    <p className="mt-2 text-slate-600">Welcome, {auth.user?.name}.</p>
                    <p className="mt-1 text-sm text-slate-500">You are now signed in to your customer account.</p>
                </div>
            </div>
        </>
    );
}
