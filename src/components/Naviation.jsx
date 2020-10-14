import React, { useRef, forwardRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu } from './Icons';

const links = ['', 'blog'];

const NavLinks = forwardRef(({ className }, ref) => (
  <ul ref={ref} className={className}>
    {links.map((link) => (
      <li className={`md:rounded-lg${ref && ' px-2 py-3'}`} key={link}>
        <NavLink
          exact={!link}
          to={`/${link}`}
          activeClassName="opacity-100"
          className="p-2 text-gray-800 opacity-50"
          onClick={() => {
            if (ref) ref.current.classList.add('hidden');
          }}
        >
          {link || 'portfolio'}
        </NavLink>
      </li>
    ))}
  </ul>
));

const Navigation = () => {
  const ref = useRef(null);
  const toggle = () => {
    if (ref.current) ref.current.classList.toggle('hidden');
  };
  return (
    <div className="max-w-3xl mx-auto p-5">
      <nav className="flex-row md:justify-between">
        <div className="flex flex-row justify-between items-center">
          <Link to="/" className="text-2xl text-black font-black">
            georgelioris
          </Link>
          <NavLinks className="hidden md:flex md:flex-row justify-between w-1/5 md:rounded-lg text-base font-bold" />
          <span
            role="button"
            tabIndex="0"
            onKeyDown={toggle}
            className="menu-btn"
            onClick={toggle}
          >
            <Menu />
          </span>
        </div>
        <NavLinks
          ref={ref}
          className="nav-hidden divide-y divide-purple-200 round-sm hidden md:hidden"
        />
      </nav>
    </div>
  );
};

export default Navigation;
