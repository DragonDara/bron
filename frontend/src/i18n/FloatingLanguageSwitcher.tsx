import { useLocation } from 'react-router-dom';
import { LanguageSwitcher } from './LanguageSwitcher';

const FLOATING_LANGUAGE_ROUTES = ['/', '/setup-wizard', '/pos/order'] as const;

function isHeaderlessRoute(pathname: string) {
  return (
    pathname === '/' ||
    FLOATING_LANGUAGE_ROUTES.some(
      (base) => base !== '/' && (pathname === base || pathname.startsWith(`${base}/`)),
    )
  );
}

export function FloatingLanguageSwitcher() {
  const { pathname } = useLocation();
  if (!isHeaderlessRoute(pathname)) return null;
  return <LanguageSwitcher />;
}