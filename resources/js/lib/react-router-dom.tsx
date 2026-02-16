import type { AnchorHTMLAttributes, FormEventHandler, PropsWithChildren, ReactNode } from 'react';

type BrowserRouterProps = PropsWithChildren;

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    to: string;
};

type NavigateProps = {
    to: string;
    replace?: boolean;
};

type RouteProps = PropsWithChildren<{
    path?: string;
    element?: ReactNode;
}>;

type UseNavigate = (to: string, options?: { replace?: boolean }) => void;

export function BrowserRouter({ children }: BrowserRouterProps) {
    return <>{children}</>;
}

export function Link({ to, ...props }: LinkProps) {
    return <a href={to} {...props} />;
}

export function Navigate({ to }: NavigateProps) {
    return <a href={to} />;
}

export function Outlet() {
    return null;
}

export function Routes({ children }: PropsWithChildren) {
    return <>{children}</>;
}

export function Route({ element, children }: RouteProps) {
    return <>{children ?? element ?? null}</>;
}

export function useNavigate(): UseNavigate {
    return (to: string) => {
        window.location.href = to;
    };
}

export type { FormEventHandler };
