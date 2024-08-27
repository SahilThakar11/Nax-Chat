import React from "react";
import Conversation from "./Conversation";
import ConversationSkeleton from "./skeletons/ConversationSkeleton";

const Conversations = ({
  conversations,
  isLoading,
  conversationsCount,
  authUser,
  onSelectConversation,
}) => {
  if (isLoading) {
    return (
      <div>
        <ConversationSkeleton count={conversationsCount} />
      </div>
    );
  }

  if (conversationsCount === 0) {
    return (
      <div className="flex justify-center items-center mt-10">
        <div>
          <h2 className="text-xl font-semibold text-center">
            No Conversations
          </h2>
          <p className="text-text-3 text-center mx-10">
            Create a new conversation to start chatting!!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {conversations.map((conversation) => {
        const filteredParticipants = conversation.participants.filter(
          (participant) => participant._id !== authUser._id
        );

        return filteredParticipants.map((participant) => (
          <Conversation
            key={`${conversation._id}-${participant?._id}`}
            participant={participant}
            conversation={conversation}
            isLoading={isLoading}
            onSelectConversation={() => onSelectConversation(conversation)}
          />
        ));
      })}
    </div>
  );
};

export default Conversations;
