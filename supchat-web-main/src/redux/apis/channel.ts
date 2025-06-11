import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../BaseQuery";

export const channelApi = createApi({
  reducerPath: "channelApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    createChannel: builder.mutation<{data:any}, {name:string;group:string;isPrivate:boolean;members:string[]}>({
      query(body) {
        return { url: "/channel", method: "POST", body };
      },
    }),
    getChannels: builder.query<{data:any[]}, {groupId:string}>({
      query({ groupId }) {
        return { url: `/channel/group/${groupId}`, method: "GET" };
      },
    }),
  }),
});

export const { useCreateChannelMutation, useLazyGetChannelsQuery } = channelApi;
