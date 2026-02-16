import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '@/lib/role-auth';

type PrivateRouteProps = {
    redirectTo?: string;
};

export default function PrivateRoute({ redirectTo = '/login' }: PrivateRouteProps) {
    return isAuthenticated() ? <Outlet /> : <Navigate to={redirectTo} replace />;
}
