import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utils/baseURL';


export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/orders`,
    credentials: 'include',
  }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    // ✅ SECURE: Fetch orders for current logged-in user (email from token)
    getMyOrders: builder.query({
      query: () => ({
        url: `/me`,
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),
    // ✅ ADMIN: Fetch orders by specific email (requires admin role)
    getOrdersByEmail: builder.query({
      query: (email) => ({
        url: `/user/${email}`,
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),
    // Fetch order by ID
    getOrderById: builder.query({
      query: (orderId) => ({
        url: `order/${orderId}`,
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),

    getAllOrders: builder.query({
      query: () => ({
        url: '',
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/update-order-status/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/delete-order/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useGetOrdersByEmailQuery,
  useGetOrderByIdQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation
} = orderApi;

export default orderApi;
