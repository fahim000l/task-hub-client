import { AUTH_CONTEXT, TauthInfo } from "@/contexts/AuthProviders";
import Link from "next/link";
import React, { useContext } from "react";

const Header = () => {
  const { authUser } = useContext<TauthInfo | undefined>(AUTH_CONTEXT) || {};

  return (
    <div className="navbar bg-[steelblue] sticky top-0 z-50 h-[10vh]">
      <div className="navbar-start">
        <label htmlFor="mainDrawer" className="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </label>
        <a className="btn btn-ghost normal-case text-xl">daisyUI</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Item 1</a>
          </li>
          <li tabIndex={0}>
            <details>
              <summary>Parent</summary>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <a>Item 3</a>
          </li>
        </ul>
      </div>
      {authUser?.email ? (
        <div className="avatar navbar-end">
          <div className="w-10 rounded-full">
            <img src={authUser.profilePic || "/noPP.png"} />
          </div>
        </div>
      ) : (
        <Link href={"/signin"} className="navbar-end">
          <button className="btn btn-sm">Sign In / Sign Up</button>
        </Link>
      )}
    </div>
  );
};

export default Header;
