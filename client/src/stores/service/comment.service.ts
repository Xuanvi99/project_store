import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryToken";
import { IComment } from "@/types/comment.type";

type IResponsive = {
  data: IComment[];
  total: number;
};

export const commentApi = createApi({
  reducerPath: "comment",
  tagTypes: ["Comment"],
  baseQuery: baseQueryWithAuth,
  endpoints: (build) => ({
    getListAllComment: build.query<IResponsive, string>({
      query: (id) => ({
        url: `comment/getAll/${id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Comment" as const,
                id: _id,
              })),
              { type: "Comment", id: "LIST" },
            ]
          : [{ type: "Comment", id: "LIST" }],
    }),
  }),
});

export const { useGetListAllCommentQuery } = commentApi;
