import React, { useState } from "react";
import camera from "../assets/camera.svg";
import { useUpdateProfile } from "../hooks/useSettings";

const Profile = ({ authUser }) => {
  const [FullName, setFullName] = useState(authUser?.fullname);
  const [Bio, setBio] = useState(authUser?.bio);
  const [profileDisplay, setProfileDisplay] = useState(authUser?.profileImg);
  const [profileImg, setProfileImg] = useState(null);

  const { updateProfile } = useUpdateProfile();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImg(reader.result);
        setProfileDisplay(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (profileImg) {
      updateProfile({ fullname: FullName, bio: Bio, profileImg });
    } else {
      updateProfile({ fullname: FullName, bio: Bio });
    }
  };

  return (
    <div className=" flex items-center justify-center">
      <div className="card w-full max-w-xl">
        <div className="card-body">
          <div className="flex items-center justify-center mb-6 relative">
            <div className="avatar">
              <div className="w-48 rounded-md ring ring-gray-300 ring-offset-base-100 ring-offset-2 bg-primary">
                {profileDisplay ? (
                  <img
                    src={profileDisplay}
                    alt="profile"
                    className="w-full h-full rounded-md"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-7xl text-white">
                    <span>{authUser?.fullname[0]}</span>
                  </div>
                )}
              </div>
            </div>
            <button className="absolute -bottom-7 right-[13.5rem] p-2 bg-gray-100 border-2 rounded-full text-white cursor-pointer">
              <input
                type="file"
                accept="image/*"
                id="fileInput"
                style={{ display: "none" }}
                onChange={(e) => handleImageChange(e)}
                className="cursor-pointer"
              />
              <label htmlFor="fileInput">
                <img src={camera} alt="camera" className="w-8 cursor-pointer" />
              </label>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <div>
                <span className="div-text text-gray-700">Full Name</span>
              </div>
              <input
                type="text"
                name="fullname"
                placeholder="Enter your full name"
                className="input input-bordered w-full bg-gray-50"
                value={FullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="form-control mb-4">
              <div>
                <span className="div-text text-gray-700">Username</span>
              </div>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                className="input input-bordered w-full bg-gray-50"
                value={`@${authUser?.username}`}
                disabled
              />
            </div>
            <div className="form-control mb-4">
              <div>
                <span className="div-text text-gray-700">Email</span>
              </div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="input input-bordered w-full bg-gray-50"
                value={authUser?.email}
                disabled
              />
            </div>
            <div className="form-control mb-4">
              <div>
                <span className="div-text text-gray-700">Bio</span>
              </div>
              <textarea
                placeholder="Enter your bio."
                name="bio"
                className=" textarea textarea-bordered w-full bg-gray-50"
                value={Bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center mt-10">
              <button type="submit" className="btn btn-primary w-full">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
