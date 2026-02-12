import { Head, Link, useForm } from '@inertiajs/react';

export default function CreateAccount() {
    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/create-account');
    };

    return (
        <>
            <Head title="Create Account" />
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6">
                        <Link href="/sign-in" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                            ← Back to sign in
                        </Link>
                        <h1 className="mt-3 text-2xl font-bold text-slate-900">Create your account</h1>
                        <p className="mt-1 text-sm text-slate-600">Fill in the details below to get started.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                                placeholder="Jane Doe"
                                required
                            />
                            {form.errors.name ? <p className="mt-1 text-xs text-red-600">{form.errors.name}</p> : null}
                        </div>

                        <div>
                            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                                placeholder="you@example.com"
                                required
                            />
                            {form.errors.email ? <p className="mt-1 text-xs text-red-600">{form.errors.email}</p> : null}
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={form.data.password}
                                onChange={(e) => form.setData('password', e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                                placeholder="At least 8 characters"
                                required
                            />
                            {form.errors.password ? <p className="mt-1 text-xs text-red-600">{form.errors.password}</p> : null}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="mb-1 block text-sm font-medium text-slate-700">
                                Confirm Password
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                value={form.data.password_confirmation}
                                onChange={(e) => form.setData('password_confirmation', e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                                placeholder="Repeat your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            Create account
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
