import React from "react";
import Navbar from "../components/containers/Navbar";
import trash from "../assets/trash.svg";

import {
  useGetNotifications,
  useDeleteNotification,
} from "../hooks/useNotification";

const Notification = ({ authUser }) => {
  const { notifications } = useGetNotifications();
  const { deleteNotification } = useDeleteNotification();

  return (
    <div className="flex ">
      <Navbar authUser={authUser.user} />
      <div className="flex flex-col w-full h-screen  border border-r-0 border-line px-3 overflow-auto scroll-container">
        <div className="flex flex-row justify-between text-center border-b-2">
          <h2 className="text-2xl ml-4 mt-3 font-semibold text-center mb-3">
            Notifications
          </h2>
        </div>
        {notifications && notifications.length !== 0 ? (
          notifications?.map((notification) => (
            <div
              key={notification._id}
              className="flex flex-row text-lg p-3 hover:bg-line cursor-pointer w-full rounded-xl mt-1"
            >
              <div className="flex-grow">
                <span>{notification.message}</span>
              </div>
              <div className="flex justify-end items-end">
                <button
                  className=" bg-danger p-1 rounded-lg "
                  onClick={() => deleteNotification(notification._id)}
                >
                  <img src={trash} alt="delete" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-5">No Notifications Yet.</p>
        )}
      </div>
    </div>
  );
};

export default Notification;
