import {
  TAssigned,
  TAt,
  Ttask,
} from "@/components/Main/my-teams/tasks/AddTasksDrawer";
import AddSubmissionDrawer, {
  Tsubmission,
} from "@/components/Main/my-teams/tasks/taskId/AddSubmissionDrawer";
import SubmissionCard from "@/components/Main/my-teams/tasks/taskId/SubmissionCard";
import { AUTH_CONTEXT } from "@/contexts/AuthProviders";
import useGetTaskById from "@/hooks/useGetTaskById";
import useGetTeamById from "@/hooks/useGetTeamById";
import Team from "@/layout/Team";
import { Tteam } from "@/pages/create-team";
import { Ttm } from "@/pages/my-teams";
import { Chip } from "@mui/material";
import { format } from "date-fns";
import { useRouter } from "next/router";
import React, { useEffect, useContext } from "react";

const index = () => {
  const {
    query: { taskId, teamId },
  } = useRouter();

  const { task }: { task: Ttask } = useGetTaskById(taskId as string);
  const { team }: { team: Tteam } = useGetTeamById(teamId as string);
  const { authUser } = useContext(AUTH_CONTEXT) || {};

  useEffect(() => {
    if (task) {
      console.log(task);
    }
  }, [task]);

  return (
    <Team>
      <div className="bg-[steelblue] text-white lg:p-5 p-2 flex flex-col lg:flex-row space-y-2 lg:space-y-0 items-start justify-between h-screen pb-20 lg:pb-0">
        <div className="lg:w-[70%] w-full">
          <p className="lg:text-3xl text-xl font-bold">{task?.taskName}</p>
          <p>Your Job : {task?.work}</p>
          <p>Details : {task?.details}</p>
          <div className="grid grid-cols-4 gap-2">
            {task?.attachments?.map((attachment: TAt, i: number) => (
              <a
                href={attachment.file}
                className="btn btn-neutral btn-sm"
              >{`file_${i}`}</a>
            ))}
          </div>
          <div className="mt-2">
            {task?.submissions?.some(
              (submission: Tsubmission) => submission?.user === authUser?.email
            ) ? (
              task?.submissions
                ?.filter(
                  (submission: Tsubmission) =>
                    submission.submittedBy?.[0]?.email === authUser?.email
                )
                ?.map((submission: Tsubmission) => (
                  <SubmissionCard
                    submission={submission}
                    key={submission?._id}
                  />
                ))
            ) : (
              <div className="flex items-center space-x-2 my-2">
                <label
                  htmlFor="addSubmissionDrawer"
                  className="btn btn-primary btn-sm normal-case"
                >
                  Make Submission
                </label>{" "}
                <span>/</span>
                <button className="btn btn-sm normal-case">
                  Mark as submitted
                </button>
              </div>
            )}
          </div>
        </div>
        {task?.deadline && (
          <div className="flex flex-col space-y-2 lg:w-[30%] w-full ">
            <div className="bg-[lightblue] text-black rounded-lg p-2 space-y-2">
              <div className="flex justify-between">
                <Chip label={"Deadline"} />{" "}
                <span>{`${format(
                  new Date(task?.deadline?.day as Date),
                  "PP"
                )}  ${task?.deadline?.time}  ${
                  task?.deadline?.meridiem
                }`}</span>
              </div>
              <div className="flex justify-between">
                <Chip label={"Priority"} /> <span>{`${task.priority}%`}</span>
              </div>
            </div>
            <div className="bg-[lightblue] text-black rounded-lg p-2 space-y-2">
              <p className="font-bold">Assigned To</p>
              {task.assign === "all"
                ? team?.members?.map((member: Ttm) => (
                    <div className="flex space-x-1 items-center">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={
                              member.memberInfo?.[0]?.profilePic || "/noPP.png"
                            }
                          />
                        </div>
                      </div>
                      <p className="font-bold">
                        {member.memberInfo?.[0]?.userName}
                      </p>
                    </div>
                  ))
                : task.assignings?.map((ta: TAssigned) => (
                    <div className="flex space-x-1 items-center">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={ta?.assignedTo?.[0]?.profilePic || "/noPP.png"}
                          />
                        </div>
                      </div>
                      <p className="font-bold">
                        {ta?.assignedTo?.[0]?.userName}
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        )}
      </div>
      {task && <AddSubmissionDrawer task={task} />}
    </Team>
  );
};

export default index;
