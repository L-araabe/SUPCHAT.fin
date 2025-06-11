import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import React from "react";

interface HeaderProps {
  isSideBarVisible: boolean;
  setIsSideBarVisible: (val: boolean) => void;
  setFriendSearch: (val: string) => void;
  displayFriendsList: boolean;
  setDisplayFriendsList: (val: boolean) => void;
  searchedFriendsList: any[];
  addChatToChats: (chat: any) => void;
  user: any;
  isLogoutVisible: boolean;
  setIsLogoutVisible: (val: boolean) => void;
  setIsProfileModalVisible: (val: boolean) => void;
  logout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isSideBarVisible,
  setIsSideBarVisible,
  setFriendSearch,
  displayFriendsList,
  setDisplayFriendsList,
  searchedFriendsList,
  addChatToChats,
  user,
  isLogoutVisible,
  setIsLogoutVisible,
  setIsProfileModalVisible,
  logout,
}) => {
  return (
    <div className="bg-dark text-light p-3 sm:p-4 flex justify-between items-center shadow-md w-full relative">
      {/* Mobile menu toggle */}
      <div
        className="block md:hidden cursor-pointer p-2"
        onClick={() => setIsSideBarVisible(!isSideBarVisible)}
      >
        {isSideBarVisible ? <FaTimes size={20} /> : <FaBars size={20} />}
      </div>

      {/* Search bar - hidden on mobile when sidebar is visible */}
      <div
        className={`flex flex-row border border-primary rounded-lg items-center p-2 gap-2 relative mx-2 sm:mx-4 flex-1 max-w-xs sm:max-w-sm ${
          isSideBarVisible ? "hidden md:flex" : "flex"
        }`}
      >
        <FaSearch className="text-muted text-sm" />
        <input
          type="text"
          placeholder="Search users"
          onChange={(e) => setFriendSearch(e.target.value)}
          className="w-full bg-dark text-light text-sm placeholder:text-xs sm:placeholder:text-sm outline-none"
        />
      </div>

      {/* Friends search dropdown */}
      {displayFriendsList && (
        <div className="absolute top-16 sm:top-20 left-0 sm:right-10 border border-gray-300 rounded-md w-[calc(100vw-1rem)] sm:w-[290px] max-w-[320px] p-3 sm:p-4 max-h-60 sm:max-h-80 overflow-y-auto z-30 bg-white">
          <div
            className="w-full flex justify-end mb-2"
            onClick={() => setDisplayFriendsList(false)}
          >
            <FaTimes className="cursor-pointer" />
          </div>
          {searchedFriendsList?.length > 0 ? (
            searchedFriendsList?.map((item, index) => (
              <div
                key={index}
                className="w-full flex flex-row justify-between items-center mt-3 sm:mt-4"
              >
                <div className="flex flex-row gap-2 items-center flex-1 min-w-0">
                  <div className="rounded-full h-8 w-8 sm:h-10 sm:w-10 overflow-hidden flex-shrink-0">
                    <img
                      src={item?.profilePicture || "https://i.pravatar.cc/40"}
                      className="w-full h-full object-cover"
                      alt={item?.name || "User"}
                    />
                  </div>
                  <p className="text-sm sm:text-base truncate">{item?.name}</p>
                </div>
                <div
                  className="p-1 px-2 sm:px-3 rounded-md bg-primary text-center text-white cursor-pointer text-xs sm:text-sm flex-shrink-0 ml-2"
                  onClick={() => addChatToChats(item)}
                >
                  Add
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-center">No records found</p>
          )}
        </div>
      )}

      {/* User profile section */}
      <div
        className="flex items-center gap-2 cursor-pointer relative"
        onClick={() => setIsLogoutVisible(!isLogoutVisible)}
      >
        <img
          src={user?.profilePicture || "https://i.pravatar.cc/40"}
          alt="Profile"
          className="rounded-full w-8 h-8 sm:w-10 sm:h-10 object-cover"
        />
        <p className="text-xs sm:text-sm font-bold hidden sm:block truncate max-w-20">
          {user?.name || ""}
        </p>
      </div>

      {/* Logout dropdown */}
      {isLogoutVisible && (
        <div
          className="rounded-md p-2 absolute top-14 sm:top-16 right-2 z-10 bg-white border border-gray-300 shadow-lg flex flex-col"
          onClick={logout}
        >
          <button
            className="text-white text-sm hover:bg-blue-300 py-2 px-4 rounded bg-primary"
            onClick={(e) => {
              e.stopPropagation();
              setIsProfileModalVisible(true);
            }}
          >
            Profile
          </button>
          <button className="text-red-400 text-sm hover:bg-gray-300 py-2 px-4 rounded">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
