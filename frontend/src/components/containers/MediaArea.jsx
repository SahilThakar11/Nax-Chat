import React, { useState } from "react";
import Media from "../Media";
import Links from "../Links";
import back from "../../assets/back.svg";

const MediaArea = ({
  conversation,
  authUser,
  setShowMediaTab,
  showMediaTab,
}) => {
  const [activeTab, setActiveTab] = useState("Media");

  const handleBack = () => {
    setShowMediaTab(false);
  };

  return (
    <div
      className={`  ${showMediaTab === false ? "hidden" : "w-full"} ${
        conversation ? "xl:flex" : "hidden"
      } flex-col xl:w-1/3 h-screen`}
    >
      <button
        className="xl:hidden"
        onClick={(e) => {
          e.preventDefault();
          handleBack();
        }}
      >
        <img src={back} alt="back" />
      </button>
      <div role="tablist" className="tabs tabs-boxed">
        <a
          role="tab"
          onClick={() => setActiveTab("Media")}
          className={`tab ${activeTab === "Media" ? "tab-active" : ""}`}
        >
          Media
        </a>
        <a
          role="tab"
          onClick={() => setActiveTab("Links")}
          className={`tab ${activeTab === "Links" ? "tab-active" : ""}`}
        >
          Links
        </a>
      </div>
      <div className="overflow-y-auto flex-1 scroll-container mb-2 select-none">
        {activeTab === "Media" && (
          <Media conversation={conversation} authUser={authUser} />
        )}
        {activeTab === "Links" && (
          <Links authUser={authUser} conversation={conversation} />
        )}
      </div>
    </div>
  );
};

export default MediaArea;
