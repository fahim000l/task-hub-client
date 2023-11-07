import React, { useContext } from "react";
import { Ttask } from "./AddTasksDrawer";
import { Chip } from "@mui/material";
import { Attachment, People } from "@mui/icons-material";
import useGetTeamById from "@/hooks/useGetTeamById";
import { Tteam } from "@/pages/create-team";
import Link from "next/link";

interface props {
  task: Ttask;
}

const TaskCard = ({ task }: props) => {
  const {
    assign,
    deadline,
    priority,
    taskName,
    teamId,
    work,
    _id,
    assignings,
    attachments,
    details,
  } = task;

  const { team }: { team: Tteam } = useGetTeamById(teamId);

  return (
    <Link
      href={`/my-teams/${teamId}/task/${_id}`}
      className="flex items-center justify-between bg-[steelblue] text-white shadow-lg p-2 rounded-lg"
    >
      <div>
        <p className="font-bold lg:text-xl">{taskName}</p>
        <p className="text-sm lg:text-lg">{work}</p>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-center space-y-2 lg:space-y-0 lg:space-x-2">
        <Chip
          size="small"
          icon={<Attachment className="text-white" />}
          variant="filled"
          className="bg-white cursor-pointer"
          label={`(${attachments?.length})`}
        />
        <Chip
          size="small"
          icon={<People className="text-white" />}
          variant="filled"
          className="bg-white cursor-pointer"
          label={`(${
            assign === "all" ? team?.members?.length : assignings?.length
          })`}
        />
      </div>
    </Link>
  );
};

export default TaskCard;
