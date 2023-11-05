import Header from "@/components/Main/Header";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface props {
  children: React.ReactNode;
}

const Auth = ({ children }: props) => {
  const { pathname } = useRouter();

  return (
    <div className="lg:overflow-y-hidden lg:h-screen">
      <div className="navbar bg-[steelblue]">
        <a className="btn btn-ghost normal-case text-xl text-white font-bold">
          Fun Book
        </a>
      </div>
      <div className="hero lg:py-10 px-0 pt-5">
        <div
          className={`hero-content flex-col w-full p-0 ${
            pathname === "/signin" ? "lg:flex-row-reverse" : "lg:flex-row"
          }`}
        >
          <div className="text-center flex flex-col items-center justify-center lg:w-[50%] lg:h-screen">
            <h1 className="lg:text-5xl text-xl font-bold">
              {pathname === "/signin"
                ? "LogIn to Your Account!"
                : "Create Your Account"}
            </h1>
            <div className="py-6 w-full">
              {pathname === "/signin" ? (
                <div>
                  <p>If you are new here </p> <br />
                  <Link href={"/signup"}>
                    {" "}
                    <button className="btn btn-sm text-white bg-[steelblue]">
                      Plaease Create Acoount
                    </button>
                  </Link>
                </div>
              ) : (
                <div>
                  <p>If You already have an account </p> <br />
                  <Link href={"/signin"}>
                    <button className="btn btn-sm text-white bg-[steelblue]">
                      Plse Log In
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="lg:card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 shadow-blue-800 lg:w-[50%] lg:h-screen">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
