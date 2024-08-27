import React from "react";
import ProfileIcon from "../design/ProfileIcon";
import Conversations from "../Conversations";

import {
  useGetConversations,
  useCreateConversation,
} from "../../hooks/useConversation";
import { useGetUserById } from "../../hooks/useGetUserById";

const ConversationsArea = ({
  authUser,
  onSelectConversation,
  selectedConversation,
}) => {
  const { conversations, isLoading, conversationsCount } =
    useGetConversations();
  const { createConversation } = useCreateConversation();

  const isConversationCreated = (friendId) => {
    return conversations?.some((conversation) =>
      conversation.participants.some(
        (participant) => participant._id === friendId
      )
    );
  };

  return (
    <div
      className={`${
        selectedConversation ? "hidden md:flex" : "flex"
      } flex-col w-full md:max-w-[21rem] h-screen md:w-1/2 shadow-lg border border-r-0 border-line`}
    >
      <div className="flex flex-row justify-between text-center border-b-2">
        <h2 className="text-2xl ml-4 mt-3 font-semibold text-center mb-5">
          <span>Conversations ({conversationsCount})</span>
        </h2>

        <button
          className=" bg-primary hover:bg-primary/90 text-white mt-3.5 w-8 h-8 rounded-lg mr-3 text-center text-xl pb-3"
          onClick={() => document.getElementById("my_modal_2").showModal()}
        >
          <span className="flex justify-center items-center font-bold">+</span>
        </button>
      </div>

      <div className="flex justify-start items-center w-full mx-auto overflow-auto scroll-container">
        <Conversations
          conversations={conversations}
          isLoading={isLoading}
          conversationsCount={conversationsCount}
          authUser={authUser}
          onSelectConversation={onSelectConversation}
        />
      </div>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <div className="modal-header">
            <h3 className="text-2xl font-semibold">All Friends</h3>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
          </div>
          <div className="modal-body">
            <div className="mt-3">
              {authUser.friends.length === 0 ? (
                <div className="text-center text-lg text-gray-500">
                  No friends yet, make some to chat.
                </div>
              ) : (
                authUser.friends.map((friend) => {
                  const { user } = useGetUserById(friend);
                  const conversationExists = isConversationCreated(friend);

                  return (
                    user && (
                      <div
                        key={user._id}
                        className="flex justify-start gap-5 items-center w-full mx-auto border-b-2 border-line p-2"
                      >
                        {user.profileImg ? (
                          <img
                            src={user.profileImg}
                            alt="profile-pic"
                            className="rounded-md w-12 mt-5"
                          />
                        ) : (
                          <div className="mt-10">
                            <ProfileIcon text={user.username[0]} />
                          </div>
                        )}
                        <div className="flex justify-start items-center mt-2">
                          <span className="ml-2 mr-2">{user.username}</span>
                        </div>
                        <button
                          className={`mt-3 text-white w-20 h-8 rounded-lg text-center text-sm ${
                            conversationExists
                              ? "bg-primary/70 cursor-not-allowed"
                              : "bg-primary hover:bg-primary/90"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            if (!conversationExists) {
                              createConversation(user._id);
                            }
                          }}
                          disabled={conversationExists}
                        >
                          <span className="font-bold">
                            {conversationExists ? "Created" : "+ Create"}
                          </span>
                        </button>
                      </div>
                    )
                  );
                })
              )}
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ConversationsArea;
