import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserStart,
  signoutUserFailure,
  signoutUserSuccess,
} from "../redux/user/userSlice";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showlistingsError, setshowlistingsError] = useState(false);
  const [userlistings, setUserListings] = useState([]);

  const dispatch = useDispatch();
  const fileRef = useRef(null);

  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);

  const handleFileUpload = async (file) => {
    try {
      const formDataCloud = new FormData();
      formDataCloud.append("file", file);
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      formDataCloud.append("upload_preset", uploadPreset);
      formDataCloud.append("folder", "images");
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const api = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

      const res = await axios.post(api, formDataCloud, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setFilePerc(progress);
        },
      });

      const { secure_url } = res.data;
      setFormData((prev) => ({ ...prev, avatar: secure_url }));
      setFileError(false);
      setFilePerc(100);
    } catch (error) {
      setFileError(true);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        email: currentUser.email || "",
        password: "",
        avatar: currentUser.avatar || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(
        `https://b-estate-backend.vercel.app/api/user/update/${currentUser._id}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `https://b-estate-backend.vercel.app/api/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch(
        "https://b-estate-backend.vercel.app/api/auth/signout",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess(data));
    } catch (error) {
      dispatch(signoutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setshowlistingsError(false);
      const res = await fetch(
        `https://b-estate-backend.vercel.app/api/user/listings/${currentUser._id}`
      );
      const data = await res.json();
      if (data.success === false) {
        setshowlistingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setshowlistingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(
        `https://b-estate-backend.vercel.app/api/listing/delete/${listingId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success === false) return;
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-start pt-10 bg-gradient-to-br from-indigo-900 via-slate-900 to-gray-900 text-white relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-700 opacity-30 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-500 opacity-25 blur-3xl rounded-full animate-pulse"></div>

      <div className="relative z-10 w-[90%] md:w-[60%] bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
          👤 Profile Page
        </h1>

        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-5 items-center"
        >
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />

          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            className="h-24 w-24 rounded-full cursor-pointer shadow-md border-4 border-cyan-400 hover:scale-105 transition-all duration-300"
            alt="Profile"
          />

          {fileError && (
            <p className="text-red-400 text-sm">
              Error uploading image (max 2MB).
            </p>
          )}
          {filePerc > 0 && filePerc < 100 && (
            <p className="text-green-400 text-sm">{`Uploading ${filePerc}%`}</p>
          )}
          {filePerc === 100 && (
            <p className="text-green-500 text-sm">Upload complete!</p>
          )}

          <input
            className="w-full rounded-lg p-3 bg-white/20 text-white placeholder-gray-300 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            type="text"
            value={formData.username}
            id="username"
            placeholder="Username"
            onChange={handleChange}
          />
          <input
            className="w-full rounded-lg p-3 bg-white/20 text-white placeholder-gray-300 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            type="email"
            id="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            className="w-full rounded-lg p-3 bg-white/20 text-white placeholder-gray-300 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            type="password"
            id="password"
            value={formData.password}
            placeholder="New Password"
            onChange={handleChange}
          />

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition-all duration-200 shadow-md"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>

          <Link
            to="/createlisting"
            className="w-full bg-green-600 py-2 rounded-lg text-center font-semibold hover:bg-green-500 transition-all duration-200"
          >
            + Create Listing
          </Link>
        </form>

        <div className="flex justify-between mt-4 text-sm">
          <span
            onClick={handleDeleteUser}
            className="text-red-500 cursor-pointer hover:underline"
          >
            Delete Account
          </span>
          <span
            onClick={handleSignOut}
            className="text-yellow-400 cursor-pointer hover:underline"
          >
            Sign Out
          </span>
        </div>

        {error && <p className="text-red-400 text-center mt-2">{error}</p>}
        {updateSuccess && (
          <p className="text-green-400 text-center mt-2">
            Profile updated successfully 🎉
          </p>
        )}

        <button
          onClick={handleShowListings}
          className="w-full mt-6 text-cyan-400 uppercase font-semibold hover:underline"
        >
          Show My Listings
        </button>

        {showlistingsError && (
          <p className="text-red-400 text-center text-sm">
            Couldn’t fetch listings 😔
          </p>
        )}

        {userlistings.length > 0 && (
          <div className="mt-6 space-y-4">
            {userlistings.map((listing) => (
              <div
                key={listing._id}
                className="flex justify-between items-center p-4 rounded-xl bg-white/10 border border-gray-500 hover:bg-white/20 transition-all duration-200"
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    className="h-20 w-20 object-cover rounded-lg shadow-md"
                    src={listing.imageUrls}
                    alt="listingImg"
                  />
                </Link>
                <Link
                  to={`/listing/${listing._id}`}
                  className="flex-1 ml-4 text-lg font-semibold text-white hover:underline"
                >
                  {listing.name}
                </Link>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    DELETE
                  </button>
                  <Link to={`/updatelisting/${listing._id}`}>
                    <button className="text-green-400 text-sm hover:underline">
                      EDIT
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
