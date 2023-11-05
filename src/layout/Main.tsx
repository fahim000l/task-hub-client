import Header from "@/components/Main/Header";
import { AUTH_CONTEXT } from "@/contexts/AuthProviders";
import useGetAllTeams from "@/hooks/useGetAllTeams";
import { Ttm } from "@/pages/my-teams";
import Link from "next/link";
import React, { useContext } from "react";

interface props {
  children: React.ReactNode;
}

const Main = ({ children }: props) => {
  const { logOut } = useContext(AUTH_CONTEXT) || {};

  const { teams } = useGetAllTeams();

  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="mainDrawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content p-0 m-0">
          {/* Page content here */}
          <Header />
          {children}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="mainDrawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-60 min-h-full bg-base-200 text-base-content">
            {/* Sidebar content here */}
            <li>
              <Link href={"/add-to-do"}>Add To do</Link>
            </li>
            <li>
              <Link href={"/to-dos"}>My To dos</Link>
            </li>
            <div className="divider"></div>
            <li>
              <Link href={"/create-team"}>Create Team</Link>
              <details>
                <summary>
                  <Link href={"/my-teams"}>My Team</Link>
                </summary>
                <ul className="menu">
                  {teams?.map((team: Ttm) => (
                    <li key={team?._id}>
                      <Link href={`/my-teams/${team.teamId}`}>
                        {team?.teamInfo?.[0].teamName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
            <div className="divider"></div>
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
