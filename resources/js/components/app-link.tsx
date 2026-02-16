import { router } from '@inertiajs/react';
import type { AnchorHTMLAttributes, MouseEvent, PropsWithChildren } from 'react';
import { Link as RouterLink } from 'react-router-dom';

type Props = PropsWithChildren<
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
        href: string;
    }
>;

export default function AppLink({ href, onClick, children, ...props }: Props) {
    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);

        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        event.preventDefault();
        router.visit(href);
    };

    return (
        <RouterLink to={href} onClick={handleClick} {...props}>
            {children}
        </RouterLink>
    );
}
