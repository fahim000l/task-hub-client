import React, { useContext, useRef, useState, useEffect } from "react";
import { TAt, Ttask } from "../AddTasksDrawer";
import { AUTH_CONTEXT } from "@/contexts/AuthProviders";
import { useFormik } from "formik";
import useBase64 from "@/hooks/useBase64";
import Swal from "sweetalert2";
import { TUser } from "@/pages/signup";
import useGetTaskById from "@/hooks/useGetTaskById";

interface props {
  task: Ttask;
}

export interface Tsubmission {
  _id?: string;
  taskId: string;
  user: string;
  details?: string;
  attachments?: TAt[];
  submittedBy?: TUser[];
}

const AddSubmissionDrawer = ({ task }: props) => {
  const fileUploader = useRef<HTMLInputElement | null>(null);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const { convertedImage } = useBase64(uploadingFile as File);
  const { taskRefetch } = useGetTaskById(task?._id);

  const { authUser } = useContext(AUTH_CONTEXT) || {};

  const Formik = useFormik<Tsubmission>({
    initialValues: {
      taskId: task._id as string,
      user: authUser?.email as string,
      attachments: [],
      details: "",
    },
    onSubmit: (values) => {
      const attachments = values.attachments;
      delete values.attachments;

      console.log({ submission: values, attachments });

      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}store-submission`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ submission: values, attachments }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data?.success) {
            Formik.resetForm();
            taskRefetch();
            Swal.fire("Submitted Successfullt", "", "success");
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

  return (
    <div className="drawer drawer-end">
      <input
        id="addSubmissionDrawer"
        type="checkbox"
        className="drawer-toggle"
      />
      <div className="drawer-side z-[900] min-h-screen overflow-scroll">
        <label
          htmlFor="addSubmissionDrawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="w-[90%] bg-[lightblue] min-h-screen text-base-content">
          <form
            onSubmit={Formik.handleSubmit}
            className="lg:w-full lg:p-5 p-2 min-h-screen"
          >
            <div className="flex flex-col my-2">
              <label className={`font-bold`} htmlFor="">
                {"Task Name"}
              </label>
              <input
                type="text"
                value={task?.taskName}
                className={`input input-bordered input-sm my-2`}
              />
            </div>
            <div className="flex flex-col my-2">
              <label className={`font-bold`} htmlFor="">
                {"Work"}
              </label>
              <input
                type="text"
                value={task.work}
                className={`input input-bordered input-sm my-2`}
              />
            </div>
            <div className="flex flex-col my-2">
              <div className="flex flex-col lg:flex-row lg:items-center space-x-2">
                <label className={`font-bold`} htmlFor="">
                  {"Submitting By :"}
                </label>
                <div className="flex space-x-1 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={authUser?.profilePic || "/noPP.png"} />
                    </div>
                  </div>
                  <p className="font-bold">{authUser?.userName}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col my-2">
              <label className="font-bold" htmlFor="">
                Attachments
              </label>
              <input
                onChange={(e) => setUploadingFile(e.target.files?.[0] as File)}
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
                Details
              </label>
              <textarea
                {...Formik.getFieldProps("details")}
                className="textarea textarea-bordered my-2"
              />
            </div>
            <button
              disabled={
                Formik.values.details === "" &&
                Formik.values.attachments?.length === 0
              }
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

export default AddSubmissionDrawer;
