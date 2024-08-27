import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async ({ fullname, bio, profileImg }) => {
      const response = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname, bio, profileImg }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      return data;
    },
    onSuccess: (data) => {
      toast.success("Profile updated successfully!");
      queryClient.setQueriesData(["authUser"], (oldData) => {
        return {
          ...oldData,
          user: {
            ...oldData.user,
            fullname: data.fullname,
            bio: data.bio,
            profileImg: data.profileImg,
          },
        };
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { updateProfile: mutate };
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
      confirmNewPassword,
    }) => {
      const response = await fetch("/api/user/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Account updated successfully!");
      queryClient.setQueriesData(["authUser"], (oldData) => {
        return {
          ...oldData,
          user: {
            ...oldData.user,
          },
        };
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { updateAccount: mutate };
};
