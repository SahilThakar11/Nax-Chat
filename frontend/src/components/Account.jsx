import React, { useState } from "react";
import { useUpdateAccount } from "../hooks/useSettings";
import { set } from "mongoose";

const AccountSettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { updateAccount } = useUpdateAccount();

  const handleSubmit = (e) => {
    e.preventDefault();
    updateAccount({
      currentPassword,
      newPassword,
      confirmNewPassword: confirmPassword,
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className=" flex items-center justify-center">
      <div className="card w-full max-w-lg ">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Change Password
              </h3>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-gray-700">
                    Current Password
                  </span>
                </label>
                <input
                  type="password"
                  autoComplete="false"
                  placeholder="Enter current password"
                  className="input input-bordered w-full bg-gray-50"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text text-gray-700">New Password</span>
                </label>
                <input
                  type="password"
                  autoComplete="false"
                  placeholder="Enter new password"
                  className="input input-bordered w-full bg-gray-50"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700">
                    Confirm New Password
                  </span>
                </label>
                <input
                  type="password"
                  autoComplete="false"
                  placeholder="Confirm new password"
                  className="input input-bordered w-full bg-gray-50"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="-mt-4">
              <button type="submit" className="btn btn-primary w-full">
                Save Changes
              </button>
            </div>
          </form>
          {/* <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Delete Account
            </h3>
            <p className="text-sm text-red-600 mb-4">
              This action cannot be undone. Make sure you really want to delete
              your account.
            </p>
            <button
              className="btn btn-error text-white w-full"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
