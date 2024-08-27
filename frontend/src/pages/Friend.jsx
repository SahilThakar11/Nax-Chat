import Navbar from "../components/containers/Navbar";
import check from "../assets/check.svg";
import cancel from "../assets/cancel.svg";
import ProfileIcon from "../components/design/ProfileIcon";
import { useEffect, useState } from "react";

import {
  useSentFriendRequest,
  useAcceptFriendRequest,
  useCancelFriendRequest,
  useRejectFriendRequest,
  useUnfriend,
  useGetUsers,
} from "../hooks/useFriendRequest";

import { useGetUserById } from "../hooks/useGetUserById";

const Friend = ({ authUser }) => {
  const { sendFriendRequest } = useSentFriendRequest();
  const { acceptFriendRequest } = useAcceptFriendRequest();
  const { cancelFriendRequest } = useCancelFriendRequest();
  const { rejectFriendRequest } = useRejectFriendRequest();
  const { unfriend } = useUnfriend();
  const [search, setSearch] = useState("");
  const { searchedUsers } = useGetUsers(search);
  const [selectedTab, setSelectedTab] = useState("friendRequest");

  return (
    <div className="flex flex-row max-h-screen overflow-hidden justify-center">
      <Navbar authUser={authUser} />
      <div className="flex flex-col w-full">
        <h1 className="text-3xl font-semibold ml-5 pb-2 border-b-2 text-text-1">
          Friends
        </h1>
        <div role="tablist" className="tabs tabs-boxed mt-5 items-center">
          <a
            role="tab"
            className={`tab ${selectedTab === "friendRequest" && "tab-active"}`}
            onClick={() => setSelectedTab("friendRequest")}
          >
            Request
          </a>
          <a
            role="tab"
            className={`tab ${selectedTab === "findFriends" && "tab-active"}`}
            onClick={() => setSelectedTab("findFriends")}
          >
            Find
          </a>
          <a
            role="tab"
            className={`tab ${selectedTab === "allFriends" && "tab-active"}`}
            onClick={() => setSelectedTab("allFriends")}
          >
            All
          </a>
        </div>
        <div className="flex flex-col md:flex-row mt-2 h-full">
          <div
            className={`${
              selectedTab === "friendRequest" ? "flex" : "hidden"
            } flex-col w-full  overflow-auto scroll-container`}
          >
            <h1 className="text-lg mx-auto font-semibold">
              Friend Requests ({authUser.receivedRequests.length})
            </h1>
            {authUser && authUser.receivedRequests.length !== 0 ? (
              authUser.receivedRequests.map((request) => {
                const { user } = useGetUserById(request);
                return (
                  user && (
                    <div className="flex flex-row justify-center" key={request}>
                      <div className="mt-10">
                        <ProfileIcon text={user.username[0]} />
                      </div>
                      <div className="flex flex-col mt-5 ml-5">
                        <h1 className="text-lg font-semibold">
                          {user.fullname}
                        </h1>
                        <p className="text-sm">@{user.username}</p>
                      </div>
                      <div className="flex justify-end items-center mt-5 ml-2 mr-2">
                        <button
                          className="w-7 h-7 rounded-full hover:bg-green-100 hover:border-green-400 hover:border-2 transition-colors duration-300"
                          onClick={() => acceptFriendRequest(request)}
                        >
                          <img src={check} alt="confirm" />
                        </button>
                        <button
                          className="w-7 h-7 rounded-full hover:bg-red-100 hover:border-red-400 hover:border-2 ml-2 transition-colors duration-300"
                          onClick={() => rejectFriendRequest(request)}
                        >
                          <img src={cancel} alt="reject" />
                        </button>
                      </div>
                    </div>
                  )
                );
              })
            ) : (
              <p className="text-text-3 text-center mx-7 mt-10">
                No Pending Requests Found!
              </p>
            )}
          </div>

          <div
            className={`${
              selectedTab === "findFriends" ? "flex" : "hidden"
            } mt-10 w-full overflow-auto scroll-container`}
          >
            <div className="flex flex-col w-full justify-start items-center">
              <h1 className="text-lg mx-auto font-semibold">Find Friends</h1>
              <div className="flex text-text-1 items-start justify-center">
                <input
                  type="search"
                  placeholder="Search Friends By Username"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex items-center h-10 border-2 border-line rounded-lg w-full mt-3 focus:outline-none px-3"
                />
              </div>
              {searchedUsers && searchedUsers.length !== 0 ? (
                searchedUsers.map(
                  (user) =>
                    user._id !== authUser._id && (
                      <div
                        className="flex flex-row justify-center"
                        key={user._id}
                      >
                        <div className="mt-10">
                          <ProfileIcon text={user.username[0]} />
                        </div>
                        <div className="flex flex-col mt-5 ml-5">
                          <h1 className="text-lg font-semibold text-text-3">
                            {user.fullname}
                          </h1>
                          <p className="text-sm">@{user.username}</p>
                        </div>
                        <div className="flex justify-end items-center mt-5 ml-2 mr-2">
                          {authUser.sentRequests.includes(user._id) && (
                            <button
                              className="rounded-md ml-4 btn bg-red-100 hover:bg-red-300 hover:border-red-400 border-red-400 hover:border-2 transition-colors duration-300"
                              onClick={() => cancelFriendRequest(user._id)}
                            >
                              Cancel Request
                            </button>
                          )}
                          {!authUser.friends.includes(user._id) &&
                            !authUser.sentRequests.includes(user._id) && (
                              <button
                                className="rounded-md ml-4 btn btn-success bg-green-100 border-green-400 hover:border-2 transition-colors duration-300"
                                onClick={() => sendFriendRequest(user._id)}
                              >
                                Send Request
                              </button>
                            )}
                          {authUser.friends.includes(user._id) && (
                            <button
                              className="rounded-md ml-4 btn bg-red-100 hover:bg-red-300 hover:border-red-400 border-red-400 hover:border-2 transition-colors duration-300"
                              onClick={() => unfriend(user._id)}
                            >
                              Unfriend
                            </button>
                          )}
                        </div>
                      </div>
                    )
                )
              ) : (
                <p className="text-text-3 mt-10">No Matching Results Found!</p>
              )}
            </div>
          </div>

          <div
            className={`${
              selectedTab === "allFriends" ? "flex" : "hidden"
            } mt-10 flex-col items-center overflow-auto w-full  scroll-container`}
          >
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-lg mx-auto font-semibold">All Friends</h1>
            </div>

            {authUser && authUser.friends.length !== 0 ? (
              authUser.friends.map((friend) => {
                const { user } = useGetUserById(friend);
                return (
                  user && (
                    <div
                      className="flex flex-row justify-center items-center border-b-2 pb-3 ml-2"
                      key={user._id}
                    >
                      <div className="mt-10">
                        <ProfileIcon text={user.username[0]} />
                      </div>
                      <div className="flex flex-col mt-5 ml-5">
                        <h1 className="text-lg font-semibold">
                          {user.fullname}
                        </h1>
                        <p className="text-sm">@{user.username}</p>
                      </div>
                      <div className="flex items-center mt-5 ml-2 mr-2">
                        <button
                          className="btn rounded-md bg-red-100 hover:bg-red-300 border-red-400 hover:border-2 ml-2 transition-colors duration-300"
                          onClick={() => unfriend(friend)}
                        >
                          Unfriend
                        </button>
                      </div>
                    </div>
                  )
                );
              })
            ) : (
              <p className="text-text-3 text-center mx-7 mt-10">
                No Friends Found!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friend;
