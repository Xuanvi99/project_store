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
    }),
  }),
});

export const { useGetAllCategoryQuery } = categoryApi;
