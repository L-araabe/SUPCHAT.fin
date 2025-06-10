import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../BaseQuery";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    createChat: builder.mutation({
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
          url: "/chat",
          method: "POST",
          body: { users, isGroupChat, chatName, groupAdmin },
        };
      },
    }),
    getChats: builder.query({
      query() {
        return {
          url: "/chat",
          method: "GET",
        };
      },
    }),
    sendGroupInvite: builder.mutation({
      query({
        groupId,
        invitedUser,
      }: {
        groupId: string;
        invitedUser: string;
      }) {
        return {
          url: "/groupinvite",
          method: "POST",
          body: { group: groupId, invitedUser: invitedUser },
        };
      },
    }),
    receiveInvite: builder.query({
      query({ id }: { id: string }) {
        return {
          url: `/groupinvite/received/${id}`,
          method: "GET",
        };
      },
    }),
    acceptInvite: builder.mutation({
      query({ id }) {
        return {
          url: `/groupinvite/accept/${id}`,
          method: "PUT",
        };
      },
    }),
    rejectInvite: builder.mutation({
      query({ id }) {
        return {
          url: `/groupinvite/reject/${id}`,
          method: "PUT",
        };
      },
    }),
  }),
});

export const {
  useCreateChatMutation,
  useLazyGetChatsQuery,
  useLazyReceiveInviteQuery,
  useSendGroupInviteMutation,
  useAcceptInviteMutation,
  useRejectInviteMutation,
} = chatApi;
