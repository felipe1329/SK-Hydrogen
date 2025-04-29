import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from '@remix-run/react';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';

export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <NavLink prefetch="intent" to="/" className="text-2xl font-bold text-black" end>
          {shop.name}
        </NavLink>
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}) {
  const {close} = useAside();

  const menuItems = (menu || FALLBACK_HEADER_MENU).items;

  return (
    <nav className="hidden md:flex space-x-6 relative">
      {menuItems.map((item) => {
        if (!item.url) return null;

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;

        const hasChildren = item.items && item.items.length > 0;

        return (
          <div key={item.id} className="relative group">
            <NavLink
              end
              prefetch="intent"
              to={url}
              className="text-gray-700 hover:text-black font-medium transition"
              onClick={close}
            >
              {item.title}
            </NavLink>
            
            {hasChildren && (
              <div className="absolute left-0 top-full bg-white shadow-lg p-4 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto min-w-[200px]">
                <div className="flex flex-col space-y-2">
                  {item.items.map((subItem) => (
                    <NavLink
                      key={subItem.id}
                      to={
                        subItem.url.includes('myshopify.com') ||
                        subItem.url.includes(publicStoreDomain) ||
                        subItem.url.includes(primaryDomainUrl)
                          ? new URL(subItem.url).pathname
                          : subItem.url
                      }
                      className="text-gray-600 hover:text-black transition"
                      onClick={close}
                    >
                      {subItem.title}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function HeaderCtas({isLoggedIn, cart}) {
  return (
    <div className="flex items-center space-x-4">
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account" className="text-gray-700 hover:text-black">
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </div>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="text-2xl text-gray-700 md:hidden"
      onClick={() => open('mobile')}
    >
      ☰
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="text-gray-700 hover:text-black" onClick={() => open('search')}>
      Search
    </button>
  );
}

function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      className="relative text-gray-700 hover:text-black"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
    >
      Cart
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
          {count}
        </span>
      )}
    </a>
  );
}

function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/247861313571',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};
