import { useQuery } from "@tanstack/react-query";
import React from "react";

const useGetTeamById = (teamId: string | undefined) => {
  const {
    data: { [0]: team } = {},
    refetch: teamRefetch,
    isLoading: teamLoadnig,
  } = useQuery({
    queryKey: ["get-team-by-id", teamId as string],
    queryFn: async () => {
      if (teamId) {
        return await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}get-team-by-id?teamId=${teamId}`
        ).then((res) => res.json());
      }

      return {};
    },
  });

  return { team, teamRefetch, teamLoadnig };
};

export default useGetTeamById;
