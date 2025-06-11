import React from "react";
import { FaSearch, FaUserFriends } from "react-icons/fa";

interface ChatListProps {
  chats: any[];
  searchChats: string;
  setSearchChats: (val: string) => void;
  setNewGroupModal: (val: boolean) => void;
  setIsSideBarVisible: (val: boolean) => void;
  isSideBarVisible: boolean;
  userId: string;
  setSelectedChat: (chat: any) => void;
  setSelectedChatId: (id: string) => void;
  currentMessageCountZero: (id: string) => void;
  getMessagesFunction: (id: string, isGroupChat: boolean) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  searchChats,
  setSearchChats,
  setNewGroupModal,
  setIsSideBarVisible,
  isSideBarVisible,
  userId,
  setSelectedChat,
  setSelectedChatId,
  currentMessageCountZero,
  getMessagesFunction,
}) => {
  const renderChat = (chat: any) => {
    const filteredUser = chat?.users.find((item: any) => item._id !== userId);
    return (
      <div
        key={chat._id}
        onClick={() => {
          setIsSideBarVisible(false);
          setSelectedChatId(chat._id);
          currentMessageCountZero(chat._id);
          if (chat?.isGroupChat) {
            setSelectedChat(chat);
          } else {
            setSelectedChat(filteredUser);
          }
          getMessagesFunction(chat?._id, chat?.isGroupChat);
        }}
        className="flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-100 cursor-pointer justify-between border border-gray-300 hover:bg-gray-300 transition-colors"
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          {chat?.isGroupChat ? (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-gray-300 flex-shrink-0">
              <FaUserFriends className="text-sm sm:text-base" />
            </div>
          ) : (
            <img
              src={filteredUser?.profilePicture || "https://i.pravatar.cc/40"}
              alt={filteredUser?.name || "User"}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
            />
          )}
          <span className="text-light font-medium text-sm sm:text-base truncate">
            {chat?.isGroupChat ? `Group ${chat?.chatName}` : filteredUser?.name}
          </span>
        </div>
        {chat?.unreadMessages > 0 && (
          <div className="rounded-full bg-primary w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-white text-xs flex-shrink-0">
            {chat?.unreadMessages}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Chat List */}
      <div className="w-1/3 lg:w-1/4 xl:w-1/5 hidden md:block border-r border-primary p-3 sm:p-4 flex flex-col bg-dark">
        <div className="relative mb-4">
          <FaSearch className="absolute left-3 top-3 text-muted text-sm" />
          <input
            type="text"
            placeholder="Search chats"
            value={searchChats}
            onChange={(e) => setSearchChats(e.target.value)}
            className="w-[full] pl-10 pr-4 py-2 bg-dark text-light border border-primary rounded-lg text-sm"
          />
        </div>
        <div className="flex flex-col gap-2 h-full overflow-y-auto">
          <button
            type="button"
            onClick={() => setNewGroupModal(true)}
            className="w-full bg-primary text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition text-sm font-medium"
          >
            Create Group +
          </button>
          {chats.length > 0 ? (
            chats.map(renderChat)
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-muted">No Chats Yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isSideBarVisible && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-white bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSideBarVisible(false)}
          />
          {/* Sidebar */}
          <div className="fixed left-0 top-0 h-full w-4/5 max-w-sm md:hidden bg-dark border-r border-primary p-4 flex flex-col z-50 pt-20">
            <div className="relative mb-4">
              <FaSearch className="absolute left-3 top-3 text-muted text-sm" />
              <input
                type="text"
                placeholder="Search chats"
                className="w-full pl-10 pr-4 py-2 bg-dark text-light border border-primary rounded-lg text-sm"
              />
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto flex-1">
              <button
                type="button"
                onClick={() => {
                  setNewGroupModal(true);
                  setIsSideBarVisible(false);
                }}
                className="w-full bg-primary text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition text-sm font-medium"
              >
                Create Group +
              </button>
              {chats.length > 0 ? (
                chats.map(renderChat)
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm text-muted">No Chats Yet</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChatList;
