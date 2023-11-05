import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AUTH_CONTEXT } from "@/contexts/AuthProviders";

const useGetAllTeams = () => {
  const { authUser } = useContext(AUTH_CONTEXT) || {};

  const {
    data: teams = [],
    refetch: teamsRefetch,
    isLoading: teamsLoading,
  } = useQuery({
    queryKey: ["get-all-teams", authUser],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}get-all-teams?email=${authUser?.email}`
      ).then((res) => res.json()),
  });

  return { teams, teamsRefetch, teamsLoading };
};

export default useGetAllTeams;
