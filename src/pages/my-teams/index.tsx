import useGetAllTeams from "@/hooks/useGetAllTeams";
import Main from "@/layout/Main";
import React, { useEffect, useContext } from "react";
import { Tteam } from "../create-team";
import TeamCard from "@/components/Main/my-teams/TeamCard";
import { AUTH_CONTEXT } from "@/contexts/AuthProviders";
import { TUser } from "../signup";

export interface Ttm {
  _id?: string;
  teamId: string;
  user: string;
  teamInfo: Tteam[];
  memberInfo: TUser[];
}

const index = () => {
  const { authUser } = useContext(AUTH_CONTEXT) || {};

  return (
    <Main>
      <div className="m-5">
        <div className="grid grid-cols-4 gap-2">
          {authUser?.memberships?.map((team: Ttm) => (
            <TeamCard key={team?._id} team={team} />
          ))}
        </div>
      </div>
    </Main>
  );
};

export default index;
