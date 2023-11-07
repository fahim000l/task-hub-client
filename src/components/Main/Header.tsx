import { AUTH_CONTEXT, TauthInfo } from "@/contexts/AuthProviders";
import Link from "next/link";
import React, { useContext } from "react";
import { ComputerOutlined } from "@mui/icons-material";

const Header = () => {
  const { authUser } = useContext<TauthInfo | undefined>(AUTH_CONTEXT) || {};

  return (
    <div className="navbar bg-[steelblue] sticky top-0 z-50 h-[10vh]">
      <div className="navbar-start w-full">
        <label htmlFor="mainDrawer" className="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
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
        <Link
          href={"/"}
          className="normal-case text-xl text-white flex items-start space-x-2 w-full"
        >
          <ComputerOutlined className="text-5xl" />{" "}
          <div>
            <p>Task Hub</p>
            <p className="text-xs">Your Schedule Manager</p>
          </div>
        </Link>
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
