import React from "react";
import { useFetchMessages } from "../hooks/useMessages";

const Links = ({ authUser, conversation }) => {
  const participant = conversation?.participants.find(
    (participant) => participant._id !== authUser._id
  );

  const { fetchedMessages } = useFetchMessages(participant?._id);

  return (
    <div className="flex flex-col mt-2">
      <h1 className="text-2xl font-semibold text-text-1 ml-3">Links</h1>
      <div className="flex flex-col justify-center">
        {fetchedMessages?.map(
          (message) =>
            message?.link && (
              <div
                key={message?._id}
                className="p-2 mt-4 px-3 text-center justify-start items-center flex mx-3 bg-line text-blue-500 rounded-lg"
              >
                <a
                  key={message?._id}
                  href={message?.link}
                  target="__blank"
                  className="cursor-pointer hover:underline"
                >
                  {message?.link}
                </a>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default Links;
