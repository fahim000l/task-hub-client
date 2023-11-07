import useGetAllTeams from "@/hooks/useGetAllTeams";
import Main from "@/layout/Main";
import React, { useContext } from "react";
import Team from "@/layout/Team";
import { Add } from "@mui/icons-material";
import AddTasksDrawer, {
  Ttask,
} from "@/components/Main/my-teams/tasks/AddTasksDrawer";
import useGetTeamById from "@/hooks/useGetTeamById";
import { useRouter } from "next/router";
import { Tteam } from "@/pages/create-team";
import { AUTH_CONTEXT } from "@/contexts/AuthProviders";
import TaskCard from "@/components/Main/my-teams/tasks/TaskCard";

const index = () => {
  const {
    query: { teamId },
  } = useRouter();

  const { team }: { team: Tteam } = useGetTeamById(teamId as string);

  const { authUser } = useContext(AUTH_CONTEXT) || {};

  return (
    <Team>
      <div className="lg:p-5 p-1">
        <label
          htmlFor="addTaskDrawer"
          className="btn btn-sm btn-info normal-case"
        >
          <Add />
          Create Task
        </label>
        <div className="my-2">
          {team?.tasks
            ?.filter(
              (task: Ttask) =>
                task.assign === "all" ||
                task.assignings?.filter(
                  (assignedTo: any) => assignedTo.user === authUser?.email
                )
            )
            .map((task: Ttask) => (
              <TaskCard task={task} key={task?._id} />
            ))}
        </div>
      </div>
      <AddTasksDrawer team={team} />
    </Team>
  );
};

export default index;
