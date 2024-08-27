import { useQuery } from "@tanstack/react-query";

export const useGetUserById = (id) => {
  const {
    data: user,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await fetch(`/api/user/${id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      return data.user;
    },
    retry: false,
  });
  return { user, isLoading: isLoading || isRefetching };
};
