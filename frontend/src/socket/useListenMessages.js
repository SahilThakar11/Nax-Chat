import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useSocketContext } from "../socket/SocketContext";

export const useListenMessages = () => {
  const { socket, setSocketMessages } = useSocketContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    socket?.on("newMessage", (message) => {
      setSocketMessages((prevMessages) => [...prevMessages, message]);

      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["Messages"],
      });
      queryClient.invalidateQueries({
        queryKey: ["lastMessage", message.conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["Unread", message.conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["Links", message._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["Media", message._id],
      });
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [socket, setSocketMessages]);
};
