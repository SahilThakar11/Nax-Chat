import React from "react";

const ProfileImg = ({ src, isOnline }) => {
  return (
    <div
      className={`avatar placeholder w-14 h-14 ${isOnline ? "online " : ""}`}
    >
      <img src={src} alt="profile-pic" className="rounded-md mt-2" />
    </div>
  );
};

export default ProfileImg;
