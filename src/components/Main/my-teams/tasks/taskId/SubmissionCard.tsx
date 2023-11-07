import React, { useState } from "react";
import { Tsubmission } from "./AddSubmissionDrawer";
import { Attachment } from "@mui/icons-material";
import { Chip } from "@mui/material";
import { TAt } from "../AddTasksDrawer";

interface props {
  submission: Tsubmission;
}

const SubmissionCard = ({ submission }: props) => {
  return (
    <details className="lg:w-[90%]">
      <summary className="bg-[lightblue] p-2 text-black rounded-lg flex items-center justify-between cursor-pointer">
        <div className="flex space-x-1 items-center">
          <div className="avatar">
            <div className="w-8 rounded-full">
              <img
                src={submission?.submittedBy?.[0]?.profilePic || "/noPP.png"}
              />
            </div>
          </div>
          <p className="font-bold">{submission?.submittedBy?.[0]?.userName}</p>
        </div>
        <Chip
          size="small"
          icon={<Attachment className="text-white" />}
          variant="filled"
          className="bg-white cursor-pointer"
          label={`(${submission?.attachments?.length})`}
        />
      </summary>
      <div className="bg-blue-950 p-2">
        <div className="gird grid-cols-4 gap-2">
          {submission?.attachments?.map((attachment: TAt, i: number) => (
            <a className="btn btn-sm" href={attachment?.file}>{`File_${i}`}</a>
          ))}
        </div>
        {submission?.details && (
          <div className="bg-base-300 p-2 rounded-lg text-black mt-2">
            {submission?.details}
          </div>
        )}
      </div>
    </details>
  );

  // return (
  //   <div className="collapse w-[90%]">
  //     <input
  //       type="radio"
  //       name="my-accordion-1"
  //       onClick={() => setChecked(!checked)}
  //       checked={checked}
  //     />
  //     <div className="collapse-title bg-[blue] text-xl font-medium">
  //       Click to open this one and close others
  //     </div>
  //     <div className="collapse-content">
  //       <p>hello</p>
  //     </div>
  //   </div>
  // );
};

export default SubmissionCard;
