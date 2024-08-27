import React, { useState } from "react";
import Settings from "./Settings";

const SettingsArea = ({ authUser, showSetting, setShowSetting }) => {
  const [settings, setSettings] = useState("Profile");

  const handleBack = () => {
    setShowSetting(false);
  };

  return (
    <div className="flex flex-row w-full">
      <div
        className={`${
          showSetting === true ? "hidden md:flex" : "flex"
        } flex-col w-full md:max-w-[18rem] h-screen md:w-1/2 shadow-lg border border-r-0 border-line px-3 `}
      >
        <div className="flex flex-row justify-between text-center border-b-2">
          <h2 className="text-2xl ml-4 mt-3 font-semibold text-center mb-3">
            Settings
          </h2>
        </div>

        <div className={`flex flex-col justify-start items-center mt-2`}>
          <span
            className={`text-lg p-3 hover:bg-line cursor-pointer w-full rounded-xl mt-1 ${
              settings === "Profile" ? "bg-line" : ""
            }`}
            onClick={() => {
              setSettings("Profile");
              setShowSetting(true);
            }}
          >
            Profile
          </span>
          <span
            className={`text-lg p-3 hover:bg-line cursor-pointer w-full rounded-xl mt-1 ${
              settings === "Account" ? "bg-line" : ""
            }`}
            onClick={() => {
              setSettings("Account");
              setShowSetting(true);
            }}
          >
            Account
          </span>
        </div>
      </div>
      <div
        className={`w-full ${
          showSetting === true ? "block" : "hidden"
        } md:block overflow-hidden`}
      >
        <Settings
          settings={settings}
          authUser={authUser}
          handleBack={handleBack}
        />
      </div>
    </div>
  );
};

export default SettingsArea;
