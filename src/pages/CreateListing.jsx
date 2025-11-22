import React, { useState } from "react";

import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setfiles] = useState([]);
  const navigate = useNavigate();
  const [formdata, setformdata] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "sale",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 10,
    discountPrice: 5,
    offer: false,
    parking: false,
    furnished: false,
    userRef: currentUser?._id || "",
  });

  const [error, setError] = useState(false); // for error handling on complete data submission
  const [loading, setloading] = useState(false);
  //  //   HandleFileSubmit
  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length <= 6) {
      console.log("Selected files:", files); // ✅ check multiple files

      try {
        const uploadedUrls = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const formDataCloud = new FormData();
          formDataCloud.append("file", file);

          const uploadPreset = import.meta.env.VITE_CLOUDINARY_ESTATE_PRESET;
          formDataCloud.append("upload_preset", uploadPreset);
          formDataCloud.append("folder", "estate_images"); // folder in Cloudinary

          const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
          const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

          const response = await fetch(url, {
            method: "POST",
            body: formDataCloud,
          });

          const data = await response.json();
          console.log("Uploaded image URL:", data.secure_url);

          uploadedUrls.push(data.secure_url);
        }

        console.log("All uploaded URLs:", uploadedUrls);

        setformdata((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...uploadedUrls],
        }));
        alert("Images uploaded successfully!");

        // You can now save uploadedUrls in your state or send to your database
      } catch (error) {
        console.error("Error uploading files to Cloudinary:", error);
        alert("Failed to upload images.");
      }
    } else {
      alert("Please select up to 6 images.");
    }
  };

  // delete imagases from

  const handleRemoveImg = (index) => {
    setformdata({
      ...formdata,
      imageUrls: formdata.imageUrls.filter((_, i) => i !== index),
    });
  };
  // console.log(formdata);
  // handle data change............

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setformdata({
        ...formdata,
        type: e.target.id,
      });
    }
    if (
      e.target.id == "offer" ||
      e.target.id == "furnished" ||
      e.target.id == "parking"
    ) {
      setformdata({
        ...formdata,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setformdata({
        ...formdata,
        [e.target.id]: e.target.value,
      });
    }
  };
  //  complete data submission in the data base;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!formdata.imageUrls || formdata.imageUrls.length < 1) {
        return setError("You must upload at least one Image!");
      }
      if (+formdata.regularPrice < +formdata.discountPrice) {
        return setError("Discount price must be Lower than Regular price...");
      }
      setloading(true);
      setError(false);

      const payload = {
        ...formdata,
        userRef: currentUser._id,
      };
      // console.log("Payload----->>", payload);
      // console.log(formdata);
      const res = await fetch(
        "https://bestatebackend.onrender.com/api/listing/create",   
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // REQUIRED for authentication
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      setloading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data.listing._id}`);
    } catch (error) {
      setError(error.message);
      setloading(false);
    }
  };
  return (
    <main className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      {/* Board with bg image + gradient overlay */}
      <div
        className="w-full max-w-5xl rounded-2xl shadow-2xl p-8 bg-gradient-to-br from-white/95 via-slate-50/95 to-slate-100/95 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/white-wall.png'), linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(245,245,245,0.9))",
        }}
      >
        <h1 className="text-3xl font-bold text-center mt-2 text-slate-800 tracking-wide drop-shadow-md">
          Create a New Listing
        </h1>

        <form
          onSubmit={submitHandler}
          className="flex flex-col sm:flex-row gap-6 mt-8"
        >
          {/* Left Part */}
          <div className="flex flex-col gap-4 flex-1">
            <input
              type="text"
              placeholder="Name"
              id="name"
              className="border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition"
              maxLength={60}
              minLength={10}
              required
              onChange={handleChange}
              value={formdata.name}
            />
            <textarea
              placeholder="Description"
              id="description"
              className="border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
              rows={4}
              required
              onChange={handleChange}
              value={formdata.description}
            />
            <input
              type="text"
              placeholder="Address"
              id="address"
              className="border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition"
              required
              onChange={handleChange}
              value={formdata.address}
            />

            {/* Checkboxes */}
            <div className="flex gap-3 flex-wrap mt-2">
              <div className="flex gap-2">
                <label className="flex items-center gap-2 border px-3 py-1 rounded-lg cursor-pointer bg-white/70 backdrop-blur-sm hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 transition">
                  <input
                    onChange={handleChange}
                    checked={formdata.type === "sale"}
                    type="checkbox"
                    id="sale"
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    sale
                  </span>
                </label>
              </div>
              <div className="flex gap-2">
                <label className="flex items-center gap-2 border px-3 py-1 rounded-lg cursor-pointer bg-white/70 backdrop-blur-sm hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 transition">
                  <input
                    checked={formdata.type === "rent"}
                    onChange={handleChange}
                    type="checkbox"
                    id="rent"
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Rent
                  </span>
                </label>
              </div>
              <div className="flex gap-2">
                <label className="flex items-center gap-2 border px-3 py-1 rounded-lg cursor-pointer bg-white/70 backdrop-blur-sm hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 transition">
                  <input
                    checked={formdata.parking}
                    onChange={handleChange}
                    type="checkbox"
                    id="parking"
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Parking spot
                  </span>
                </label>
              </div>
              <div className="flex gap-2">
                <label className="flex items-center gap-2 border px-3 py-1 rounded-lg cursor-pointer bg-white/70 backdrop-blur-sm hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 transition">
                  <input
                    checked={formdata.furnished}
                    onChange={handleChange}
                    type="checkbox"
                    id="furnished"
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Furnished
                  </span>
                </label>
              </div>
              <div className="flex gap-2">
                <label className="flex items-center gap-2 border px-3 py-1 rounded-lg cursor-pointer bg-white/70 backdrop-blur-sm hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 transition">
                  <input
                    checked={formdata.offer}
                    onChange={handleChange}
                    type="checkbox"
                    id="offer"
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    offer
                  </span>
                </label>
              </div>
            </div>

            {/* Numbers */}
            <div className="flex flex-wrap gap-6 mt-2">
              <div className="flex items-center gap-2">
                <input
                  value={formdata.bedrooms}
                  onChange={handleChange}
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="10"
                  required
                  className="p-2 border border-gray-300 outline-none rounded-lg w-20 focus:ring-2 focus:ring-purple-500 transition"
                />
                <span className="text-sm text-slate-700">Bed-Rooms</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  onChange={handleChange}
                  value={formdata.bathrooms}
                  type="number"
                  id="bathrooms"
                  min="1"
                  max="3"
                  required
                  className="p-2 border border-gray-300 outline-none rounded-lg w-20 focus:ring-2 focus:ring-purple-500 transition"
                />
                <span className="text-sm text-slate-700">Baths</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  onChange={handleChange}
                  value={formdata.regularPrice}
                  type="number"
                  id="regularPrice"
                  min="1"
                  max="100000"
                  required
                  className="p-2 border border-gray-300 outline-none rounded-lg w-24 focus:ring-2 focus:ring-purple-500 transition"
                />
                <div className="flex flex-col items-start text-xs text-slate-600">
                  <p>Regular Price</p>
                  <span>($/month)</span>
                </div>
              </div>
              {formdata.offer && (
                <div className="flex items-center gap-2">
                  <input
                    onChange={handleChange}
                    value={formdata.discountPrice}
                    type="number"
                    id="discountPrice"
                    min="0"
                    max="10000"
                    required
                    className="p-2 border border-gray-300 outline-none rounded-lg w-24 focus:ring-2 focus:ring-purple-500 transition"
                  />
                  <div className="flex flex-col items-start text-xs text-slate-600">
                    <p>Discounted Price</p>
                    <span>($/month)</span>
                  </div>
                </div>
              )}
              {/* <div className="flex items-center gap-2">
                <input
                  onChange = {handleChange}
                  value={formdata.discountPrice}
                  type="number"
                  id="discountPrice"
                  min="1"
                  max="100000"
                  required
                  className="p-2 border border-gray-300 outline-none rounded-lg w-24 focus:ring-2 focus:ring-purple-500 transition"
                />
                <div className="flex flex-col items-start text-xs text-slate-600">
                  <p>Discounted Price</p>
                  <span>($/month)</span>
                </div>
              </div> */}
            </div>
          </div>

          {/* Right Part */}
          <div className="flex flex-col flex-1 gap-5">
            <p className="font-semibold text-slate-700">
              Images:{" "}
              <span className="font-normal text-gray-500 ml-1 text-sm">
                The first image will be the cover (max 6)
              </span>
            </p>

            <div className="flex gap-3 items-center">
              <input
                onChange={(e) => setfiles(Array.from(e.target.files))}
                className="p-2 border border-gray-300 rounded-lg w-full file:mr-4 file:py-2 file:px-4 
                file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer transition"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                onClick={handleImageSubmit}
                type="button"
                className="px-4 py-2 text-green-700 border border-green-500 rounded-lg uppercase font-medium hover:bg-green-50 hover:shadow-md transition"
              >
                Upload
              </button>
            </div>
            {formdata.imageUrls.map((url, idx) => (
              <div
                key={idx}
                className=" flex justify-between items-center shadow-md  p-2 rounded"
              >
                <img
                  src={url}
                  alt={`estate-${idx}`}
                  width="150"
                  style={{ borderRadius: "8px", border: "1px solid #ccc" }} // ✅ optional styling
                />
                <button
                  onClick={() => {
                    handleRemoveImg(idx);
                  }}
                  className="text-sm text-red-400 hover:underline hover:text-red-700 cursor-pointer font-semibold uppercase "
                >
                  DELETE
                </button>
              </div>
            ))}
            <button
              disabled={loading || files.length === 0}
              type="submit"
              className="p-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-lg uppercase font-semibold hover:opacity-90 hover:shadow-lg transition"
            >
              {loading ? "Creating...." : "Create Listing"}
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateListing;
