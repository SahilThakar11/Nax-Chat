import React from "react";
import Profile from "../Profile";
import AccountSettings from "../Account";
import back from "../../assets/back.svg";
const Settings = ({ settings, authUser, handleBack }) => {
  return (
    <div className="flex flex-col justify-start md:justify-center ml-5 mr-5 ">
      <div className="flex border-b-2 w-full">
        <img
          src={back}
          alt="back-icon"
          className="mt-3 h-6 md:hidden"
          onClick={handleBack}
        />

        <h1 className="text-3xl font-semibold mt-1 ml-[30%] md:ml-0 mb-2 w-full mx-auto">
          {settings}
        </h1>
      </div>
      <div className="mt-2 ">
        {settings === "Profile" && <Profile authUser={authUser} />}
        {settings === "Account" && <AccountSettings authUser={authUser} />}
      </div>
    </div>
  );
};

export default Settings;
