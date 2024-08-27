import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useSentFriendRequest = () => {
  const queryClient = useQueryClient();
  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async (friendId) => {
      const response = await fetch(`/api/friend/send-request/${friendId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("An error occurred while sending friend request");
      }

      return data;
    },
    onSuccess: (_, friendId) => {
      queryClient.setQueryData(["authUser"], (oldAuthUser) => {
        return {
          ...oldAuthUser,
          user: {
            ...oldAuthUser.user,
            sentRequests: [...oldAuthUser.user.sentRequests, friendId],
          },
        };
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { sendFriendRequest: mutate, isPending, isError, error };
};

export const useCancelFriendRequest = () => {
  const queryClient = useQueryClient();
  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async (friendId) => {
      const response = await fetch(`/api/friend/cancel-request/${friendId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("An error occurred while cancelling friend request");
      }

      return data;
    },
    onSuccess: (_, friendId) => {
      queryClient.setQueryData(["authUser"], (oldAuthUser) => {
        return {
          ...oldAuthUser,
          user: {
            ...oldAuthUser.user,
            sentRequests: oldAuthUser.user.sentRequests.filter(
              (id) => id !== friendId
            ),
          },
        };
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { cancelFriendRequest: mutate, isPending, isError, error };
};

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();
  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async (friendId) => {
      const response = await fetch(`/api/friend/accept-request/${friendId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("An error occurred while accepting friend request");
      }

      return data;
    },
    onSuccess: (_, friendId) => {
      queryClient.setQueryData(["authUser"], (oldAuthUser) => {
        return {
          ...oldAuthUser,
          user: {
            ...oldAuthUser.user,
            friends: [...oldAuthUser.user.friends, friendId],
            receivedRequests: oldAuthUser.user.receivedRequests.filter(
              (id) => id !== friendId
            ),
          },
        };
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { acceptFriendRequest: mutate, isPending, isError, error };
};

export const useRejectFriendRequest = () => {
  const queryClient = useQueryClient();
  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async (friendId) => {
      const response = await fetch(`/api/friend/reject-request/${friendId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("An error occurred while rejecting friend request");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["authUser"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { rejectFriendRequest: mutate, isPending, isError, error };
};

export const useUnfriend = () => {
  const queryClient = useQueryClient();
  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async (friendId) => {
      const response = await fetch(`/api/friend/unfriend/${friendId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("An error occurred while unfriending");
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["authUser"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { unfriend: mutate, isPending, isError, error };
};

export const useGetUsers = (search) => {
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["searchUser", search],
    queryFn: async () => {
      const response = await fetch(`/api/friend/search?search=${search}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      return data.users;
    },
    enabled: !!search,
  });
  return { searchedUsers: users, isLoading, isError, error };
};
