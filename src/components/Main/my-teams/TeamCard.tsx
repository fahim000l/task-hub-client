import { Ttm } from "@/pages/my-teams";
import Link from "next/link";
import React from "react";

interface props {
  team: Ttm;
}

const TeamCard = ({ team }: props) => {
  const {
    teamId,
    user: member,
    _id: memberId,
    teamInfo: {
      [0]: {
        details,
        leader,
        subject,
        teamName,
        leaderInfo: {
          [0]: { userName: leaderName = "", profilePic: leaderPP = "" } = {},
        } = {},
      },
    },
  } = team;

  console.log(leaderName, leaderPP);

  return (
    <Link
      href={`/my-teams/${teamId}`}
      className="card bg-base-300 shadow-xl p-2"
    >
      <div className="card-body p-0 m-0">
        <div className="p-5">
          <p className="text-2xl font-bold my-2">{teamName}</p>
          <p>{subject}</p>
        </div>
      </div>
      <div className="flex space-x-2 items-center">
        <div className="avatar">
          <div className="w-10 rounded-full">
            <img src={leaderPP} />
          </div>
        </div>
        <p>{leaderName}</p>
      </div>
    </Link>
  );
};

export default TeamCard;
