import React, { useState } from "react";
import naxchat from "../../assets/nax-chat.png";
import { Link } from "react-router-dom";

import { useRegister } from "../../hooks/useRegister";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
  });
  const { register, isError, errors, isPending } = useRegister();

  const handleSubmit = (e) => {
    e.preventDefault();
    register(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    errors[e.target.name] = "";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <img src={naxchat} alt="Logo" className="h-40 " />
      <div className="text-2xl mb-2 font-semibold text-text-1">
        Register to get started!
      </div>
      <div className="card w-full max-w-sm shadow-lg bg-white">
        <div className="card-body">
          <h2 className="card-title text-center text-2xl font-bold text-gray-800">
            Register
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-700">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                className="input input-bordered w-full bg-gray-50"
              />{" "}
              <div>
                {errors.fullname && (
                  <span className="text-danger text-md">{errors.fullname}</span>
                )}
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-700">Username</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Choose a username"
                className="input input-bordered w-full bg-gray-50"
              />{" "}
              <div>
                {errors.username && (
                  <span className="text-danger text-md">{errors.username}</span>
                )}
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-700">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="input input-bordered w-full bg-gray-50"
              />{" "}
              <div>
                {errors.email && (
                  <span className="text-danger text-md">{errors.email}</span>
                )}
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-700">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                className="input input-bordered w-full bg-gray-50"
              />
              <div>
                {errors.password && (
                  <span className="text-danger text-md">{errors.password}</span>
                )}
              </div>
            </div>
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary w-full">
                Register
              </button>
            </div>
          </form>

          {/* <div className="divider mt-6">or</div>

          <div className="form-control">
            <button className="btn btn-outline w-full flex items-center justify-center">
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Sign in with Google
            </button>
          </div> */}

          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
