import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetLastMessage = (id) => {
  const { data, isLoading } = useQuery({
    queryKey: ["lastMessage", id],
    queryFn: async () => {
      const response = await fetch(`/api/message/last-message/${id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error("An error occurred while fetching last message");
      }
      if (data.message.media && data.message.message === "") {
        data.message.message = "Media";
      }

      return data.message;
    },
    retry: false,
    enabled: !!id,
  });
  return { lastMessage: data, isLoading };
};
export const useSendMessage = () => {
  const { mutate } = useMutation({
    mutationFn: async ({ message, id, file }) => {
      const response = await fetch(`/api/message/send/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, file }),
      });
      if (!response.ok) {
        throw new Error("An error occurred while sending message");
      }
      const data = await response.json();
      return data;
    },
    onError: (error) => {
      console.error(error);
    },
  });
  return { sendMessage: mutate };
};

export const useFetchMessages = (id) => {
  const { data: fetchedMessages } = useQuery({
    queryKey: ["Messages", id],
    queryFn: async () => {
      const response = await fetch(`/api/message/fetch/${id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error("An error occurred while fetching messages");
      }
      return data.messages;
    },

    retry: false,
    enabled: !!id,
  });
  return { fetchedMessages };
};

export const useUnreadMessages = (id) => {
  const { data, isLoading } = useQuery({
    queryKey: ["Unread", id],
    queryFn: async () => {
      const response = await fetch(`/api/message/unread/${id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error("An error occurred while fetching unread messages");
      }
      return data.unreadMessages;
    },
    retry: false,
    enabled: !!id,
  });
  return { unreadMessages: data, isLoading };
};
