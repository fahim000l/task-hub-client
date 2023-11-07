import { TtoDo } from "@/pages/add-to-do";
import { format } from "date-fns";
import React, { useEffect, useContext } from "react";
import { Edit } from "@mui/icons-material";
import { handleTodoStatus } from "@/pages/to-dos";
import useGetAllTodos from "@/hooks/useGetAllTodos";
import { AUTH_CONTEXT } from "@/contexts/AuthProviders";

interface props {
  toDo: TtoDo;
  setSelectedTodos: React.Dispatch<React.SetStateAction<never[] | string[]>>;
  selectedTodos: string[];
  setSelectedTodo: React.Dispatch<React.SetStateAction<TtoDo | null>>;
}

const TodoAcordian = ({
  toDo,
  setSelectedTodos,
  selectedTodos,
  setSelectedTodo,
}: props) => {
  const { _id, work, deadline, details, status, subject } = toDo;
  const { authUserRefetch } = useContext(AUTH_CONTEXT) || {};

  useEffect(() => {
    if (status !== "pending") {
      if (new Date(deadline.day as Date).getDay() - new Date().getDay() < 0) {
        handleTodoStatus(
          "pending",
          [_id as string],
          setSelectedTodos,
          authUserRefetch
        );
      }
    }
  }, [status]);

  return (
    <div className="bg-[steelblue] rounded-lg flex my-2 items-center justify-center">
      <div className="bg-[steelblue] p-2 rounded-lg flex flex-col items-center justify-center space-y-2">
        <input
          onChange={() => {
            if (selectedTodos?.includes(_id as string)) {
              setSelectedTodos((old) => [...old?.filter((to) => to !== _id)]);
            } else {
              setSelectedTodos((old) => [...old, _id as string]);
            }
          }}
          className="checkbox bg-white"
          type="checkbox"
          checked={selectedTodos.includes(_id as string)}
          name=""
          id=""
        />
        <label
          onClick={() => setSelectedTodo(toDo)}
          htmlFor="editTodoModal"
          className="btn btn-circle btn-sm btn-neutral text-white"
        >
          <Edit />
        </label>
      </div>
      <div className="collapse collapse-arrow join-item border border-base-300">
        <input type="radio" name="my-accordion-4" />
        <div className="collapse-title text-xl font-medium bg-[steelblue] text-white flex justify-between space-x-2 items-start">
          <p className="w-[90%] text-sm lg:text-lg">{work}</p>
          <div
            className={`badge badge-sm  ${
              status === "done"
                ? "badge-success"
                : status === "pending"
                ? "badge-error"
                : "badge-neutral"
            }`}
          >
            {status}
          </div>
        </div>
        <div className="collapse-content bg-[lightblue] p-2">
          <div className="flex items-center space-x-2 text-xs">
            <p>Deadline :</p>
            <div className="lg:badge lg:badge-primary font-bold">
              {format(new Date(deadline.day as Date), "PP")}
            </div>
            <div className="lg:badge lg:badge-primary font-bold">
              {`${deadline.time} ${deadline.meridiem}`}
            </div>
            {new Date(deadline.day as Date).getDay() - new Date().getDay() >
              0 && (
              <div className="lg:badge lg:badge-primary font-bold">
                {`${
                  new Date(deadline.day as Date).getDay() - new Date().getDay()
                } day(s) left`}
              </div>
            )}
          </div>
          <p>
            {" "}
            <span>Subject</span> : <span>{subject}</span>{" "}
          </p>
          {toDo.details && (
            <p>
              <span>Details</span> : <span>{details}</span>{" "}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoAcordian;
