import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { IoMenu, IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTern, setsearchTern] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTern", searchTern);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTernFromUrl = urlParams.get("searchTern");
    if (searchTernFromUrl) {
      setsearchTern(searchTernFromUrl);
    }
  }, [location.search]);

  return (
    <header className="w-full bg-gradient-to-r from-blue-900/70 via-indigo-800/60 to-purple-800/70 shadow-lg shadow-black/40 border-b border-white/20 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      
      {/* Left - Logo */}
      <Link to="/" className="group flex items-center gap-1">
        <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 drop-shadow-md transition-transform duration-300 group-hover:scale-105">
          BΞstate
        </span>
      </Link>

      {/* Mobile Hamburger */}
      <button
        className="sm:hidden text-white text-3xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <IoClose /> : <IoMenu />}
      </button>

      {/* Middle - Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="hidden sm:flex items-center border border-white/20 bg-white/10 backdrop-blur-md rounded-full w-full max-w-md hover:bg-white/20 transition-all duration-300 mx-4"
      >
        <input
          type="text"
          placeholder="Search listings..."
          className="w-full bg-transparent text-white placeholder-gray-300 px-4 py-2 rounded-l-full outline-none"
          value={searchTern}
          onChange={(e) => setsearchTern(e.target.value)}
        />
        <button className="px-4 py-2">
          <IoMdSearch
            size={22}
            className="text-cyan-300 hover:text-white transition-all duration-200"
          />
        </button>
      </form>

      {/* Right - Desktop Links */}
      <nav className="hidden sm:flex items-center gap-8">
        <div className="flex gap-8">
          <Link
            to="/"
            className="relative text-white/90 font-medium hover:text-white transition-all duration-200 
              after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-cyan-400 
              hover:after:w-full after:transition-all after:duration-300"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="relative text-white/90 font-medium hover:text-white transition-all duration-200
              after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-purple-400 
              hover:after:w-full after:transition-all after:duration-300"
          >
            About
          </Link>
        </div>

        {currentUser ? (
          <Link to="/profile" className="group">
            <img
              src={currentUser.avatar}
              alt="Profile"
              className="w-9 h-9 rounded-full border-2 border-cyan-400 shadow-md transition-all duration-300 group-hover:scale-110"
            />
          </Link>
        ) : (
          <Link
            to="/signin"
            className="text-sm font-semibold text-white bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-400 px-4 py-2 rounded-full shadow-md hover:opacity-90 transition-all duration-300"
          >
            Sign In
          </Link>
        )}
      </nav>

      {/* Mobile Slide-down Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-gradient-to-r from-blue-900/90 via-indigo-800/90 to-purple-800/90 backdrop-blur-md border-b border-white/20 flex flex-col items-center py-4 gap-6 sm:hidden">

          {/* Mobile Search */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center border border-white/20 bg-white/10 backdrop-blur-md rounded-full w-[90%] hover:bg-white/20 transition-all duration-300"
          >
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent text-white placeholder-gray-300 px-4 py-2 rounded-l-full outline-none"
              value={searchTern}
              onChange={(e) => setsearchTern(e.target.value)}
            />
            <button className="px-4 py-2">
              <IoMdSearch size={22} className="text-cyan-300" />
            </button>
          </form>

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-white/90 text-lg font-medium hover:text-white transition"
          >
            Home
          </Link>

          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="text-white/90 text-lg font-medium hover:text-white transition"
          >
            About
          </Link>

          {currentUser ? (
            <Link to="/profile" onClick={() => setMenuOpen(false)}>
              <img
                src={currentUser.avatar}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-cyan-400"
              />
            </Link>
          ) : (
            <Link
              to="/signin"
              onClick={() => setMenuOpen(false)}
              className="text-md font-semibold text-white bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-400 px-5 py-2 rounded-full"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
