import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * ScrollToTop — handles seamless scroll positioning on navigation:
 * - Hash navigations scroll to the target element.
 * - Back/forward (POP) navigation preserves browser scroll.
 * - Route transitions (PUSH/REPLACE) instantly reset scroll to (0, 0).
 * - On /shop, preserves scroll position if only filters/sort changed (page unchanged).
 */
export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const prevPathRef = useRef(location.pathname);
  const prevSearchRef = useRef(location.search);

  useLayoutEffect(() => {
    // 1. If hash exists, scroll to element
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        prevPathRef.current = location.pathname;
        prevSearchRef.current = location.search;
        return;
      }
    }

    // 2. If back/forward navigation (POP), allow browser scroll restoration
    if (navigationType === 'POP') {
      prevPathRef.current = location.pathname;
      prevSearchRef.current = location.search;
      return;
    }

    // 3. For /shop page: if pathname is same and only filter/sort changed (page didn't change), don't jump to top
    if (location.pathname === '/shop' && prevPathRef.current === '/shop') {
      const prevParams = new URLSearchParams(prevSearchRef.current);
      const currParams = new URLSearchParams(location.search);
      const prevPage = prevParams.get('page') || '1';
      const currPage = currParams.get('page') || '1';

      if (prevPage === currPage) {
        prevPathRef.current = location.pathname;
        prevSearchRef.current = location.search;
        return;
      }
    }

    // 4. Default: reset scroll to top-left instantly on navigation
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    prevPathRef.current = location.pathname;
    prevSearchRef.current = location.search;
  }, [location.pathname, location.search, location.hash, navigationType]);

  return null;
}
