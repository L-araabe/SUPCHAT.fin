import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../BaseQuery";

export const channelApi = createApi({
  reducerPath: "channelApi",
  baseQuery,
  endpoints: (builder) => ({
    createChannel: builder.mutation<{data:any}, {name:string; workspaceId:string; isPrivate:boolean}>({
      query({ name, workspaceId, isPrivate }) {
        return {
          url: "/channels",
          method: "POST",
          body: { name, workspaceId, isPrivate },
        };
      },
    }),
    getWorkspaceChannels: builder.query<{data:any[]}, {workspaceId:string}>({
      query({ workspaceId }) {
        return {
          url: `/channels/${workspaceId}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useCreateChannelMutation, useLazyGetWorkspaceChannelsQuery } = channelApi;
