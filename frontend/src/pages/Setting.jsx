import React, { useState } from "react";
import Navbar from "../components/containers/Navbar";
import SettingsArea from "../components/containers/SettingsArea";

const Settings = ({ authUser }) => {
  const [showSetting, setShowSetting] = useState(false);
  return (
    <div className="flex flex-row">
      <Navbar authUser={authUser.user} showSetting={showSetting} />
      <SettingsArea
        authUser={authUser.user}
        showSetting={showSetting}
        setShowSetting={setShowSetting}
      />
    </div>
  );
};

export default Settings;
