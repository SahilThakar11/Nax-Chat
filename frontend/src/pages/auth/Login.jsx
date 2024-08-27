import React, { useState } from "react";
import naxchat from "../../assets/nax-chat.png";
import { Link } from "react-router-dom";

import { useLogin } from "../../hooks/useLogin";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { login, isError, errors, isPending } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    errors[e.target.name] = "";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <img src={naxchat} alt="Logo" className="h-40 " />
      <div className="text-2xl mb-2 font-semibold text-text-1">
        Welcome Back to Nax Chat!
      </div>

      <div className="card w-full max-w-sm shadow-lg bg-white">
        <div className="card-body">
          <h2 className="card-title text-center text-2xl font-bold text-gray-800">
            Login
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <div>
                {errors.email && (
                  <span className="text-md text-danger">{errors.email}</span>
                )}
              </div>

              <label className="label">
                <span className="label-text text-gray-700">Username</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className="input input-bordered w-full bg-gray-50"
              />
              <div>
                {errors.username && (
                  <span className="text-md text-danger">{errors.username}</span>
                )}
              </div>
            </div>
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text text-gray-700">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="input input-bordered w-full bg-gray-50"
              />
              <div>
                {errors.password && (
                  <span className="text-md text-danger">{errors.password}</span>
                )}
              </div>
              <div className="mt-4 text-start">
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot your password?
                </a>
              </div>
            </div>
            <div className="form-control mt-3">
              <button type="submit" className="btn btn-primary w-full">
                Login
              </button>
            </div>
          </form>
          <div className="divider mt-6">or</div>

          <div className="form-control">
            <button className="btn btn-outline w-full flex items-center justify-center">
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Sign in with Google
            </button>
          </div>

          <div className="mt-2 text-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
