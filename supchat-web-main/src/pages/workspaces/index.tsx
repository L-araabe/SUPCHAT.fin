import React, { useEffect, useState } from "react";
import {
  useCreateWorkspaceMutation,
  useLazyGetWorkspacesQuery,
} from "../../redux/apis/workspace";
import {
  useCreateChannelMutation,
  useLazyGetWorkspaceChannelsQuery,
} from "../../redux/apis/channel";

const WorkspacesPage = () => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWs, setSelectedWs] = useState<string>("");
  const [channelName, setChannelName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [channels, setChannels] = useState<any[]>([]);

  const [createWorkspace] = useCreateWorkspaceMutation();
  const [fetchWorkspaces] = useLazyGetWorkspacesQuery();
  const [createChannel] = useCreateChannelMutation();
  const [fetchChannels] = useLazyGetWorkspaceChannelsQuery();

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
                {ch.name} {ch.isPrivate ? "(Private)" : "(Public)"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WorkspacesPage;
