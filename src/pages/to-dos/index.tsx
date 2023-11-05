import useGetAllTodos from "@/hooks/useGetAllTodos";
import Main from "@/layout/Main";
import React, { useState } from "react";
import { TtoDo } from "../add-to-do";
import { format } from "date-fns";
import TodoAcordian from "@/components/Main/to-dos/TodoAcordian";
import { Delete, Done } from "@mui/icons-material";
import EditTodoModal from "@/components/Main/to-dos/EditTodoModal";
import toast from "react-hot-toast/headless";
import Swal from "sweetalert2";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

export const handleTodoStatus = (
  status: string,
  selectedTodos: string[],
  setSelectedTodos: React.Dispatch<React.SetStateAction<string[] | never[]>>,
  refetchFunction?: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<any, Error>>
) => {
  fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}todos-status-change?status=${status}`,
    {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(selectedTodos),
    }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data?.success) {
        refetchFunction?.();
        setSelectedTodos([]);
        Swal.fire("Todos modefied successfully!", "", "success");
      }
    });
};

const index = () => {
  const { toDos, toDosRefetch } = useGetAllTodos();
  const [selectedTodos, setSelectedTodos] = useState<string[] | never[]>([]);
  const [selectedToddo, setSelectedTodo] = useState<TtoDo | null>(null);

  const deleteTodos = () => {
    Swal.fire({
      title: "Are you suce to delete these Todos ? ",
      showCancelButton: true,
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}delete-todos`, {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(selectedTodos),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data?.success) {
              toDosRefetch();
              Swal.fire("Todos removed successfully!", "", "success");
              setSelectedTodos([]);
              toast.success("Todos removed successfully");
            }
          });
      }
    });
  };

  return (
    <Main>
      <div className="flex flex-col-reverse lg:flex-col">
        {selectedTodos.length > 0 && (
          <div className="bg-base-300 p-2 flex items-center space-x-2 place-content-end sticky lg:top-16 bottom-0 z-30">
            <p>Selected ({selectedTodos?.length})</p>
            <button
              onClick={deleteTodos}
              className="btn btn-circle btn-sm text-white bg-[red]"
            >
              <Delete />
            </button>
            <button
              onClick={() =>
                handleTodoStatus(
                  "done",
                  selectedTodos,
                  setSelectedTodos,
                  toDosRefetch
                )
              }
              className="btn btn-circle btn-sm text-white bg-[green]"
            >
              <Done />
            </button>
          </div>
        )}
        <div className="join join-vertical w-full p-2 lg:p-5">
          {toDos?.map((toDo: TtoDo) => (
            <TodoAcordian
              setSelectedTodo={setSelectedTodo}
              selectedTodos={selectedTodos}
              setSelectedTodos={setSelectedTodos}
              toDo={toDo}
              key={toDo?._id}
            />
          ))}
        </div>
      </div>
      {selectedToddo && (
        <EditTodoModal
          setSelectedTodo={setSelectedTodo}
          selectedToddo={selectedToddo}
        />
      )}
    </Main>
  );
};

export default index;
