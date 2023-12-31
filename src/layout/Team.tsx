import React, { useState } from "react";
import Main from "./Main";
import { Announcement, Task, People } from "@mui/icons-material";
import useGetTeamById from "@/hooks/useGetTeamById";
import { Tteam } from "@/pages/create-team";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

interface props {
  children: React.ReactNode;
}

const Team = ({ children }: props) => {
  const {
    query: { teamId },
  } = useRouter();

  const [show, setShow] = useState(true);

  const { team }: { team: Tteam } = useGetTeamById(teamId as string);

  const { pathname } = useRouter();

  return (
    <Main>
      {show && (
        <div className="bg-[lightblue] lg:p-10 lg:py-5 p-5 py-2">
          <p className="text-3xl lg:text-5xl font-bold">{team?.teamName}</p>
          <p className="text-xl">{team?.subject}</p>
          <p>{team?.details}</p>
          <div className="flex items-start justify-center flex-col">
            <p>Leading By</p>
            <div className="flex space-x-2 items-center">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src={team?.leaderInfo?.[0]?.profilePic} />
                </div>
              </div>
              <p className="font-bold">{team?.leaderInfo?.[0]?.userName}</p>
            </div>
          </div>
        </div>
      )}
      <div
        onClick={() => setShow(!show)}
        className="bg-[lightblue] w-full text-center"
      >
        {show ? (
          <ArrowUpward className="animate-bounce btn btn-sm btn-circle" />
        ) : (
          <ArrowDownward className="" />
        )}
      </div>
      <div className="tabs tabs-boxed hidden lg:block">
        <Link
          href={`/my-teams/${teamId}`}
          className={`tab w-[50%] ${
            !pathname.includes("/members") && "tab-active"
          }`}
        >
          Tasks
        </Link>
        <Link
          href={`/my-teams/${teamId}/members`}
          className={`tab w-[50%] ${
            pathname.includes("/members") && "tab-active"
          }`}
        >
          Members
        </Link>
      </div>
      {children}
      <div className="btm-nav lg:hidden border-4 border-t border-solid border-base-300">
        <button className="active">
          <Task />
          <span className="btm-nav-label">Tasks</span>
        </button>
        <button>
          <People />
          <span className="btm-nav-label">Members</span>
        </button>
      </div>
    </Main>
  );
};

export default Team;
