import type { AnchorHTMLAttributes, PropsWithChildren } from 'react';

type BrowserRouterProps = PropsWithChildren;

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    to: string;
};

export function BrowserRouter({ children }: BrowserRouterProps) {
    return <>{children}</>;
}

export function Link({ to, ...props }: LinkProps) {
    return <a href={to} {...props} />;
}
