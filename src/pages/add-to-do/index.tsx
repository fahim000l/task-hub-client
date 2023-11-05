import Main from "@/layout/Main";
import React, { useState, useEffect, ChangeEvent, useContext } from "react";
import { format } from "date-fns";
import { DayPicker, SelectSingleEventHandler } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "react-time-picker/dist/TimePicker.css";
import { FormikProps, useFormik } from "formik";
import { AUTH_CONTEXT } from "@/contexts/AuthProviders";
import toast from "react-hot-toast/headless";
import Swal from "sweetalert2";

export interface TtoDo {
  _id?: string;
  deadline: {
    day?: Date | string | undefined;
    time?: string | undefined;
    meridiem?: "AM" | "PM";
  };
  subject: string;
  user?: string;
  work: string;
  details: string;
  status: "assigned" | "done" | "pending";
}

const index = () => {
  const { authUser } = useContext(AUTH_CONTEXT) || {};
  const [selected, setSelected] = useState<Date | string | null>(null);
  const [meridiem, setMeridiem] = useState<"AM" | "PM">("AM");
  const [time, setTime] = useState<string | undefined>(
    `${new Date().getHours()}:${new Date().getMinutes()}`
  );

  const Formik: FormikProps<TtoDo> = useFormik<TtoDo>({
    initialValues: {
      deadline: {
        day: new Date(),
        time: `${new Date().getHours()}:${new Date().getMinutes()}`,
      },
      subject: "",
      status: "assigned",
      details: "",
      user: "",
      work: "",
    },
    validate: (values) => {
      interface errorType {
        deadline?: string;
        subject?: string;
        work?: string;
      }

      let error: errorType | null = null;

      if (new Date(selected as string) <= new Date()) {
        error = {
          deadline: "Deadline must have to be in future time",
        };
      }
      if (!values.deadline) {
        error = {
          ...error,
          deadline: "Deadline is required",
        };
      }
      if (!values.subject) {
        error = {
          ...error,
          subject: "Subject is required",
        };
      }
      if (!values.work) {
        error = { ...error, work: "Work is required" };
      }
      if (error) {
        return error;
      }
    },
    onSubmit: (values) => {
      values["deadline"] = {
        ...values["deadline"],
        day: selected as Date,
        time: time,
        meridiem: meridiem,
      };
      values["user"] = authUser?.email;
      console.log(values);

      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}store-todo`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log(data);
            Formik.resetForm();
            toast.success("Todo added successfully");
            Swal.fire("Todo added successfully!", "", "success");
          }
        });
    },
  });

  let footer = (
    <p>
      Please pick a deadline. {time} {meridiem}
    </p>
  );
  if (selected) {
    footer = (
      <p>
        Yor deadline is {format(selected as Date, "PP")}. {time} {meridiem}
      </p>
    );
  }

  useEffect(() => {
    if (time) {
      if (parseInt(time.split(":")[0]) > 12) {
        setTime(
          `${parseInt(time.split(":")[0] as string) - 12}` +
            ":" +
            time.split(":")[1]
        );
        setMeridiem("PM");
      }

      if (parseInt(time.split(":")[0]) === 0) {
        setTime(`12` + ":" + time.split(":")[1]);
        setMeridiem("AM");
      }
    }
  }, [time]);

  return (
    <Main>
      <div className="flex lg:flex-row flex-col-reverse lg:items-start w-full overflow-y-hidden">
        <DayPicker
          className="bg-[lightblue] p-5 rounded-lg m-0"
          mode="single"
          selected={selected as Date}
          onSelect={setSelected as SelectSingleEventHandler}
          footer={
            <div>
              <input
                className="input input-bordered input-sm w-full"
                type="time"
                name=""
                id=""
                defaultValue={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  if (parseInt(e.target.value.split(":")[0]) < 12) {
                    setMeridiem("AM");
                  }
                  if (parseInt(e.target.value.split(":")[0]) === 12) {
                    setMeridiem("PM");
                  }
                  console.log(e.target.value);
                }}
              />
              {
                <div>
                  {footer}
                  {Formik.errors.deadline && (
                    <p className="text-[red] font-bold">{`${Formik.errors.deadline}`}</p>
                  )}
                </div>
              }
            </div>
          }
        />
        <form
          onSubmit={Formik.handleSubmit}
          className="bg-[lightblue] rounded-lg lg:w-full p-5 lg:m-[18px]"
        >
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
            <label
              className={`font-bold ${Formik.errors.work && "text-[red]"}`}
              htmlFor=""
            >
              {Formik.errors.work || "Work"}
            </label>
            <input
              {...Formik.getFieldProps("work")}
              type="text"
              className={`input input-bordered input-sm my-2 ${
                Formik.errors.work && "border-[red]"
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
          <div className="flex justify-between">
            {footer}{" "}
            <button className="btn btn-sm btn-success normal-case">
              Submit
            </button>{" "}
          </div>
        </form>
      </div>
    </Main>
  );
};

export default index;
