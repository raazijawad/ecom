import { FormEvent, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import AdminRoute from '@/components/routes/admin-route';
import PrivateRoute from '@/components/routes/private-route';
import { getStoredRole, isAuthenticated, loginWithRole, logoutWithRole } from '@/lib/role-auth';
import NotAuthorizedPage from '@/pages/auth-demo/not-authorized';

function LoginPage() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const role = loginWithRole(email);
        navigate(role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    };

    return (
        <main className="mx-auto mt-16 max-w-xl rounded-xl border border-slate-200 bg-white p-8">
            <h1 className="text-2xl font-bold text-slate-900">Login</h1>
            <p className="mt-2 text-sm text-slate-600">
                Use <strong>admin@gmail.com</strong> for admin access. Any other email is treated as a normal user.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter email"
                    className="w-full rounded-md border border-slate-300 px-3 py-2"
                    required
                />
                <button type="submit" className="rounded-md bg-slate-900 px-4 py-2 text-white">
                    Sign In
                </button>
            </form>
        </main>
    );
}

function DashboardPage() {
    const role = getStoredRole();

    return (
        <main className="mx-auto mt-16 max-w-xl rounded-xl border border-slate-200 bg-white p-8">
            <h1 className="text-2xl font-bold text-slate-900">User Dashboard</h1>
            <p className="mt-2 text-sm text-slate-600">Logged in as: {role ?? 'unknown'}</p>
            <nav className="mt-6 flex gap-4 text-sm">
                <Link className="text-blue-600" to="/admin">
                    Go to Admin
                </Link>
                <Link className="text-blue-600" to="/">
                    Home
                </Link>
            </nav>
        </main>
    );
}

function AdminDashboardPage() {
    return (
        <main className="mx-auto mt-16 max-w-xl rounded-xl border border-emerald-200 bg-emerald-50 p-8">
            <h1 className="text-2xl font-bold text-emerald-700">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-emerald-700">Only users with role === "admin" can see this page.</p>
        </main>
    );
}

function HomePage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutWithRole();
        navigate('/login', { replace: true });
    };

    return (
        <main className="mx-auto mt-16 max-w-xl rounded-xl border border-slate-200 bg-white p-8">
            <h1 className="text-2xl font-bold text-slate-900">Home</h1>
            <p className="mt-2 text-sm text-slate-600">Authenticated: {isAuthenticated() ? 'Yes' : 'No'}</p>
            <nav className="mt-6 flex gap-4 text-sm">
                <Link className="text-blue-600" to="/dashboard">
                    Dashboard
                </Link>
                <Link className="text-blue-600" to="/admin">
                    Admin
                </Link>
                <Link className="text-blue-600" to="/login">
                    Login
                </Link>
            </nav>
            <button onClick={handleLogout} className="mt-6 rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700">
                Logout
            </button>
        </main>
    );
}

export default function RbacRouterDemo() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/not-authorized" element={<NotAuthorizedPage />} />

                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Route>

                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminDashboardPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
