import React, { useState, useEffect } from "react";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import { Tteam } from "@/pages/create-team";
import { CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material";
import { Ttm } from "@/pages/my-teams";
import { format } from "date-fns";
import useBase64 from "@/hooks/useBase64";

interface props {
  team: Tteam;
}

const AddTasksDrawer = ({ team }: props) => {
  const [assigning, setAssigning] = useState("all");
  const [day, setDay] = useState<Date>(new Date());
  const [meridiem, setMeridiem] = useState<"AM" | "PM">("AM");
  const [time, setTime] = useState<string | undefined>(
    `${new Date().getHours()}:${new Date().getMinutes()}`
  );
  const [tempInput, setTempInput] = useState();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { convertedImage } = useBase64(selectedFile as File);

  useEffect(() => {
    if (tempInput) {
      console.log(tempInput);
    }
  }, [tempInput]);

  useEffect(() => {
    if (time) {
      if (parseInt(time.split(":")[0]) > 12) {
        setTime(
          `${parseInt(time.split(":")[0] as string) - 12}` +
            ":" +
            time.split(":")[1]
        );
        setMeridiem("PM");
      }

      if (parseInt(time.split(":")[0]) === 0) {
        setTime(`12` + ":" + time.split(":")[1]);
        setMeridiem("AM");
      }
    }
  }, [time]);

  return (
    <div className="drawer drawer-end">
      <input id="addTaskDrawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side z-[900]">
        <label
          htmlFor="addTaskDrawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="w-[90%] min-h-full bg-base-200 text-base-content">
          <form className="bg-[lightblue] lg:w-full lg:p-5 p-2 h-screen">
            <div className="flex flex-col my-2">
              <label className={`font-bold`} htmlFor="">
                {"Subject"}
              </label>
              <input
                type="text"
                className={`input input-bordered input-sm my-2`}
              />
            </div>
            <div className="flex flex-col my-2">
              <label className={`font-bold`} htmlFor="">
                {"Work"}
              </label>
              <input
                type="text"
                className={`input input-bordered input-sm my-2`}
              />
            </div>
            <div className="flex flex-col my-2">
              <div className="flex items-center space-x-2">
                <label className={`font-bold`} htmlFor="">
                  {"Assiging to"}
                </label>
                <select
                  onChange={(e) => setAssigning(e.target.value)}
                  value={assigning}
                  className="select select-bordered select-xs"
                >
                  <option value="all">All members</option>
                  <option value="specific">Specific</option>
                </select>
              </div>
              {assigning === "specific" && (
                <Autocomplete
                  fullWidth
                  size="small"
                  className="bg-white rounded-lg my-2"
                  multiple
                  id="checkboxes-tags-demo"
                  options={team?.members as Ttm[]}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option?.memberInfo?.[0]?.userName}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={<CheckBoxOutlineBlank />}
                        checkedIcon={<CheckBox />}
                        style={{ marginRight: 2 }}
                        checked={selected}
                      />
                      <div className="flex space-x-1 items-center">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img src={option?.memberInfo?.[0]?.profilePic} />
                          </div>
                        </div>
                        <p className="font-bold">
                          {option?.memberInfo?.[0]?.userName}
                        </p>
                      </div>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Search members" />
                  )}
                />
              )}
            </div>
            <div className="flex flex-col my-2">
              <label className="font-bold" htmlFor="">
                Priority
              </label>
              <input
                type="range"
                min={1}
                max="100"
                value="25"
                className="range"
                step="25"
              />
              <div className="w-full flex justify-between text-xs px-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
                  <span>{number}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col my-2">
              <label className="font-bold" htmlFor="">
                Deadline
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  onChange={(e) => setDay(new Date(e.target.value))}
                  placeholder="dd/mm/yyyy"
                  className="input input-bordered input-sm"
                />
                <input
                  type="time"
                  defaultValue={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    if (parseInt(e.target.value.split(":")[0]) < 12) {
                      setMeridiem("AM");
                    }
                    if (parseInt(e.target.value.split(":")[0]) === 12) {
                      setMeridiem("PM");
                    }
                    console.log(e.target.value);
                  }}
                  className="input input-bordered input-sm"
                />
              </div>
            </div>
            <div className="flex flex-col my-2">
              <label className="font-bold" htmlFor="">
                Details
              </label>
              <textarea className="textarea textarea-bordered my-2" />
            </div>
            <button className="btn btn-sm btn-success normal-case">
              Submit
            </button>{" "}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTasksDrawer;
