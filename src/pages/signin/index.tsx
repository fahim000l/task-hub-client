import { AUTH_CONTEXT, TauthInfo } from "@/contexts/AuthProviders";
import Auth from "@/layout/Auth";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { FaGoogle } from "react-icons/fa";

const index = () => {
  const { replace } = useRouter();
  const { logIn, googleSignIn } =
    useContext<TauthInfo | undefined>(AUTH_CONTEXT) || {};

  const Formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate(values) {
      let error = {
        email: "",
        password: "",
      };

      if (!values.email) {
        error.email = "Email is required";
      }

      if (!values.password) {
        error.password = "Passwod is required";
      }

      if (error.email || error.password) {
        return error;
      }
    },
    onSubmit: async (values) => {
      logIn?.(values)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data?.success) {
            location.replace("/");
          }
        });
    },
  });

  const handleGoogleSignIn = () => {
    googleSignIn?.();
  };

  return (
    <Auth>
      {" "}
      <div className="p-5">
        <form onSubmit={Formik.handleSubmit}>
          <div className="flex flex-col space-y-5">
            <div className="flex flex-col">
              <label htmlFor="email" className="font-semibold">
                Email
              </label>
              <input
                {...Formik.getFieldProps("email")}
                className={`input input-bordered input-sm w-full ${
                  Formik.errors.email && "border-[red]"
                }`}
              />
              <p className="text-[red] font-bold text-sm">
                {Formik.errors.email}
              </p>
            </div>
            <div className="w-full flex flex-col">
              <div className="flex flex-col">
                <label htmlFor="email" className="font-semibold">
                  Password
                </label>
                <input
                  {...Formik.getFieldProps("password")}
                  className={`input input-bordered input-sm w-full ${
                    Formik.errors.password && "border-[red]"
                  }`}
                />
                <p className="text-[red] font-bold text-sm">
                  {Formik.errors.password}
                </p>
              </div>
              <button className="text-start text-[blue] underline text-sm mt-2 font-bold normal-case">
                Forgot Password ?
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-sm w-full text-white bg-[steelblue]"
          >
            Log In
          </button>
        </form>
        <div className="divider">OR</div>
        <div>
          <button
            onClick={handleGoogleSignIn}
            className="btn btn-sm btn-outline w-full text-[steelblue]"
          >
            <FaGoogle />
            Sign In with Google
          </button>
        </div>
        <Link href={"/signup"}>
          <button className="btn btn-link btn-sm mt-2 font-bold normal-case">
            Doesn't have an account ?
          </button>
        </Link>
      </div>
    </Auth>
  );
};

export default index;
