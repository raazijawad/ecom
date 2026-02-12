import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

type AuthMode = 'login' | 'register';

export default function SignIn() {
    const [mode, setMode] = useState<AuthMode>('login');

    const loginForm = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const registerForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submitLogin = (e: React.FormEvent) => {
        e.preventDefault();
        loginForm.post('/sign-in');
    };

    const submitRegister = (e: React.FormEvent) => {
        e.preventDefault();
        registerForm.post('/sign-up');
    };

    return (
        <>
            <Head title="Sign In" />
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6">
                        <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                            ← Back to shop
                        </Link>
                        <h1 className="mt-3 text-2xl font-bold text-slate-900">{mode === 'login' ? 'Login account' : 'Create account'}</h1>
                        <p className="mt-1 text-sm text-slate-600">
                            {mode === 'login'
                                ? 'Welcome back! Enter your details to continue.'
                                : 'Create your account to start shopping.'}
                        </p>
                    </div>

                    <div className="mb-5 grid grid-cols-2 rounded-lg bg-slate-100 p-1 text-sm font-medium">
                        <button
                            type="button"
                            onClick={() => setMode('login')}
                            className={`rounded-md px-3 py-2 transition ${
                                mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Login account
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('register')}
                            className={`rounded-md px-3 py-2 transition ${
                                mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Create account
                        </button>
                    </div>

                    {mode === 'login' ? (
                        <form onSubmit={submitLogin} className="space-y-4">

                            <div>
                                <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={loginForm.data.email}
                                    onChange={(e) => loginForm.setData('email', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                                    placeholder="you@example.com"
                                    required
                                />
                                {loginForm.errors.email && <p className="mt-1 text-sm text-red-600">{loginForm.errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={loginForm.data.password}
                                    onChange={(e) => loginForm.setData('password', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                                {loginForm.errors.password && <p className="mt-1 text-sm text-red-600">{loginForm.errors.password}</p>}
                            </div>

                            <label className="flex items-center gap-2 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={loginForm.data.remember}
                                    onChange={(e) => loginForm.setData('remember', e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                Remember me
                            </label>

                            <button
                                type="submit"
                                disabled={loginForm.processing}
                                className="w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700 disabled:opacity-70"
                            >
                                Sign in
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={submitRegister} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                                    Full name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={registerForm.data.name}
                                    onChange={(e) => registerForm.setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                                    placeholder="Jane Doe"
                                    required
                                />
                                {registerForm.errors.name && <p className="mt-1 text-sm text-red-600">{registerForm.errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="register-email" className="mb-1 block text-sm font-medium text-slate-700">
                                    Email
                                </label>
                                <input
                                    id="register-email"
                                    type="email"
                                    value={registerForm.data.email}
                                    onChange={(e) => registerForm.setData('email', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                                    placeholder="you@example.com"
                                    required
                                />
                                {registerForm.errors.email && <p className="mt-1 text-sm text-red-600">{registerForm.errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="register-password" className="mb-1 block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <input
                                    id="register-password"
                                    type="password"
                                    value={registerForm.data.password}
                                    onChange={(e) => registerForm.setData('password', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                                {registerForm.errors.password && <p className="mt-1 text-sm text-red-600">{registerForm.errors.password}</p>}
                            </div>

                            <div>
                                <label htmlFor="password_confirmation" className="mb-1 block text-sm font-medium text-slate-700">
                                    Confirm password
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    value={registerForm.data.password_confirmation}
                                    onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={registerForm.processing}
                                className="w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700 disabled:opacity-70"
                            >
                                Create account
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}
