import React, { useState } from "react";
import { useFetchMessages } from "../hooks/useMessages";
import play from "../assets/play.svg";

const Media = ({ conversation, authUser }) => {
  const [modalImg, setModalImg] = useState(null);
  const [modalVideo, setModalVideo] = useState(null);
  const participant = conversation?.participants.find(
    (participant) => participant._id !== authUser._id
  );

  const isImage = (url) => {
    return url.match(/\.(jpeg|jpg|gif |png)$/) != null;
  };

  const isVideo = (url) => {
    return url.match(/\.(mp4|mkv|mov)$/) != null;
  };

  const { fetchedMessages } = useFetchMessages(participant?._id);

  return (
    <div className="flex flex-col mt-2">
      <h1 className="text-2xl font-semibold text-text-1 ml-3">Media</h1>
      <div className="flex flex-wrap gap-1 justify-center mt-2">
        {fetchedMessages?.map(
          (message) =>
            message.media &&
            (isImage(message.media) ? (
              <img
                key={message._id}
                src={message.media}
                alt="media"
                onClick={() => {
                  setModalImg(message.media);
                  document.getElementById("my_modal_1").showModal();
                }}
                className="h-32 w-32 rounded-md object-cover cursor-pointer"
              />
            ) : isVideo(message.media) ? (
              <div
                key={message._id}
                className="relative"
                onClick={() => {
                  setModalVideo(message.media);
                  document.getElementById("my_modal_1").showModal();
                }}
              >
                <video
                  key={message._id}
                  src={message.media}
                  alt="media"
                  className="h-32 w-32 rounded-md object-cover cursor-pointer"
                >
                  <source src={message.media} type="video/mp4" />
                </video>
                <img
                  src={play}
                  className="cursor-pointer absolute bottom-1/2 right-1/2 transform translate-x-1/2 translate-y-1/2"
                  alt="play video"
                />
              </div>
            ) : null)
        )}
      </div>
      <dialog id="my_modal_1" className="modal w-screen h-screen">
        <div className="modal-box bg-transparent shadow-none">
          {modalImg && (
            <img src={modalImg} alt="modal" className="w-full rounded-md" />
          )}
          {modalVideo && (
            <video
              src={modalVideo}
              disablePictureInPicture
              controlsList="nodownload noremoteplayback noplaybackrate autoplay"
              alt="modal"
              className="w-full h-full rounded-md"
              controls
              autoplay
            >
              <source src={modalVideo} type="video/mp4" />
            </video>
          )}
        </div>
        <form method="dialog" className="modal-backdrop backdrop-blur-xl">
          <button
            onClick={() => document.getElementById("my_modal_1").close()}
          ></button>
        </form>
      </dialog>
    </div>
  );
};

export default Media;
