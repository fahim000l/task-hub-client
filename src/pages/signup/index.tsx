import { AUTH_CONTEXT } from "@/contexts/AuthProviders";
import useBase64 from "@/hooks/useBase64";
import Auth from "@/layout/Auth";
import { useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useEffect, useState, useContext } from "react";
import { FaUser } from "react-icons/fa";

export interface TUser {
  userName: string;
  email: string;
  password: string;
  profilePic: string;
  cPassword: string;
}

const index = () => {
  const { signUp } = useContext(AUTH_CONTEXT) || {};

  const fileUploader = useRef<HTMLInputElement | null>(null);
  const [uploadingFile, setUploadingFile] = useState<File | undefined>(
    undefined
  );
  const { convertedImage } = useBase64(uploadingFile);
  const { push } = useRouter();

  const Formik = useFormik<TUser>({
    initialValues: {
      userName: "",
      email: "",
      password: "",
      cPassword: "",
      profilePic: "",
    },
    validate: (values) => {
      let errors = {
        userName: "",
        email: "",
        password: "",
        cPassword: "",
        profilePic: "",
      };

      if (!values.email) {
        errors.email = "Email is required";
      }

      if (!values.userName) {
        errors.userName = "User Name is required";
      }

      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 8) {
        errors.password = "Password must contain at least 8 characters";
      }

      if (!values.cPassword) {
        errors.password = "Password is required";
      } else if (values.password.length < 8) {
        errors.password = "Password must contain at least 8 characters";
      }

      if (values.password !== values.cPassword) {
        errors.password = "Password did not matched";
        errors.cPassword = "Password did not matched";
      }

      if (
        errors.email ||
        errors.cPassword ||
        errors.password ||
        errors.profilePic ||
        errors.userName
      ) {
        return errors;
      }
    },
    onSubmit: (values) => {
      console.log(values);
      signUp?.(values)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.success) {
            Formik.resetForm();
            push("/");
          }
        });
    },
  });

  useEffect(() => {
    if (convertedImage) {
      Formik.setFieldValue("profilePic", convertedImage);
    }
  }, [convertedImage]);

  return (
    <Auth>
      <div className="p-5">
        <form onSubmit={Formik.handleSubmit}>
          <div className="flex flex-col space-y-2 items-center">
            <div className="lg:w-[50%] text-center">
              <div className="avatar flex flex-col">
                <div className="w-24 rounded-full">
                  {/* <FaUser /> */}
                  <Image
                    fill
                    alt="noPP"
                    src={Formik.values.profilePic || "/noPP.png"}
                  />
                </div>
              </div>
              <input
                onChange={(e) => setUploadingFile(e?.target?.files?.[0])}
                ref={fileUploader}
                className="hidden"
                type="file"
              />
              <button
                onClick={() => fileUploader.current?.click()}
                type="button"
                className="btn btn-sm text-[blue] font-bold text-center text-sm normal-case"
              >
                Upload Profile Picture
              </button>
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="userName" className="font-semibold">
                User Name
              </label>
              <input
                {...Formik.getFieldProps("userName")}
                className={`input input-bordered input-sm w-full ${
                  Formik.errors.userName && "border-[red]"
                }`}
              />
              <p className="text-[red] font-bold text-sm">
                {Formik.errors.userName}
              </p>
            </div>
            <div className="flex flex-col w-full">
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
            <div className="flex flex-col w-full">
              <label htmlFor="password" className="font-semibold">
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
            <div className="flex flex-col w-full">
              <label htmlFor="cPassword" className="font-semibold">
                Confirm Password
              </label>
              <input
                {...Formik.getFieldProps("cPassword")}
                className={`input input-bordered input-sm w-full ${
                  Formik.errors.cPassword && "border-[red]"
                }`}
              />
              <p className="text-[red] font-bold text-sm">
                {Formik.errors.cPassword}
              </p>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-sm text-white bg-[steelblue] mt-2"
          >
            Create Accpunt
          </button>
        </form>
        <Link href={"/signin"}>
          <button className="btn btn-sm btn-link mt-2 font-bold normal-case">
            Already have an account ?
          </button>
        </Link>
      </div>
    </Auth>
  );
};

export default index;
