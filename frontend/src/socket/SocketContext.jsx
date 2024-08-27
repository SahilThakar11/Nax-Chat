import { createContext, useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import { useAuth } from "../hooks/useAuth";

export const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [socketMessages, setSocketMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuth();

  useEffect(() => {
    if (authUser) {
      const socket = io("http://localhost:5000", {
        query: { userId: authUser.user._id },
      });
      setSocket(socket);

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        socket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        socketMessages,
        setSocketMessages,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
