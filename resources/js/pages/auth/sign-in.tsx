import { Head, useForm, usePage } from '@inertiajs/react';
import AppLink from '@/components/app-link';
import { loginWithRole, logoutWithRole } from '@/lib/role-auth';
import type { Auth } from '@/types/auth';

type SharedProps = {
    auth: Auth;
};

export default function SignIn() {
    const { auth } = usePage<SharedProps>().props;

    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        loginWithRole(form.data.email);
        form.post('/sign-in');
    };

    const signOut = () => {
        logoutWithRole();
        form.post('/sign-out');
    };

    return (
        <>
            <Head title="Sign In" />
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6">
                        <AppLink href="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                            ← Back to shop
                        </AppLink>
                    </div>

                    {auth.user ? (
                        <div className="space-y-4">
                            <h1 className="text-2xl font-bold text-slate-900">Logged in</h1>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                                <p className="font-semibold text-slate-900">{auth.user.name}</p>
                                <p>{auth.user.email}</p>
                            </div>
                            <button
                                type="button"
                                onClick={signOut}
                                className="w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700"
                            >
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <>
                            <h1 className="mt-3 text-2xl font-bold text-slate-900">Sign in to your account</h1>
                            <p className="mt-1 mb-4 text-sm text-slate-600">Welcome back! Enter your details to continue.</p>

                            <form onSubmit={submit} className="space-y-4">
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
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <label className="flex items-center gap-2 text-sm text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={form.data.remember}
                                        onChange={(e) => form.setData('remember', e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    Remember me
                                </label>

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    Sign in
                                </button>
                            </form>

                            <p className="mt-4 text-sm text-slate-600">
                                Don&apos;t have an account?{' '}
                                <AppLink href="/create-account" className="font-medium text-blue-600 hover:text-blue-500">
                                    Create account
                                </AppLink>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
