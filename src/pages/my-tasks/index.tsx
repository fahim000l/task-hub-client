import {
  TAssigned,
  Ttask,
} from "@/components/Main/my-teams/tasks/AddTasksDrawer";
import TaskCard from "@/components/Main/my-teams/tasks/TaskCard";
import { AUTH_CONTEXT } from "@/contexts/AuthProviders";
import Main from "@/layout/Main";
import React, { useContext } from "react";
import { Ttm } from "../my-teams";

const index = () => {
  const { authUser } = useContext(AUTH_CONTEXT) || {};

  return (
    <Main>
      <div className="p-2 lg:p-5">
        {authUser?.memberships?.map((memberShip: Ttm) =>
          memberShip?.teamInfo?.[0]?.tasks
            ?.filter((task: Ttask) => task.assign === "all")
            .map((task: Ttask) => <TaskCard task={task} />)
        )}
        {authUser?.assignings?.map((assigning: TAssigned) => (
          <TaskCard task={assigning?.taskInfo?.[0] as Ttask} />
        ))}
      </div>
    </Main>
  );
};

export default index;
