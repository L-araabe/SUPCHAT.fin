import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../BaseQuery";

export const workspaceApi = createApi({
  reducerPath: "workspaceApi",
  baseQuery,
  endpoints: (builder) => ({
    createWorkspace: builder.mutation<{data:any}, {name:string}>({
      query({ name }) {
        return {
          url: "/workspaces",
          method: "POST",
          body: { name },
        };
      },
    }),
    getWorkspaces: builder.query<{data:any[]}, void>({
      query() {
        return {
          url: "/workspaces",
          method: "GET",
        };
      },
    }),
  }),
});

export const { useCreateWorkspaceMutation, useLazyGetWorkspacesQuery } = workspaceApi;
