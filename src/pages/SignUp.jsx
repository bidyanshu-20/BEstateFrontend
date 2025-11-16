import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [formdata, setformdata] = useState({});
  const [error, seterror] = useState(null);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setformdata({
      ...formdata,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (data.success === false) {
        seterror(data.message);
        setloading(false);
        return;
      }
      setloading(false);
      seterror(null);
      navigate("/signin");
    } catch (error) {
      setloading(false);
      seterror(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-3xl p-10 w-full max-w-md transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,255,255,0.2)]">
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-8">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Username"
            className="bg-white/10 border border-white/20 text-white placeholder-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
            id="username"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            className="bg-white/10 border border-white/20 text-white placeholder-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-white/10 border border-white/20 text-white placeholder-gray-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
            id="password"
            onChange={handleChange}
          />

          <button
            disabled={loading}
            className={`relative overflow-hidden text-white p-3 rounded-2xl uppercase font-semibold transition-all duration-500 ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]"
            }`}
          >
            {loading ? (
              <span className="flex justify-center items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Loading...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>

          <OAuth />
        </form>

        <div className="flex justify-center items-center gap-2 mt-6 text-gray-300 text-sm">
          <p>Already have an account?</p>
          <Link to={"/signin"}>
            <span className="text-cyan-400 font-semibold hover:underline hover:text-cyan-300 transition-all cursor-pointer">
              Sign In
            </span>
          </Link>
        </div>

        {error && (
          <p className="mt-4 text-red-500 text-center text-sm bg-red-500/10 border border-red-500/20 rounded-xl py-2">
            ⚠️ {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default SignUp;
