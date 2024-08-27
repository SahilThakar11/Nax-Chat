import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export const useGetNotifications = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await fetch("/api/notification/");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      return data.notifications;
    },
  });
  return { notifications: data, isLoading, isError };
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async (notificationId) => {
      const response = await fetch(`/api/notification/${notificationId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      return data;
    },
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData(["notifications"], (oldData) =>
        oldData.filter((notification) => notification._id !== notificationId)
      );
      queryClient.setQueriesData(
        ["authUser"],
        (oldAuthUser) => {
          return {
            ...oldAuthUser,
            user: {
              ...oldAuthUser.user,
              notifications: oldAuthUser.user.notifications.filter(
                (notification) => notification._id !== notificationId
              ),
            },
          };
        },
        { exact: true }
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { deleteNotification: mutate, isPending, isError, error };
};
