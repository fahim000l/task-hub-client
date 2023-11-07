import React, { useState, useEffect, useRef } from "react";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import { Tteam } from "@/pages/create-team";
import { CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material";
import { Ttm } from "@/pages/my-teams";
import { format } from "date-fns";
import useBase64 from "@/hooks/useBase64";
import { useFormik } from "formik";
import { log } from "console";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { TUser } from "@/pages/signup";
import { Tsubmission } from "./taskId/AddSubmissionDrawer";
import useGetTeamById from "@/hooks/useGetTeamById";

interface props {
  team: Tteam;
}

export interface Ttask {
  _id?: string;
  teamId: string;
  taskName: string;
  work: string;
  assign: "all" | "specific";
  priority: number;
  deadline: {
    day: Date | string;
    time: string;
    meridiem: "AM" | "PM";
  };
  details?: string;
  attachments?: TAt[] | never[];
  assignings?: TAssigned[] | never[];
  submissions?: Tsubmission[] | never[];
  teamInfo?: Tteam[];
}

export interface TAt {
  _id?: string;
  parentId: string;
  file: string;
}

export interface TAssigned {
  _id?: string;
  taskId?: string;
  user: string;
  assignedTo?: TUser[];
  taskInfo?: Ttask[];
}

const AddTasksDrawer = ({ team }: props) => {
  const [meridiem, setMeridiem] = useState<"AM" | "PM">("AM");
  const [time, setTime] = useState<string | undefined>(
    `${new Date().getHours()}:${new Date().getMinutes()}`
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { convertedImage } = useBase64(selectedFile as File);
  const fileUploader = useRef<HTMLInputElement | null>(null);
  const {
    query: { teamId },
  } = useRouter();

  const { teamRefetch } = useGetTeamById(teamId as string);

  const Formik = useFormik<Ttask>({
    initialValues: {
      teamId: "",
      taskName: "",
      assign: "all",
      deadline: {
        day: new Date(),
        time: `${new Date().getHours()}:${new Date().getMinutes()}`,
        meridiem: "AM",
      },
      attachments: [],
      priority: 5,
      work: "",
      assignings: [],
      details: "",
    },
    validate: (values) => {
      const error = {
        taskName: "",
        work: "",
        deadline: "",
        assignings: "",
      };

      if (!values?.taskName) {
        error.taskName = "Task Name is required";
      }

      if (!values?.work) {
        error.work = "Work is required";
      }

      if (new Date(values.deadline.day as string) <= new Date()) {
        error.deadline = "Deadline must have to be in future time";
      }

      if (values.assign === "specific" && values.assignings?.length === 0) {
        error.assignings = "You haven't choosed any member to assign";
      }

      if (error.deadline || error.taskName || error.work || error.assignings) {
        return error;
      }
    },
    onSubmit: (values) => {
      values.deadline.time = time as string;
      values.deadline.meridiem = meridiem;
      values.teamId = teamId as string;

      let assignings: TAssigned[] = [];
      let attachments: TAt[] = [];

      values.assignings?.forEach((to) => {
        assignings.push({ user: to.user, taskId: "" });
      });
      values.attachments?.forEach((to) => {
        attachments.push({ file: to.file, parentId: to.parentId });
      });

      delete values?.assignings;
      delete values.attachments;
      console.log({ values, assignings, attachments });

      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}store-task`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          task: values,
          assignings: assignings,
          attachments: attachments,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data?.success) {
            Formik.resetForm();
            teamRefetch();
            Swal.fire("New task added!", "", "success");
          }
        });
    },
  });

  useEffect(() => {
    if (convertedImage) {
      Formik.setFieldValue("attachments", [
        ...(Formik.values.attachments as TAt[]),
        { file: convertedImage },
      ]);
    }
  }, [convertedImage]);

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
    <div className="drawer drawer-end">
      <input id="addTaskDrawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side z-[900] min-h-screen overflow-scroll">
        <label
          htmlFor="addTaskDrawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="w-[90%] bg-[lightblue] min-h-screen text-base-content">
          <form
            onSubmit={Formik.handleSubmit}
            className="lg:w-full lg:p-5 p-2 min-h-screen"
          >
            <div className="flex flex-col my-2">
              <label
                className={`font-bold ${
                  Formik.errors.taskName && "text-[red]"
                }`}
                htmlFor=""
              >
                {Formik.errors.taskName || "Task Name"}
              </label>
              <input
                {...Formik.getFieldProps("taskName")}
                type="text"
                className={`input input-bordered input-sm my-2 ${
                  Formik.errors.taskName && "border-[red]"
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
              <div className="flex items-center space-x-2">
                <label className={`font-bold`} htmlFor="">
                  {"Assiging to"}
                </label>
                <select
                  {...Formik.getFieldProps("assign")}
                  onChange={(e) =>
                    Formik.setFieldValue("assign", e.target.value)
                  }
                  value={Formik.values.assign}
                  className="select select-bordered select-xs"
                >
                  <option value="all">All members</option>
                  <option value="specific">Specific</option>
                </select>
              </div>
              {Formik.values.assign === "specific" && (
                <Autocomplete
                  fullWidth
                  size="small"
                  className="bg-white rounded-lg my-2"
                  multiple
                  onChange={(event, newValue) =>
                    Formik.setFieldValue("assignings", [...newValue])
                  }
                  id="checkboxes-tags-demo"
                  options={team?.members as Ttm[]}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option?.memberInfo?.[0]?.userName}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={<CheckBoxOutlineBlank />}
                        checkedIcon={<CheckBox />}
                        style={{ marginRight: 2 }}
                        checked={selected}
                      />
                      <div className="flex space-x-1 items-center">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img
                              src={
                                option?.memberInfo?.[0]?.profilePic ||
                                "/noPP.png"
                              }
                            />
                          </div>
                        </div>
                        <p className="font-bold">
                          {option?.memberInfo?.[0]?.userName}
                        </p>
                      </div>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      error={Formik.errors.assignings !== "" && true}
                      helperText={Formik.errors.assignings}
                      {...params}
                      placeholder="Search members"
                    />
                  )}
                />
              )}
            </div>
            <div className="flex flex-col my-2">
              <label className="font-bold" htmlFor="">
                Attachments
              </label>
              <input
                onChange={(e) => setSelectedFile(e?.target?.files?.[0] as File)}
                type="file"
                className="hidden"
                ref={fileUploader}
              />
              <button
                onClick={() => fileUploader.current?.click()}
                type="button"
                className="btn btn-sm btn-info normal-case"
              >
                Attach File
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Formik.values.attachments?.map((file, i) => (
                <a key={i} href={file.file} className="btn btn-sm btn-neutral">
                  file_{i + 1}
                </a>
              ))}
            </div>
            <div className="flex flex-col my-2">
              <label className="font-bold" htmlFor="">
                Priority ({Formik.values.priority}%)
              </label>
              <input
                type="range"
                min={1}
                max="100"
                {...Formik.getFieldProps("priority")}
                className="range"
                step="1"
              />
            </div>
            <div className="flex flex-col my-2">
              <label
                className={`font-bold ${
                  Formik.errors.deadline && "text-[red]"
                }`}
                htmlFor=""
              >
                {(Formik.errors.deadline as string) || "Deadline"}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  onChange={(e) =>
                    Formik.setFieldValue("deadline", {
                      ...Formik.values.deadline,
                      day: new Date(e.target.value),
                    })
                  }
                  placeholder="dd/mm/yyyy"
                  className={`input input-bordered input-sm ${
                    Formik.errors.deadline && "border-[red]"
                  }`}
                />
                <input
                  type="time"
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
                  className="input input-bordered input-sm"
                />
              </div>
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
            <button
              type="submit"
              className="btn btn-sm btn-success normal-case"
            >
              Submit
            </button>{" "}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTasksDrawer;
