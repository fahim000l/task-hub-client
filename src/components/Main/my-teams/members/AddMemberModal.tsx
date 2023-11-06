import React, { useState, useEffect, useRef } from "react";
import { CopyAll } from "@mui/icons-material";
import { useRouter } from "next/router";
import copy from "clipboard-copy";
import Swal from "sweetalert2";
import useGetAllUser from "@/hooks/useGetAllUser";
import { TUser } from "@/pages/signup";
import useGetTeamById from "@/hooks/useGetTeamById";

const AddMemberModal = () => {
  const {
    query: { teamId },
  } = useRouter();
  const [addingUser, setAddingUser] = useState<TUser | null>(null);
  const [addedUser, setAddedUser] = useState("");
  const { teamRefetch } = useGetTeamById(teamId as string);

  const handleCopy = async () => {
    try {
      await copy(teamId as string);
      Swal.fire("Team Id copied successfully!", "", "success");
    } catch (err) {
      console.error("Failed to copy", err);
      Swal.fire("Failed to copy!", "", "error");
    }
  };
  const [inputValue, setInputValue] = useState("");
  const modalToggler = useRef<HTMLInputElement | null>(null);

  const { users } = useGetAllUser();

  useEffect(() => {
    if (users) {
      console.log(users);
      setAddingUser(users?.find((user: TUser) => user.email === inputValue));
      console.log(addingUser);
    }
  }, [users, inputValue]);

  const handleAdd = () => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}add-team-member`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ teamId, user: addedUser }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data?.success) {
          Swal.fire("New team member added", "", "success");
          modalToggler?.current?.click();
          teamRefetch();
        }
      });
  };

  return (
    <div>
      <input
        ref={modalToggler}
        type="checkbox"
        id="addMemberModal"
        className="modal-toggle"
      />
      <div className="modal modal-bottom lg:modal-middle">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Add New Member</h3>
          <div className="flex items-center space-x-2">
            <input
              onChange={(e) => setInputValue(e.target.value)}
              type="text"
              className="input input-sm input-bordered w-full"
              placeholder="Enter the user email"
            />
            <button
              disabled={!addedUser}
              onClick={handleAdd}
              className="btn btn-sm btn-success"
            >
              Add
            </button>
          </div>
          {(addingUser as TUser) && (
            <div
              onClick={() => {
                setAddedUser(addingUser?.email as string);
                setAddingUser(null);
              }}
              className="border-2 cursor-pointer border-base-300 border-solid rounded-lg p-1 flex space-x-1 items-center my-1"
            >
              <div className="avatar">
                <div className="w-8 rounded-full">
                  <img src={addingUser?.profilePic || "/noPP.png"} />
                </div>
              </div>
              <p className="font-bold">{addingUser?.email}</p>
            </div>
          )}
          <div className="divider">Or</div>
          <div>
            <h3 className="text-lg font-bold">Share the team Id</h3>
            <div className="flex items-center justify-between border border-[blue] border-solid bg-[lightblue] rounded-lg p-2">
              <p className="text-[blue] font-bold">{teamId}</p>
              <button
                onClick={handleCopy}
                className="btn btn-ghost btn-circle btn-sm"
              >
                {" "}
                <CopyAll />
              </button>
            </div>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="addMemberModal">
          Close
        </label>
      </div>
    </div>
  );
};

export default AddMemberModal;
