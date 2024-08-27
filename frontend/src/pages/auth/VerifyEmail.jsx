import React from "react";
import naxchat from "../../assets/nax-chat.png";
import { Link } from "react-router-dom";

const VerifyEmail = () => {
  return (
    <div className="pt-10 flex flex-col items-center justify-center ">
      <img src={naxchat} alt="Logo" className="h-40" />

      <div className="card w-full max-w-sm shadow-lg bg-white">
        <div className="card-body">
          <h2 className="card-title text-center text-2xl font-bold text-gray-800">
            Email Verification
          </h2>
          <p className="text-gray-600 text-center mt-4">
            Enter your password to verify your email address.
          </p>

          <form>
            <div className="form-control mt-2">
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="input input-bordered w-full bg-gray-50"
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary w-full">Verify Email</button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Already verified your email?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
