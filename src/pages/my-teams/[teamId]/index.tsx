import useGetAllTeams from "@/hooks/useGetAllTeams";
import Main from "@/layout/Main";
import React from "react";
import Team from "@/layout/Team";
import { Add } from "@mui/icons-material";
import AddTasksDrawer from "@/components/Main/my-teams/tasks/AddTasksDrawer";
import useGetTeamById from "@/hooks/useGetTeamById";
import { useRouter } from "next/router";

const index = () => {
  const {
    query: { teamId },
  } = useRouter();

  const { team } = useGetTeamById(teamId as string);

  return (
    <Team>
      <div className="p-5">
        <label
          htmlFor="addTaskDrawer"
          className="btn btn-sm btn-info normal-case"
        >
          <Add />
          Create Task
        </label>
      </div>
      <AddTasksDrawer team={team} />
    </Team>
  );
};

export default index;
