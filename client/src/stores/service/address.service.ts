import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "../baseQueryToken";
import { IAddress } from "@/types/address.type";

export const addressApi = createApi({
  reducerPath: "address",
  tagTypes: ["Address"],
  baseQuery: baseQueryWithAuth,
  endpoints: (build) => ({
    getAddress: build.query<{ address: IAddress }, string>({
      query: (id) => ({
        url: `address/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Address", id }],
    }),
    addAddress: build.mutation<
      { message: string },
      { body: Omit<IAddress, "_id"> }
    >({
      query: ({ body }) => ({
        url: `address`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Address" }],
    }),
    upDateAddress: build.mutation<
      { message: string },
      { id: string; body: Omit<IAddress, "_id" | "userId"> }
    >({
      query: ({ id, body }) => ({
        url: `address/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, data) => [
        { type: "Address", id: data.id },
      ],
    }),
    // deleteAddress: build.mutation<{ message: string }, string>({
    //   query: (id) => ({
    //     url: `address/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: (result, error, id) => [{ type: "Address", id }],
    // }),
  }),
});

export const {
  useGetAddressQuery,
  useAddAddressMutation,
  useUpDateAddressMutation,
} = addressApi;
