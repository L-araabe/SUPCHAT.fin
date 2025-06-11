import React, { RefObject } from "react";
import { FaUserCircle, FaUserFriends } from "react-icons/fa";
import { FiSend } from "react-icons/fi";

interface ChatWindowProps {
  selectedChat: any;
  messages: any[];
  userId: string;
  groupStatus: string;
  receivedInviteId: string;
  AcceptInvitation: (id: string) => void;
  RejectInvitation: (id: string) => void;
  message: string;
  setMessage: (val: string) => void;
  senMessage: () => void;
  messageEndRef: RefObject<HTMLDivElement>;
  setActiveProfileData: (data: any) => void;
  setIsProfileDetailVisible: (val: boolean) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedChat,
  messages,
  userId,
  groupStatus,
  receivedInviteId,
  AcceptInvitation,
  RejectInvitation,
  message,
  setMessage,
  senMessage,
  messageEndRef,
  setActiveProfileData,
  setIsProfileDetailVisible,
}) => {
  if (!selectedChat) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-muted p-4">
        <FaUserCircle className="text-4xl sm:text-6xl mb-4" />
        <p className="text-lg sm:text-xl text-center">No chat selected</p>
        <p className="text-sm sm:text-base text-center mt-2 md:hidden">
          Tap the menu to see your chats
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Chat Header */}
      <div className="p-3 sm:p-4 flex items-center gap-3 border-b border-primary bg-dark">
        {selectedChat?.isGroupChat ? (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-gray-300 flex-shrink-0">
            <FaUserFriends className="text-sm sm:text-base" />
          </div>
        ) : (
          <div
            onClick={() => {
              setActiveProfileData(selectedChat);
              setIsProfileDetailVisible(true);
            }}
          >
            <img
              src={selectedChat?.profilePicture || "https://i.pravatar.cc/40"}
              alt={selectedChat?.name || "User"}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
            />
          </div>
        )}
        <span className="text-light font-semibold text-sm sm:text-base truncate">
          {selectedChat?.isGroupChat ? selectedChat?.chatName : selectedChat?.name}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 sm:p-4 space-y-2 overflow-y-auto bg-dark">
        {groupStatus === "pending" ? (
          <div className="h-full w-full flex flex-col gap-4 justify-center items-center p-4">
            <p className="text-center text-sm sm:text-base">You are invited to join this group</p>
            <div className="flex flex-row gap-3">
              <button
                type="button"
                onClick={() => AcceptInvitation(receivedInviteId)}
                className="px-4 sm:px-6 bg-primary text-white py-2 rounded-lg hover:bg-blue-600 transition text-sm"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => RejectInvitation(receivedInviteId)}
                className="px-4 sm:px-6 bg-gray-300 text-black py-2 rounded-lg hover:bg-gray-600 hover:text-white transition text-sm"
              >
                Reject
              </button>
            </div>
          </div>
        ) : messages.length > 0 ? (
          <>
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex flex-row w-full items-end gap-2 ${
                  msg?.sender?._id === userId ? "justify-end" : "justify-start"
                }`}
              >
                {msg?.sender._id !== userId && (
                  <div
                    className="flex justify-center items-center bg-gray-300  p-1 rounded-[50px] w-10 h-10 overflow-hidden object-contain"
                    onClick={() => {
                      setIsProfileDetailVisible(true);
                      setActiveProfileData(msg?.sender);
                    }}
                  >
                    <img src={msg?.sender?.profilePicture} />
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-xs p-3 rounded-lg text-sm sm:text-base ${
                    msg?.sender?._id === userId
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-gray-300 text-black rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm"> {msg?.content}</p>
                  <p className="text-[10px]">
                    {msg?.createdAt?.split("T")[0] +
                      " " +
                      "/" +
                      msg?.createdAt?.split("T")[1].split(":")[0] +
                      ":" +
                      msg?.createdAt?.split("T")[1].split(":")[1]}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </>
        ) : (
          <div className="h-full w-full flex justify-center items-center">
            <p className="text-sm sm:text-base text-muted">No Messages Yet</p>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-3 sm:p-4 border-t border-primary bg-dark flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              senMessage();
            }
          }}
          placeholder="Type a message"
          className="flex-1 px-3 sm:px-4 py-2 rounded-lg text-light bg-dark border border-primary focus:outline-none focus:border-blue-500 transition text-sm sm:text-base"
        />
        <button
          className="p-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition flex-shrink-0"
          onClick={senMessage}
        >
          <FiSend className="text-sm sm:text-base" />
        </button>
      </div>
    </>
  );
};

export default ChatWindow;
