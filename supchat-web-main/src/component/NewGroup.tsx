// Modal.js
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import "./modal.css"; // for styling
import { toast } from "react-toastify";
import {
  useCreateChatMutation,
  useSendGroupInviteMutation,
} from "../redux/apis/chat";
import { useSelector } from "react-redux";

interface modalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  searchFriends: (search: string) => void;
  chats: any;
  setChats: any;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  searchFriends,
  setChats,
  chats,
}: modalProps) => {
  const user = useSelector((state) => state?.user?.user);
  const [
    createChat,
    {
      // isLoading: creatChatLoading,
      // isError: isCreateChatError,
      // isSuccess: isCreateChatSuccess,
      // error: createChatError,
    },
  ] = useCreateChatMutation();
  const [sendGroupInvite, {}] = useSendGroupInviteMutation();
  const [invitedMembers, setInvitedMembers] = useState([]);
  const [groupName, setGroupName] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  const [displayUsers, setDisplayUsers] = useState(false);
  const [users, setUsers] = useState([]);

  const addUserToInvited = (gotUser) => {
    if (gotUser._id === user.id) {
      toast("You cannot add yourself");
      return;
    }
    const alreadyHere = invitedMembers.find(
      (item) => item?._id === gotUser?._id
    );
    if (alreadyHere) {
      toast("Already added to invited");
      return;
    }
    setInvitedMembers([...invitedMembers, gotUser]);
  };

  const createChatFunction = async () => {
    try {
      const usersArray = invitedMembers?.map((item) => item._id);
      const response = await createChat({
        users: [user.id, ...usersArray],
        isGroupChat: true,
        chatName: groupName,
        groupAdmin: user.id,
      }).unwrap();
      console.log("haqqqeeee", response?.data);
      setChats([response?.data, ...chats]);
      return response?.data?._id;
    } catch (e) {
      console.log("error occured white creating grou chat", e);
    }
  };

  const createGroup = async () => {
    if (groupName === "") {
      toast("Please enter group name");
      return;
    } else if (invitedMembers.length === 0 || invitedMembers.length < 2) {
      toast("Please  invite atleat two members");
      return;
    }
    const groupId = await createChatFunction();
    try {
      for (const item of invitedMembers) {
        await sendGroupInvite({
          groupId: groupId,
          invitedUser: item?._id,
        }).unwrap();
      }
    } catch (e) {
      console.log("error occured creating group", e);
    }
  };

  const removeInvited = (id: string) => {
    const newMembers = invitedMembers.filter((item) => item._id !== id);
    setInvitedMembers(newMembers);
  };

  const clearAll = () => {
    setDisplayUsers(false);
    setInvitedMembers([]);
    setGroupName("");
    setSearchName("");
    setUsers([]);
  };

  useEffect(() => {
    const getUser = async () => {
      const foundUsers = await searchFriends(searchName);
      setUsers(foundUsers);
    };
    if (searchName !== "") {
      setDisplayUsers(true);
      getUser();
    }
  }, [searchName]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay z-150">
      <div className="modal-content flex flex-col gap-2 w-[350px] relative">
        {children}
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          value={groupName}
          onChange={(e) => {
            setGroupName(e.target.value);
          }}
          placeholder="Enter group name"
          required
        />
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
          }}
          placeholder="Search members to invite"
          required
        />
        {displayUsers && (
          <div className="absolute top-45  border border-gray-300 rounded-md w-[290px] p-4 h-max-40 overflow-y-auto z-30 bg-white">
            <div
              className="w-full flex justify-end"
              onClick={() => setDisplayUsers(false)}
            >
              <FaTimes />
            </div>
            {users?.length > 0 ? (
              users?.map((item) => (
                <div className="w-full flex flex-row justify-between items-center mt-4">
                  <div className="flex flex-row gap-2 items-center">
                    <div className="rounded-[50px] h-10 w-10 overflow-hidden">
                      <img
                        src={
                          item?.profilePicture
                            ? item?.profilePicture
                            : "https://i.pravatar.cc/40"
                        }
                        className="w-full h-full"
                      />
                    </div>
                    <p>{item?.name}</p>
                  </div>
                  <div
                    className="p-1 px-2 rounded-md bg-primary text-center text-white cursor-pointer"
                    onClick={() => {
                      setDisplayUsers(false);
                      addUserToInvited(item);
                    }}
                  >
                    Invite
                  </div>
                </div>
              ))
            ) : (
              <p>No records found</p>
            )}
          </div>
        )}
        <p className="font-lg mt-8">Invited Members</p>
        {invitedMembers?.length > 0 ? (
          invitedMembers?.map((item) => (
            <div className="w-full flex flex-row justify-between items-center mt-6 ">
              <div className="flex flex-row gap-2 items-center">
                <div className="rounded-[50px] h-10 w-10 overflow-hidden">
                  <img
                    src={
                      item?.profilePicture
                        ? item?.profilePicture
                        : "https://i.pravatar.cc/40"
                    }
                    className="w-full h-full"
                  />
                </div>
                <p>{item?.name}</p>
              </div>
              <div
                className="p-1 px-2 rounded-md bg-gray-300 text-center text-white cursor-pointer"
                onClick={() => {
                  removeInvited(item?._id);
                }}
              >
                Remove
              </div>
            </div>
          ))
        ) : (
          <p className="font-bold text-center mb-4">Noone is invited</p>
        )}

        <button
          type="button"
          onClick={() => {
            createGroup();
          }}
          className={`w-full bg-[var(--color-primary)] text-white py-2 rounded-lg hover:bg-blue-600 transition mt-4`}
        >
          Create Group
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            clearAll();
          }}
          className={`w-full bg-[var(--color-primary)] text-white py-2 rounded-lg hover:bg-blue-600 transition`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
