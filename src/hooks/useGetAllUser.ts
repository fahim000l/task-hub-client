import { useQuery } from "@tanstack/react-query";
import React from "react";

const useGetAllUser = () => {
  const {
    data: users,
    refetch: usersRefetch,
    isLoading: usersLoadnig,
  } = useQuery({
    queryKey: ["get-all-user"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}get-all-user`).then((res) =>
        res.json()
      ),
  });

  return { users, usersLoadnig, usersRefetch };
};

export default useGetAllUser;
