import React, { useEffect, useRef, useState } from "react";
import attachment from "../../assets/attachment.svg";
import send from "../../assets/send.svg";
import back from "../../assets/back.svg";
import chatWait from "../../assets/chat-wait.png";
import ProfileIcon from "../design/ProfileIcon";
import play from "../../assets/play.svg";

import { useSendMessage, useFetchMessages } from "../../hooks/useMessages";
import ProfileImg from "../design/ProfileImg";
import { useSocketContext } from "../../socket/SocketContext";
import { useListenMessages } from "../../socket/useListenMessages";

const MessageArea = ({
  conversation,
  authUser,
  setSelectedConversation,
  showMediaTab,
  setShowMediaTab,
}) => {
  const { onlineUsers, socketMessages, setSocketMessages } = useSocketContext();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { sendMessage } = useSendMessage();
  const lastMessageRef = useRef();

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [modalMedia, setModalMedia] = useState(null);

  useListenMessages();

  const participant = conversation?.participants.find(
    (participant) => participant._id !== authUser._id
  );

  const isOnline = onlineUsers.find((user) => user === participant?._id);

  const { fetchedMessages } = useFetchMessages(participant?._id);

  useEffect(() => {
    if (fetchedMessages) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  useEffect(() => {
    if (socketMessages?.length > 0) {
      setMessages((prevMessages) => {
        const existingMessageIds = new Set(prevMessages.map((msg) => msg._id));
        const newMessages = socketMessages.filter(
          (msg) => !existingMessageIds.has(msg._id)
        );
        return [...prevMessages, ...newMessages];
      });
      setSocketMessages([]);
    }
  }, [socketMessages]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "" && selectedMedia === null) return;

    if (selectedMedia) {
      sendMessage({ message, id: participant?._id, file: selectedMedia });
    } else {
      sendMessage({ message, id: participant?._id });
    }

    setMessage("");
    setSelectedMedia(null);
    setMediaPreview(null);
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedMedia(reader.result);
        const fileType = file.type.split("/")[0];
        if (fileType === "image") {
          setMediaPreview(
            <img
              src={reader.result}
              alt="Selected Media"
              className="h-16 w-16 object-cover rounded-lg"
            />
          );
        } else if (fileType === "video") {
          setMediaPreview(
            <video
              src={reader.result}
              controls
              className="h-16 w-16 object-cover rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveMedia = () => {
    setMediaPreview(null);
    setSelectedMedia(null);

    document.getElementById("file-input").value = "";
  };

  const isImage = (url) => {
    return (
      url &&
      (url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg"))
    );
  };
  const isVideo = (url) => {
    return (
      url &&
      (url.endsWith(".mp4") || url.endsWith(".mkv") || url.endsWith(".mov"))
    );
  };

  if (!conversation) {
    return (
      <div className="hidden md:flex flex-col w-full xl:w-1/2 h-screen border-r-1 shadow-lg justify-center items-center">
        <div className="flex flex-col ml-5 mr-5 justify-center items-center">
          <h1 className="text-5xl font-semibold text-center mb-3">
            Select a chat to Start Chatting!!
          </h1>
          <img src={chatWait} alt="chat-wait" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        key={participant._id}
        className={`${
          conversation ? "flex" : "hidden"
        } xl:flex flex-col w-full xl:w-1/2 h-screen border-r-1 shadow-lg ${
          showMediaTab === true && "hidden"
        }`}
      >
        <div className="relative mt-2 md:hidden mr-10">
          <img
            src={back}
            onClick={() => {
              setSelectedConversation(null);
              setShowMediaTab(false);
              setMessages([]);
            }}
          />
        </div>
        <div
          className="flex pl-5 pr-5 justify-start border-b-2 relative pt-5 pb-4 cursor-pointer xl:cursor-auto hover:bg-gray-100 xl:hover:bg-transparent"
          onClick={(e) => {
            e.preventDefault();
            setShowMediaTab(true);
          }}
        >
          {participant.profileImg ? (
            <div className="-mt-2">
              <ProfileImg src={participant.profileImg} isOnline={isOnline} />
            </div>
          ) : (
            <div className="mt-4">
              <ProfileIcon text={participant.username[0]} />
            </div>
          )}
          <div className="flex flex-col">
            <div className="text-text-1 font-semibold text-xl ml-2">
              {participant.fullname}
            </div>
            <div className="text-text-2 text-sm ml-2">{participant.bio}</div>
          </div>
          <div className="flex absolute right-0 h-10 gap-7 mr-4"></div>
        </div>

        <div className="flex flex-col ml-5 mt-5 overflow-auto scroll-container flex-grow">
          {messages.length === 0 && (
            <div className="flex justify-center items-center h-full">
              <h1 className="bg-chat p-3 rounded-md text-text-2 font-semibold">
                No Messages Yet! Start By Sending a message!
              </h1>
            </div>
          )}
          {messages?.map((message) => (
            <div
              key={message._id}
              ref={lastMessageRef}
              className={`chat ${
                message.senderId === participant._id ? "chat-start" : "chat-end"
              }`}
            >
              <div className="chat-header">
                {message.senderId === participant._id ? (
                  <span>{participant.fullname}</span>
                ) : (
                  <span>You</span>
                )}
                <time className="text-xs ml-2 opacity-40">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
              <div
                className={`chat-bubble ${
                  message.senderId === participant._id
                    ? "bg-chat text-text-1"
                    : "bg-primary text-white"
                } `}
              >
                {message.media && isImage(message.media) && (
                  <img
                    src={message.media}
                    alt="media"
                    onClick={() => {
                      setModalMedia(message.media);
                      document.getElementById("my_modal_3").showModal();
                    }}
                    className="w-72 h-72 mt-2 rounded-md object-cover cursor-pointer"
                  />
                )}

                {message.media && isVideo(message.media) && (
                  <div
                    className="raltive"
                    onClick={() => {
                      setModalMedia(message.media);
                      document.getElementById("my_modal_3").showModal();
                    }}
                  >
                    <video
                      disablePictureInPicture
                      disableRemotePlayback
                      controlsList="nodownload nopictureinpicture noplaybacksrate noremoteplayback noplaybackrate "
                      className="w-72 h-72 mt-2 rounded-md object-cover cursor-pointer"
                    >
                      <source src={message.media} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <img
                      src={play}
                      className="cursor-pointer absolute bottom-1/2 right-1/2 transform translate-x-1/2 translate-y-1/2"
                      alt="play video"
                    />
                  </div>
                )}

                {message.message && <p>{message.message}</p>}
              </div>
              <div className="chat-footer opacity-50">
                {message.senderId !== participant._id &&
                  (message.readBy.includes(participant._id) ? (
                    <span>Seen</span>
                  ) : (
                    <span>Sent</span>
                  ))}
              </div>
            </div>
          ))}
        </div>
        {mediaPreview && (
          <div className="flex items-center justify-between p-3 bg-gray-100 border-t-2 border-text-line">
            <div className="flex items-center">
              {mediaPreview}
              <button onClick={handleRemoveMedia} className="ml-3">
                ✕
              </button>
            </div>
          </div>
        )}
        <form onSubmit={handleSendMessage}>
          <div className="flex items-center justify-between p-3 border-t-2 border-text-line mt-auto">
            <label htmlFor="file-input">
              <img
                src={attachment}
                alt="attachment"
                className="mr-2 w-7 cursor-pointer"
              />
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleMediaChange}
              className="hidden"
              hidden
            />
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow p-2 rounded-lg border-2 border-text-line focus:outline-none"
            />
            <button type="submit" className="cursor-pointer ml-2">
              <img src={send} alt="send-icon" />
            </button>
          </div>
        </form>
        <dialog id="my_modal_3" className="modal w-screen h-screen">
          <div className="modal-box bg-transparent shadow-none">
            {modalMedia && isImage(modalMedia) && (
              <img
                src={modalMedia}
                alt="media"
                className="w-full h-full rounded-md"
              />
            )}
            {modalMedia && isVideo(modalMedia) && (
              <video
                controls
                autoPlay
                autoFocus
                disablePictureInPicture
                disableRemotePlayback
                controlsList="nodownload nopictureinpicture noplaybacksrate noremoteplayback noplaybackrate "
                className="w-full h-full object-cover rounded-md"
              >
                <source src={modalMedia} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <form method="dialog" className="modal-backdrop backdrop-blur-xl">
            <button
              onClick={() => document.getElementById("my_modal_3").close()}
            ></button>
          </form>
        </dialog>
      </div>
    </>
  );
};

export default MessageArea;
