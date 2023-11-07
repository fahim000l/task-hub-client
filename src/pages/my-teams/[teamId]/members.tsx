import useGetTeamById from "@/hooks/useGetTeamById";
import Team from "@/layout/Team";
import { Tteam } from "@/pages/create-team";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { Add } from "@mui/icons-material";
import AddMemberModal from "@/components/Main/my-teams/members/AddMemberModal";
import { AUTH_CONTEXT } from "@/contexts/AuthProviders";

const members = () => {
  const {
    query: { teamId },
  } = useRouter();

  const { team }: { team: Tteam } = useGetTeamById(teamId as string);
  const { authUser } = useContext(AUTH_CONTEXT) || {};

  return (
    <Team>
      <div className="p-5">
        {authUser?.email === team?.leader && (
          <div>
            <label
              htmlFor="addMemberModal"
              className="btn btn-sm btn-info normal-case"
            >
              <Add />
              Add Member
            </label>
          </div>
        )}
        <div>
          {team?.members?.map((member) => (
            <div
              key={member?._id}
              className="p-2 rounded-lg shadow-xl border-2 border-base-300 my-2 flex items-center justify-between"
            >
              <div className="flex space-x-1 items-center">
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={member.memberInfo?.[0]?.profilePic || "/noPP.png"}
                    />
                  </div>
                </div>
                <p className="font-bold">{member.memberInfo?.[0]?.userName}</p>
              </div>
              {member.user === team.leader && (
                <div className="badge badge-primary">Leader</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <AddMemberModal />
    </Team>
  );
};

export default members;
