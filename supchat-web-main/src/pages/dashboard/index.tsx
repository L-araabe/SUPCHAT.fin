import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import NewGroup from "../../component/NewGroup";
import {
  useLazyGetChatsQuery,
  useCreateChatMutation,
} from "../../redux/apis/chat";
import {
  useCreateMessageMutation,
  useLazyGetMessagesQuery,
} from "../../redux/apis/message";
import { useLazyGetChannelsQuery } from "../../redux/apis/channel";

const Dashboard = () => {
  const user = useSelector((state: any) => state.user.user);
  const [chats, setChats] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const [triggerChats] = useLazyGetChatsQuery();
  const [triggerChannels] = useLazyGetChannelsQuery();
  const [triggerMessages] = useLazyGetMessagesQuery();
  const [sendMessage] = useCreateMessageMutation();

  useEffect(() => {
    const loadChats = async () => {
      const res = await triggerChats().unwrap();
      setChats(res.data);
    };
    loadChats();
  }, []);

  const loadChannels = async (chatId: string) => {
    const res = await triggerChannels({ groupId: chatId }).unwrap();
    setChannels(res.data);
  };

  const loadMessages = async (channelId: string) => {
    const res = await triggerMessages({ channelId }).unwrap();
    setMessages(res.data);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChannel) return;
    const res = await sendMessage({ channelId: selectedChannel._id, content: message }).unwrap();
    setMessages((prev) => [...prev, res.data]);
    setMessage("");
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex h-screen">
      <ChatList
        chats={chats}
        searchChats=""
        setSearchChats={() => {}}
        setNewGroupModal={() => {}}
        setIsSideBarVisible={() => {}}
        isSideBarVisible={false}
        userId={user.id}
        setSelectedChat={(chat: any) => {
          setSelectedChat(chat);
          loadChannels(chat._id);
        }}
        setSelectedChatId={() => {}}
        currentMessageCountZero={() => {}}
        getMessagesFunction={() => {}}
      />
      <div className="flex-1 flex flex-col">
        {selectedChat && (
          <div className="p-2 border-b">
            <h2 className="font-bold">Channels</h2>
            <div className="flex gap-2">
              {channels.map((c) => (
                <button
                  key={c._id}
                  className="px-2 py-1 border"
                  onClick={() => {
                    setSelectedChannel(c);
                    loadMessages(c._id);
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex-1">
          <ChatWindow
            selectedChat={selectedChannel}
            messages={messages}
            userId={user.id}
            groupStatus=""
            receivedInviteId=""
            AcceptInvitation={() => {}}
            RejectInvitation={() => {}}
            message={message}
            setMessage={setMessage}
            senMessage={handleSendMessage}
            messageEndRef={messageEndRef}
            setActiveProfileData={() => {}}
            setIsProfileDetailVisible={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
