import { Navigate, Outlet } from 'react-router-dom';
import { getStoredRole, isAuthenticated } from '@/lib/role-auth';

type AdminRouteProps = {
    loginRedirectTo?: string;
    unauthorizedRedirectTo?: string;
};

export default function AdminRoute({
    loginRedirectTo = '/login',
    unauthorizedRedirectTo = '/not-authorized',
}: AdminRouteProps) {
    if (!isAuthenticated()) {
        return <Navigate to={loginRedirectTo} replace />;
    }

    return getStoredRole() === 'admin' ? <Outlet /> : <Navigate to={unauthorizedRedirectTo} replace />;
}
