import { useQuery } from "@tanstack/react-query";
import React from "react";

const useGetTeamById = (teamId: string | undefined) => {
  const {
    data: team,
    refetch: teamRefetch,
    isLoading: teamLoadnig,
  } = useQuery({
    queryKey: ["get-team-by-id", teamId as string],
    queryFn: () => {
      if (teamId) {
        return fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}get-team-by-id?teamId=${teamId}`
        ).then((res) => res.json());
      }
    },
  });

  return { team, teamRefetch, teamLoadnig };
};

export default useGetTeamById;
