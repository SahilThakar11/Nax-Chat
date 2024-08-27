import React from "react";
import ProfileIcon from "./design/ProfileIcon";
import { useGetLastMessage, useUnreadMessages } from "../hooks/useMessages";
import { useSocketContext } from "../socket/SocketContext";
import ProfileImg from "./design/ProfileImg";

const Conversation = ({ participant, conversation, onSelectConversation }) => {
  const { lastMessage } = useGetLastMessage(conversation._id);
  const { unreadMessages } = useUnreadMessages(conversation._id);
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.find((user) => user === participant._id);
  return (
    <div onClick={onSelectConversation} className="cursor-pointer">
      <div className="flex flex-row p-4 border-b border-line cursor-pointer hover:bg-gray-50">
        <div className="flex">
          {participant.profileImg ? (
            <ProfileImg src={participant.profileImg} isOnline={isOnline} />
          ) : (
            <div className="mt-7">
              <ProfileIcon
                size="large"
                text={participant.username[0]}
                isOnline={isOnline}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col ml-4 mt-2 w-full ">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold">{participant.fullname}</h2>
            <p className="relative right-1 text-sm mt-1 text-text-3">
              {lastMessage?.updatedAt
                ? new Date(lastMessage.updatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </p>
          </div>
          <div className="flex justify-start">
            <p className="text-text-3">
              {lastMessage?.message?.length > 10 ? (
                <span>{lastMessage?.message?.slice(0, 15)}...</span>
              ) : (
                <span>{lastMessage?.message}</span>
              )}
            </p>
          </div>
          <div className="flex justify-end">
            {unreadMessages?.length > 0 && (
              <div className="w-7 h-7 ml-3 -mt-6 pt-0.5 font-bold text-white bg-danger rounded-full flex justify-center ">
                {unreadMessages?.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
