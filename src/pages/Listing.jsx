import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { IoMdShareAlt } from "react-icons/io";
import { FaBed } from "react-icons/fa";
import { GiBathtub } from "react-icons/gi";
import { FaParking } from "react-icons/fa";
import { FaChair } from "react-icons/fa";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

const Listing = () => {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);

  SwiperCore.use([Navigation]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://bestatebackend.onrender.com/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (!data) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className="w-full min-h-screen bg-gray-50">
      {loading && (
        <p className="text-center mt-6 text-lg font-semibold">Loading...</p>
      )}

      {error && (
        <p className="text-center text-red-600 mt-6 text-lg font-semibold">
          Something went wrong...
        </p>
      )}

      {listing && !loading && !error && (
        <div className="pb-10">
          {/* Image Slider */}
          <Swiper navigation className="w-full">
            {listing.imageUrls.map((url, idx) => (
              <SwiperSlide key={idx}>
                <div
                  className="h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] w-full"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Share Icon */}
          <div className="fixed top-[12%] right-[3%] z-10">
            <IoMdShareAlt className="text-red-900 h-10 w-10 bg-amber-100 p-2 rounded-full shadow-md cursor-pointer hover:bg-amber-200 transition" />
          </div>

          {/* Content Section */}
          <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-4 sm:p-6 md:p-8 mt-6 sm:mt-8 flex flex-col gap-5">
            {/* Title */}
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {listing.name} —{" "}
              <span className="text-green-700">
                ${" "}
                {listing.offer
                  ? listing.discountPrice.toLocaleString("en-US")
                  : listing.regularPrice.toLocaleString("en-US")}
                {listing.type === "rent" && " / month"}
              </span>
            </p>

            {/* Address */}
            <p className="flex items-center gap-2 text-gray-600 text-sm sm:text-base mt-2">
              {listing.address}
            </p>

            {/* Tags */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <p className="bg-red-900 text-white text-center px-3 py-1 rounded-md text-sm sm:text-base w-full sm:max-w-[200px]">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>

              {listing.offer && (
                <p className="bg-green-900 text-white text-center px-3 py-1 rounded-md text-sm sm:text-base w-full sm:max-w-[200px]">
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
              <span className="font-semibold text-black">Description</span> —{" "}
              {listing.description}
            </p>

            {/* Features */}
            <ul className="text-green-900 font-semibold text-sm sm:text-base grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Beds`
                  : `${listing.bedrooms} Bed`}
              </li>

              <li className="flex items-center gap-1 whitespace-nowrap">
                <GiBathtub className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : `${listing.bathrooms} Bath`}
              </li>

              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking Available" : "No Parking"}
              </li>

              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>

            {/* Contact Landlord */}
            {currentUser &&
              listing.userRef !== currentUser._id &&
              !contact && (
                <button
                  onClick={() => setContact(true)}
                  className="bg-slate-700 text-white rounded-lg uppercase hover:bg-slate-800 transition p-3 text-sm sm:text-base mt-4"
                >
                  Contact Landlord
                </button>
              )}

            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
};

export default Listing;
