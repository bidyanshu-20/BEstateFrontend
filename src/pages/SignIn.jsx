import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInfailure, signInsuccess } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const [formdata, setformdata] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setformdata({
      ...formdata,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInfailure(data.message));
        return;
      }
      dispatch(signInsuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInfailure(error.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white p-4 relative overflow-hidden">
      {/* Glowing background effect */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-700/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-700/30 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Sign-in Card */}
      <div className="relative z-10 bg-black/40 backdrop-blur-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] rounded-3xl p-10 max-w-md w-full border border-gray-700/50 transition-all duration-300 hover:shadow-[0_0_35px_rgba(0,102,255,0.6)]">
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Enter your email"
            className="border border-gray-600 p-4 rounded-2xl bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            id="email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="border border-gray-600 p-4 rounded-2xl bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            id="password"
            onChange={handleChange}
            required
          />

          <button
            disabled={loading}
            className={`p-3 rounded-2xl uppercase font-semibold transition-all duration-300 ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            }`}
          >
            {loading ? "Logging In..." : "Sign In"}
          </button>

          <div className="flex items-center justify-center text-gray-400 text-sm">
            <span className="border-t border-gray-600 w-1/4"></span>
            <span className="px-3">or</span>
            <span className="border-t border-gray-600 w-1/4"></span>
          </div>

          <OAuth />
        </form>

        <div className="flex justify-center items-center gap-2 mt-6 text-gray-400 text-sm">
          <p>Don’t have an account?</p>
          <Link to={"/signup"}>
            <span className="text-blue-400 font-semibold hover:text-purple-400 transition-all duration-300 cursor-pointer">
              Sign Up
            </span>
          </Link>
        </div>

        {error && (
          <p className="text-red-500 text-center text-sm mt-4 animate-pulse">
            ⚠️ Error: {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default SignIn;
