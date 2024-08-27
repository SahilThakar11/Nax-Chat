import React from "react";
import { Link } from "react-router-dom";
import chat from "../../assets/chat.svg";
import notification from "../../assets/notification.svg";
import user from "../../assets/user.svg";
import settings from "../../assets/settings.svg";
import logoutImg from "../../assets/logout.svg";

import { useLogout } from "../../hooks/useLogout";
import ProfileIcon from "../design/ProfileIcon";
import ProfileImg from "../design/ProfileImg";

const Navbar = ({ authUser, selectedConversation, showSetting }) => {
  const { logout } = useLogout();

  return (
    <div
      className={`${
        selectedConversation || showSetting ? "hidden md:flex" : "flex"
      } flex-col h-screen w-1/5 max-w-20 border-l-0 shadow-xl shadow-line`}
    >
      {authUser &&
        (authUser.profileImg ? (
          <div className="mx-auto mt-3">
            <ProfileImg src={authUser.profileImg} />
          </div>
        ) : (
          <div className="mt-10">
            <ProfileIcon text={authUser.username[0]} />
          </div>
        ))}
      <div className="flex flex-col items-center mt-5 ">
        <div className="mt-5 tooltip tooltip-right" data-tip="Chat">
          <Link to="/chat">
            {" "}
            <img src={chat} alt="chat-icon" className="cursor-pointer" />
          </Link>{" "}
        </div>
        <div className="mt-5 tooltip tooltip-right" data-tip="Notifications">
          <Link to="/notifications">
            <img
              src={notification}
              alt="notification-icon"
              className=" cursor-pointer"
            />
          </Link>
        </div>
        <div className="mt-5 tooltip tooltip-right" data-tip="Friends">
          <Link to="/friends">
            {" "}
            <img src={user} alt="user-icon" className="cursor-pointer" />
          </Link>{" "}
        </div>
        <div className="mt-5 tooltip tooltip-right" data-tip="Settings">
          <Link to="/settings">
            {" "}
            <img
              src={settings}
              alt="settings-icon"
              className="cursor-pointer"
            />
          </Link>{" "}
        </div>
      </div>
      <div className="flex h-full justify-center items-end mb-5 ">
        <div className="tooltip" data-tip="logout">
          <button
            className="mt-5"
            onClick={() => {
              logout();
            }}
          >
            <img src={logoutImg} alt="logout-icon" className="cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
