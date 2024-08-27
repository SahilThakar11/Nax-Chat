import React, { useState } from "react";
import Navbar from "../components/containers/Navbar";
import ConversationsArea from "../components/containers/ConversationsArea";
import MessageArea from "../components/containers/MessageArea";
import MediaArea from "../components/containers/MediaArea";

const Chat = ({ authUser }) => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showMediaTab, setShowMediaTab] = useState(false);
  return (
    <div className="flex flex-row">
      <Navbar
        authUser={authUser.user}
        selectedConversation={selectedConversation}
      />
      <ConversationsArea
        authUser={authUser.user}
        onSelectConversation={setSelectedConversation}
        selectedConversation={selectedConversation}
      />
      <MessageArea
        authUser={authUser.user}
        conversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
        setShowMediaTab={setShowMediaTab}
        showMediaTab={showMediaTab}
      />
      <MediaArea
        authUser={authUser.user}
        conversation={selectedConversation}
        showMediaTab={showMediaTab}
        setShowMediaTab={setShowMediaTab}
      />
    </div>
  );
};

export default Chat;
