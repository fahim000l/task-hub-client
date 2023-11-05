import { AUTH_CONTEXT } from "@/contexts/AuthProviders";
import Main from "@/layout/Main";
import { FormikProps, FormikValues, useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import Swal from "sweetalert2";
import { TUser } from "../signup";
import { Ttm } from "../my-teams";

export interface Tteam {
  _id?: string;
  teamName?: string;
  subject?: string;
  details?: string;
  leader?: string;
  leaderInfo?: TUser[];
  memberInfo?: Ttm[];
}

const index = () => {
  const { authUser } = useContext(AUTH_CONTEXT) || {};

  const Formik: FormikProps<Tteam> = useFormik<Tteam>({
    initialValues: {
      teamName: "",
      subject: "",
      details: "",
      leader: "",
    },
    validate: (values) => {
      interface errorType {
        teamName?: string;
        subject?: string;
      }

      const errors: errorType = {
        subject: "",
        teamName: "",
      };

      if (!values.subject) {
        errors.subject = "Subject is required";
      }

      if (!values.teamName) {
        errors.teamName = "Team Name is required";
      }

      if (errors.subject || errors.teamName) {
        return errors;
      }
    },
    onSubmit: (values) => {
      console.log(values);

      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}store-team`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data?.success) {
            Formik.resetForm();
            Swal.fire("Team created successfully!", "", "success");
          }
        });
    },
  });
  useEffect(() => {
    if (authUser?.email) {
      Formik.setFieldValue("leader", authUser?.email);
    }
  }, [authUser]);

  return (
    <Main>
      <div>
        <form
          onSubmit={Formik.handleSubmit}
          className="bg-[lightblue] lg:rounded-lg h-screen lg:h-auto p-5 lg:m-[18px]"
        >
          <div className="flex flex-col my-2">
            <label
              className={`font-bold ${Formik.errors.teamName && "text-[red]"}`}
              htmlFor=""
            >
              {Formik.errors.teamName || "Team Name"}
            </label>
            <input
              {...Formik.getFieldProps("teamName")}
              type="text"
              className={`input input-bordered input-sm my-2 ${
                Formik.errors.teamName && "border-[red]"
              }`}
            />
          </div>
          <div className="flex flex-col my-2">
            <label
              className={`font-bold ${Formik.errors.subject && "text-[red]"}`}
              htmlFor=""
            >
              {Formik.errors.subject || "Subject"}
            </label>
            <input
              {...Formik.getFieldProps("subject")}
              type="text"
              className={`input input-bordered input-sm my-2 ${
                Formik.errors.subject && "border-[red]"
              }`}
            />
          </div>
          <div className="flex flex-col my-2">
            <label className="font-bold" htmlFor="">
              Details
            </label>
            <textarea
              {...Formik.getFieldProps("details")}
              className="textarea textarea-bordered my-2"
            />
          </div>
          <button type="submit" className="btn btn-sm btn-success normal-case">
            Submit
          </button>
        </form>
      </div>
    </Main>
  );
};

export default index;
