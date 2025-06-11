import React, { useEffect, useState } from "react";
import {
  useCreateWorkspaceMutation,
  useLazyGetWorkspacesQuery,
} from "../../redux/apis/workspace";
import {
  useCreateChannelMutation,
  useLazyGetWorkspaceChannelsQuery,
} from "../../redux/apis/channel";
import {
  useSendMessageMutation,
  useLazyGetChannelMessagesQuery,
} from "../../redux/apis/message";

const WorkspacesPage = () => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWs, setSelectedWs] = useState<string>("");
  const [channelName, setChannelName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [channels, setChannels] = useState<any[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [channelMessages, setChannelMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");

  const [createWorkspace] = useCreateWorkspaceMutation();
  const [fetchWorkspaces] = useLazyGetWorkspacesQuery();
  const [createChannel] = useCreateChannelMutation();
  const [fetchChannels] = useLazyGetWorkspaceChannelsQuery();
  const [sendMessage] = useSendMessageMutation();
  const [fetchChannelMessages] = useLazyGetChannelMessagesQuery();

  const loadWorkspaces = async () => {
    try {
      const res = await fetchWorkspaces().unwrap();
      setWorkspaces(res.data || []);
    } catch (e) {
      console.log("failed to fetch workspaces", e);
    }
  };

  const loadChannels = async (id: string) => {
    try {
      const res = await fetchChannels({ workspaceId: id }).unwrap();
      setChannels(res.data || []);
    } catch (e) {
      console.log("failed to fetch channels", e);
    }
  };

  const loadMessages = async (channelId: string) => {
    try {
      const res = await fetchChannelMessages({ channelId }).unwrap();
      setChannelMessages(res.data || []);
    } catch (e) {
      console.log("failed to fetch messages", e);
    }
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) return;
    await createWorkspace({ name: workspaceName }).unwrap();
    setWorkspaceName("");
    loadWorkspaces();
  };

  const handleCreateChannel = async () => {
    if (!channelName.trim() || !selectedWs) return;
    await createChannel({
      name: channelName,
      workspaceId: selectedWs,
      isPrivate,
    }).unwrap();
    setChannelName("");
    loadChannels(selectedWs);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChannel) return;
    try {
      const res = await sendMessage({
        content: messageText,
        channelId: selectedChannel,
      }).unwrap();
      setChannelMessages([...channelMessages, res.data]);
      setMessageText("");
    } catch (e) {
      console.log("failed to send message", e);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Workspaces</h2>
      <div>
        <input
          placeholder="Workspace name"
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
        />
        <button onClick={handleCreateWorkspace}>Create Workspace</button>
      </div>
      <ul>
        {workspaces.map((ws) => (
          <li key={ws._id}>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSelectedWs(ws._id);
                loadChannels(ws._id);
              }}
            >
              {ws.name}
            </span>
          </li>
        ))}
      </ul>

      {selectedWs && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Channels</h3>
          <div>
            <input
              placeholder="Channel name"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
            />
            <label style={{ marginLeft: "0.5rem" }}>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              Private
            </label>
            <button onClick={handleCreateChannel}>Create Channel</button>
          </div>
          <ul>
            {channels.map((ch) => (
              <li key={ch._id}>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedChannel(ch._id);
                    loadMessages(ch._id);
                  }}
                >
                  {ch.name}
                </span>
                {ch.isPrivate ? " (Private)" : " (Public)"}
              </li>
            ))}
          </ul>

          {selectedChannel && (
            <div style={{ marginTop: "1rem" }}>
              <h4>Messages</h4>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                <ul>
                  {channelMessages.map((msg) => (
                    <li key={msg._id}>{msg.content}</li>
                  ))}
                </ul>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <input
                  placeholder="Type a message"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkspacesPage;
