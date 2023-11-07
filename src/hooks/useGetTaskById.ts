import { useQuery } from "@tanstack/react-query";
import React from "react";

const useGetTaskById = (taskId: string | undefined) => {
  const {
    data: { [0]: task } = {},
    refetch: taskRefetch,
    isLoading: taskLoading,
  } = useQuery({
    queryKey: ["get-task-by-id", taskId as string],
    queryFn: async () => {
      if (taskId) {
        return await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}get-task-by-id?taskId=${taskId}`
        ).then((res) => res.json());
      }

      return {};
    },
  });

  return { task, taskRefetch, taskLoading };
};

export default useGetTaskById;
