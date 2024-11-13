import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import UserMenu from './user/UserMenu';
import { TiShoppingCart } from "react-icons/ti";
export default function Header() {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <nav className="bg-blue border-gray-200 dark:bg-gray-900 border-b-2 border-solid">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="https://www.reshot.com/preview-assets/icons/QZY7FE92BM/shopping-cart-QZY7FE92BM.svg" className="h-8" alt="InsightCart Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">InsightCart</span>
        </Link>

        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
          <ul className="items-center flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a href="/" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a>
            </li>
            <li>
              <a href="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Pricing</a>
            </li>
            <li>
              <a href="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
            </li>
            <li>
              <div className="flex rounded-md border-2 border-blue-500 overflow-hidden max-w-md mx-auto font-[sans-serif]">
                <input type="email" placeholder="What are you looking for..."
                  className="w-full outline-none bg-white text-gray-600 text-sm px-4 py-3" />
                <button type='button' className="flex items-center justify-center bg-[#007bff] px-5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px" className="fill-white">
                    <path
                      d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                    </path>
                  </svg>
                </button>
              </div>
            </li>
            <li>
              <TiShoppingCart size={25} />
            </li>
            <li>
              {isAuthenticated ? <UserMenu /> : <Link to="/auth/sign-in" style={{ textDecoration: 'none', color: 'inherit' }}>Sign In</Link>}
            </li>
          </ul>
        </div>
      </div>
    </nav>

  );
}
