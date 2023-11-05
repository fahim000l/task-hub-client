import { AUTH_CONTEXT } from "@/contexts/AuthProviders";
import useGetAllTodos from "@/hooks/useGetAllTodos";
import { TtoDo } from "@/pages/add-to-do";
import { useFormik } from "formik";
import React, { useContext } from "react";
import toast from "react-hot-toast/headless";
import Swal from "sweetalert2";

interface props {
  selectedToddo: TtoDo;
  setSelectedTodo: React.Dispatch<React.SetStateAction<TtoDo | null>>;
}

const EditTodoModal = ({ selectedToddo, setSelectedTodo }: props) => {
  const { deadline, status, _id, user, details, subject, work } = selectedToddo;
  const { toDosRefetch } = useGetAllTodos();

  const Formik = useFormik<TtoDo>({
    initialValues: {
      details,
      subject,
      work,
      deadline,
      status,
      user,
    },
    validate: (values) => {
      interface errorType {
        deadline?: string;
        subject?: string;
        work?: string;
      }

      let error: errorType | null = null;

      if (new Date(values.deadline?.day as string) <= new Date()) {
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
    onSubmit: (value) => {
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}edit-todo?_id=${_id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(value),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data?.success) {
            toDosRefetch();
            Formik.resetForm();
            toast.success("Todo modefied successfully");
            Swal.fire("Todo modefied successfully!", "", "success");
            setSelectedTodo(null);
          }
        });
    },
  });

  return (
    <div>
      <input type="checkbox" id="editTodoModal" className="modal-toggle" />
      <div className="modal modal-bottom lg:modal-middle">
        <form
          onSubmit={Formik.handleSubmit}
          className="modal-box bg-[lightblue] rounded-lg lg:w-full p-2 lg:m-[18px] flex flex-col"
        >
          <div className="flex flex-col">
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
          <div className="flex flex-col">
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
          <div className="flex flex-col">
            <label className="font-bold" htmlFor="">
              Details
            </label>
            <textarea
              {...Formik.getFieldProps("details")}
              className="textarea textarea-bordered my-2"
            />
          </div>
          <button className="w-full btn btn-sm btn-success normal-case">
            Submit
          </button>
        </form>
        <label
          onClick={() => setSelectedTodo(null)}
          className="modal-backdrop"
          htmlFor="editTodoModal"
        >
          Close
        </label>
      </div>
    </div>
  );
};

export default EditTodoModal;
