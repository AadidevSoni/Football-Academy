import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({ 
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      })
    }),

    addPlayer: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/players`,
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Player'],
    }),

    // GET all players → /api/admin/players
    getPlayers: builder.query({
      query: () => ({
        url: `${USERS_URL}/players`,
        credentials: 'include',
      }),
      providesTags: ['Player'],
    }),

    // GET single player → /api/admin/:id
    getPlayerById: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        credentials: 'include',
      }),
      providesTags: ['Player'],
    }),

    updatePlayer: builder.mutation({
      query: ({ id, data }) => ({
        url: `${USERS_URL}/${id}`,
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['Player'],
    }),

    deletePlayer: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Player'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useAddPlayerMutation,
  useGetPlayersQuery,
  useGetPlayerByIdQuery,
  useUpdatePlayerMutation,
  useDeletePlayerMutation,
} = userApiSlice;
