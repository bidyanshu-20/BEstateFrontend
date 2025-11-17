import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [formdata, setformdata] = useState({ username: "", email: "", password: "" }); // initialize fields
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
    if (!formdata.username || !formdata.email || !formdata.password) {
      seterror("All fields are required!");
      setloading(false);
      return;
    }

    try {
      const res = await fetch("https://b-estate-backend.vercel.app/api/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata), // now password is always sent
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
    } catch (err) {
      setloading(false);
      seterror(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white">
      <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center mb-8">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Username"
            id="username"
            value={formdata.username} // controlled input
            onChange={handleChange}
            className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            value={formdata.email} // controlled input
            onChange={handleChange}
            className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            value={formdata.password} // controlled input
            onChange={handleChange}
            className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />

          <button
            disabled={loading}
            className={`p-3 rounded-2xl uppercase font-semibold ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105"
            }`}
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>

          <OAuth />
        </form>

        <div className="flex justify-center items-center gap-2 mt-6 text-gray-300 text-sm">
          <p>Already have an account?</p>
          <Link to="/signin">
            <span className="text-cyan-400 font-semibold hover:underline cursor-pointer">
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
