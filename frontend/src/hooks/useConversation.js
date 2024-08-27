import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetConversations = () => {
  const {
    data: conversations,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/conversation/all");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }

        const sortedConversation = data.conversations.sort((a, b) => {
          const aDate = new Date(a.updatedAt);
          const bDate = new Date(b.updatedAt);
          return bDate - aDate;
        });

        return sortedConversation;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    retry: false,
  });
  return {
    conversations,
    conversationsCount: conversations ? conversations.length : 0,
    isLoading: isLoading || isRefetching,
  };
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  const { mutate: createConversation } = useMutation({
    mutationFn: async (rId) => {
      try {
        const response = await fetch(
          `/api/conversation/create-conversation/${rId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }

        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { createConversation };
};
