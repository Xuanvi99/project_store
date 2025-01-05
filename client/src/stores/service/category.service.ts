import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryToken";
import { ICategory } from "../../types/category.type";

export const categoryApi = createApi({
  reducerPath: "category",
  tagTypes: ["Category"],
  baseQuery: baseQueryWithAuth,
  endpoints: (build) => ({
    getAllCategory: build.query<{ data: ICategory[] }, void>({
      query: () => ({
        url: "category",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(
                ({ _id }) => ({ type: "Category", id: _id } as const)
              ),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),
    createBrandCategory: build.mutation<{ message: string }, FormData>({
      query: (body) => ({
        url: "category",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
  }),
});

export const { useGetAllCategoryQuery, useCreateBrandCategoryMutation } =
  categoryApi;
