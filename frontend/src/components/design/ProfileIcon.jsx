import React from "react";

const ProfileIcon = ({ text, isOnline }) => {
  return (
    <div
      className={`avatar placeholder -mt-5 flex justify-center ${
        isOnline ? "online pt-2 pr-2 -mt-7 -mr-2" : ""
      }`}
    >
      <div className="bg-primary text-neutral-content w-12 h-12 rounded-lg cursor-pointer online">
        <span className="text-2xl font-semibold">{text.toUpperCase()}</span>
      </div>
    </div>
  );
};

export default ProfileIcon;
