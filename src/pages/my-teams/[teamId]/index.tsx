import useGetAllTeams from "@/hooks/useGetAllTeams";
import Main from "@/layout/Main";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Ttm } from "..";
import useGetTeamById from "@/hooks/useGetTeamById";
import { Tteam } from "@/pages/create-team";

const index = () => {
  const {
    query: { teamId },
  } = useRouter();

  console.log(teamId);

  const { team }: { team: Tteam[] } = useGetTeamById(teamId as string);

  useEffect(() => {
    if (team) {
      console.log(team);
    }
  }, [team]);

  if (team) {
    return (
      <Main>
        <div className="bg-[lightblue] lg:p-10 lg:py-5 p-5 py-2">
          <p className="text-3xl lg:text-5xl font-bold">{team?.[0].teamName}</p>
          <p className="text-xl">{team?.[0]?.subject}</p>
          <p>{team?.[0]?.details}</p>
          <div className="flex items-start justify-center flex-col">
            <p>Leading By</p>
            <div className="flex space-x-2 items-center">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src={team?.[0]?.leaderInfo?.[0]?.profilePic} />
                </div>
              </div>
              <p className="font-bold">
                {team?.[0]?.leaderInfo?.[0]?.userName}
              </p>
            </div>
          </div>
        </div>
      </Main>
    );
  }
};

export default index;
