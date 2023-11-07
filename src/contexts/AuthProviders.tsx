import { TAssigned } from "@/components/Main/my-teams/tasks/AddTasksDrawer";
import { TtoDo } from "@/pages/add-to-do";
import { Ttm } from "@/pages/my-teams";
import { TUser } from "@/pages/signup";
import {
  QueryObserverResult,
  RefetchOptions,
  useQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { createContext, useEffect, useState } from "react";

interface params {
  children: React.ReactNode;
}

export interface TauthUser {
  userName: string;
  email: string;
  password: string;
  profilePic: string;
  memberships: Ttm[];
  todos: TtoDo[];
  assignings: TAssigned[];
}

export interface TauthInfo {
  logIn: (values: { email: string; password: string }) => Promise<Response>;
  signUp: (values: TUser) => Promise<Response>;
  authUser: TauthUser;
  googleSignIn: () => void;
  logOut: () => void;
  authUserRefetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<any, Error>>;
  authUserLoader: boolean;
}
export const AUTH_CONTEXT = createContext<TauthInfo | undefined>(undefined);

const AuthProviders = ({ children }: params) => {
  const { push } = useRouter();
  const [authLoader, setAuthLoader] = useState(false);

  const googleSignIn = () => {
    setAuthLoader(true);
    location.href = `${process.env.NEXT_PUBLIC_SERVER_URL}auth-google`;
  };

  const logIn = (values: { email: string; password: string }) => {
    setAuthLoader(true);
    return fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}sign-in`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(values),
      credentials: "include",
    });
  };

  const logOut = () => {
    setAuthLoader(true);
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}log-out`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data?.success) {
          push("/signin");
        }
      });
  };

  const signUp = (values: TUser) => {
    setAuthLoader(true);
    return fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}sign-up`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userName: values.userName,
        email: values.email,
        password: values.password,
        profilePic: values.profilePic,
      }),
      credentials: "include",
    });
  };

  const {
    data: { [0]: authUser } = {},
    refetch: authUserRefetch,
    isLoading: authUserLoader,
  } = useQuery({
    queryKey: [authLoader],
    queryFn: async () => {
      setAuthLoader(false);
      return await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}get-session-user`,
        {
          credentials: "include",
        }
      ).then((res) => res.json());
    },
  });

  const authInfo: TauthInfo = {
    logIn,
    signUp,
    googleSignIn,
    logOut,
    authUserRefetch,
    authUser,
    authUserLoader,
  };

  return (
    <AUTH_CONTEXT.Provider value={authInfo}>{children}</AUTH_CONTEXT.Provider>
  );
};

export default AuthProviders;
