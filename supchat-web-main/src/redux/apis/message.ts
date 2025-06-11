import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../BaseQuery";

export const messageApi = createApi({
  reducerPath: "messageAPI",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    // original unused mutation kept for compatibility
    createMessage: builder.mutation({
      query({
        users,
        isGroupChat,
        chatName,
        groupAdmin,
      }: {
        users: any;
        isGroupChat: boolean;
        chatName: string;
        groupAdmin: string;
      }) {
        return {
          url: "/message",
          method: "POST",
          body: { users, isGroupChat, chatName, groupAdmin },
        };
      },
    }),
    // send a message to either a chat or channel
    sendMessage: builder.mutation<
      { data: any },
      { content: string; chatId?: string; channelId?: string }
    >({
      query({ content, chatId, channelId }) {
        return {
          url: "/message",
          method: "POST",
          body: { content, chatId, channelId },
        };
      },
    }),
    getMessages: builder.query<{ data: any[] }, { chatId: string }>({
      query({ chatId }) {
        return {
          url: `/message/${chatId}`,
          method: "GET",
        };
      },
    }),
    getChannelMessages: builder.query<
      { data: any[] },
      { channelId: string }
    >({
      query({ channelId }) {
        return {
          url: `/message/channel/${channelId}`,
          method: "GET",
        };
      },
    }),
    getUnreadMessages: builder.query<{ data: any }, { chatId: string }>({
      query({ chatId }) {
        return {
          url: `/message/unread/${chatId}`,
          method: "GET",
        };
      },
    }),
    getUnreadChannelMessages: builder.query<
      { data: any },
      { channelId: string }
    >({
      query({ channelId }) {
        return {
          url: `/message/unread/channel/${channelId}`,
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
  useSendMessageMutation,
  useLazyGetMessagesQuery,
  useLazyGetChannelMessagesQuery,
  useLazyGetUnreadMessagesQuery,
  useLazyGetUnreadChannelMessagesQuery,
  useMarAsSeenMutation,
} = messageApi;
