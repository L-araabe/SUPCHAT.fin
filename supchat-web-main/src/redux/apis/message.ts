import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../BaseQuery";

export const messageApi = createApi({
  reducerPath: "messageAPI",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    createMessage: builder.mutation({
      query({ channelId, content }: { channelId: string; content: string }) {
        return {
          url: "/message",
          method: "POST",
          body: { channelId, content },
        };
      },
    }),
    getMessages: builder.query({
      query({ channelId }: { channelId: string }) {
        return {
          url: `/message/${channelId}`,
          method: "GET",
        };
      },
    }),
    getUnreadMessages: builder.query({
      query({ channelId }: { channelId: string }) {
        return {
          url: `/message/unread/${channelId}`,
          method: "GET",
        };
      },
    }),
    marAsSeen: builder.mutation({
      query({ messageIds }: { messageIds: any }) {
        return {
          url: `/message/seen`,
          method: "PUT",
          body: { messageIds: messageIds },
        };
      },
    }),
  }),
});

export const {
  useCreateMessageMutation,
  useLazyGetMessagesQuery,
  useLazyGetUnreadMessagesQuery,
  useMarAsSeenMutation,
} = messageApi;
