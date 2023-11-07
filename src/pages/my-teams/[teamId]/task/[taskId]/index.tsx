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
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { format } from "date-fns";
import { useRouter } from "next/router";
import React, { useEffect, useContext } from "react";
import Swal from "sweetalert2";

const index = () => {
  const {
    query: { taskId, teamId },
  } = useRouter();

  const {
    task,
    taskRefetch,
  }: {
    task: Ttask;
    taskRefetch: (
      options?: RefetchOptions | undefined
    ) => Promise<QueryObserverResult<any, Error>>;
  } = useGetTaskById(taskId as string);
  const { team }: { team: Tteam } = useGetTeamById(teamId as string);
  const { authUser } = useContext(AUTH_CONTEXT) || {};

  const handleSubmit = () => {
    Swal.fire({
      title: "Are you sure to mark as submitted?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}store-submission`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            submission: { taskId, user: authUser?.email },
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data?.success) {
              taskRefetch();
              Swal.fire("Submitted Successfully", "", "success");
            }
          });
      }
    });
  };

  return (
    <Team>
      <div className="bg-[steelblue] text-white lg:p-5 p-2 flex flex-col lg:flex-row space-y-2 lg:space-y-0 items-start justify-between min-h-screen pb-20 lg:pb-0">
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
                    submission?.details ||
                    (submission?.attachments &&
                      submission?.attachments?.length > 0)
                )
                ?.filter(
                  (submission: Tsubmission) =>
                    authUser?.email === team?.leader ||
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
                <button
                  onClick={handleSubmit}
                  className="btn btn-sm normal-case"
                >
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
                    <div className="flex items-center space-x-2">
                      <input
                        checked={task?.submissions?.some(
                          (submission: Tsubmission) =>
                            submission?.user === member?.user
                        )}
                        type="checkbox"
                        className="checkbox checkbox-primary"
                      />
                      <div className="flex space-x-1 items-center">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img
                              src={
                                member.memberInfo?.[0]?.profilePic ||
                                "/noPP.png"
                              }
                            />
                          </div>
                        </div>
                        <p className="font-bold">
                          {member.memberInfo?.[0]?.userName}
                        </p>
                      </div>
                    </div>
                  ))
                : task.assignings?.map((ta: TAssigned) => (
                    <div className="flex items-center space-x-2">
                      <input
                        checked={task?.submissions?.some(
                          (submission: Tsubmission) =>
                            submission?.user === ta?.user
                        )}
                        type="checkbox"
                        className="checkbox checkbox-primary"
                      />
                      <div className="flex space-x-1 items-center">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img
                              src={
                                ta?.assignedTo?.[0]?.profilePic || "/noPP.png"
                              }
                            />
                          </div>
                        </div>
                        <p className="font-bold">
                          {ta?.assignedTo?.[0]?.userName}
                        </p>
                      </div>
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
