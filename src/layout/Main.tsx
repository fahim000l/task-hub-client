import Header from "@/components/Main/Header";
import {
  TAssigned,
  Ttask,
} from "@/components/Main/my-teams/tasks/AddTasksDrawer";
import { AUTH_CONTEXT } from "@/contexts/AuthProviders";
import { Ttm } from "@/pages/my-teams";
import { Divider } from "@mui/material";
import Link from "next/link";
import React, { useContext, useRef, useEffect } from "react";

interface props {
  children: React.ReactNode;
}

const Main = ({ children }: props) => {
  const { logOut, authUser } = useContext(AUTH_CONTEXT) || {};

  const drawerToggler = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input
          ref={drawerToggler}
          id="mainDrawer"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content p-0 m-0 min-h-screen">
          {/* Page content here */}
          <Header />
          {children}
        </div>
        <div className="drawer-side z-50">
          <label
            htmlFor="mainDrawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-60 min-h-full bg-base-200 text-base-content">
            <div className="flex flex-col space-x-1 items-center">
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img src={authUser?.profilePic || "/noPP.png"} />
                </div>
              </div>
              <p className="font-bold text-2xl">{authUser?.userName}</p>
            </div>
            <Divider />
            {/* Sidebar content here */}
            <li>
              <Link
                onClick={() => drawerToggler.current?.click()}
                href={"/add-to-do"}
              >
                Add To do
              </Link>
            </li>
            <li>
              <Link
                onClick={() => drawerToggler.current?.click()}
                href={"/to-dos"}
              >
                My To dos
              </Link>
            </li>
            <Divider className="my-2" />
            <li>
              <Link
                onClick={() => drawerToggler.current?.click()}
                href={"/create-team"}
              >
                Create Team
              </Link>
            </li>
            <li>
              <details>
                <summary>
                  <Link
                    onClick={() => drawerToggler.current?.click()}
                    href={"/my-teams"}
                  >
                    My Teams
                  </Link>
                </summary>
                <ul className="menu">
                  {authUser?.memberships?.map((team: Ttm) => (
                    <li key={team?._id}>
                      <Link
                        onClick={() => drawerToggler.current?.click()}
                        href={`/my-teams/${team.teamId}`}
                      >
                        {team?.teamInfo?.[0].teamName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
            <li>
              <details>
                <summary>
                  <Link
                    onClick={() => drawerToggler.current?.click()}
                    href={"/my-tasks"}
                  >
                    Tasks
                  </Link>
                </summary>
                <ul className="menu">
                  {authUser?.memberships?.map((memberShip: Ttm) =>
                    memberShip?.teamInfo?.[0]?.tasks
                      ?.filter((task: Ttask) => task.assign === "all")
                      .map((task: Ttask) => (
                        <li key={task?._id}>
                          <Link
                            onClick={() => drawerToggler.current?.click()}
                            href={`/my-teams/${task?.teamId}/task/${task?._id}`}
                          >
                            {task?.taskName}
                          </Link>
                        </li>
                      ))
                  )}
                  {authUser?.assignings?.map((assigning: TAssigned) => (
                    <li key={assigning?._id}>
                      <Link
                        onClick={() => drawerToggler.current?.click()}
                        href={`/my-teams/${assigning?.taskInfo?.[0]?.teamId}/task/${assigning?.taskId}`}
                      >
                        {assigning?.taskInfo?.[0].taskName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
            <Divider className="my-2" />
            <li>
              <button onClick={logOut} className="btn btn-sm btn-neutral">
                Log Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Main;
