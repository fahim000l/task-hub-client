import { AUTH_CONTEXT } from "@/contexts/AuthProviders";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

const useGetAllTodos = () => {
  const { authUser } = useContext(AUTH_CONTEXT) || {};

  const {
    data: toDos,
    refetch: toDosRefetch,
    isLoading: toDosLoading,
  } = useQuery({
    queryKey: ["get-all-todos", authUser],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}get-all-todos?email=${authUser?.email}`
      ).then((res) => res.json()),
  });

  return { toDos, toDosRefetch, toDosLoading };
};

export default useGetAllTodos;
