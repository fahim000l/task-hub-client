import useGetAllTeams from "@/hooks/useGetAllTeams";
import Main from "@/layout/Main";
import React, { useEffect } from "react";
import { Tteam } from "../create-team";
import TeamCard from "@/components/Main/my-teams/TeamCard";

export interface Ttm {
  _id?: string;
  teamId: string;
  user: string;
  teamInfo: Tteam[];
}

const index = () => {
  const { teams } = useGetAllTeams();

  useEffect(() => {
    if (teams) {
      console.log(teams);
    }
  }, [teams]);

  return (
    <Main>
      <div className="m-5">
        <div className="grid grid-cols-4 gap-2">
          {teams?.map((team: Ttm) => (
            <TeamCard key={team?._id} team={team} />
          ))}
        </div>
      </div>
    </Main>
  );
};

export default index;
