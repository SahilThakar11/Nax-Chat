import { useQuery } from "@tanstack/react-query";

export const useAuth = () => {
  const {
    data: authUser,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/auth/getMe");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    retry: false,
  });
  return { authUser, isLoading: isLoading || isRefetching };
};
