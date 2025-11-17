import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import SwiperCore from "swiper";
import { Navigation, Autoplay } from "swiper/modules";

const Home = () => {
  const [OfferListing, setOfferListing] = useState([]);
  const [saleListing, setsaleListing] = useState([]);
  const [rentListing, setrentListing] = useState([]);

  useEffect(() => {
    const fetchofferListings = async () => {
      try {
        const res = await fetch("https://b-estate-backend.vercel.app/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListing(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("https://b-estate-backend.vercel.app/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setrentListing(data);
        fetchsaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchsaleListings = async () => {
      try {
        const res = await fetch("https://b-estate-backend.vercel.app/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setsaleListing(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchofferListings();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 text-white min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center py-20 px-6 sm:px-12 text-center">
        {/* Animated glowing blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-[-100px] w-[400px] h-[400px] bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-[-100px] w-[400px] h-[400px] bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-4xl">
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-wide text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-xl animate-fadeIn">
            Unlock Your{" "}
            <span className="relative inline-block">
              <span className="underline decoration-wavy decoration-yellow-400">
                Dream Home
              </span>
            </span>{" "}
            <br />
            with{" "}
            <span className="italic bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Ease & Trust
            </span>
          </h1>

          <p className="text-gray-300 text-base sm:text-lg mt-6 leading-relaxed animate-slideUp">
            At{" "}
            <span className="font-bold text-blue-400 drop-shadow-sm">
              🅱🄴state
            </span>
            , we don’t just list properties — we{" "}
            <span className="text-pink-400 font-semibold">
              create connections
            </span>{" "}
            that shape your future. <br />
            Discover{" "}
            <span className="text-purple-400 font-medium">exclusive homes</span>
            , enjoy{" "}
            <span className="text-green-400 font-medium">
              secure transactions
            </span>
            , and begin your journey towards{" "}
            <span className="italic text-indigo-400">
              a lifestyle you deserve.
            </span>
          </p>

          <Link
            to={"/search"}
            className="mt-6 inline-block bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
          >
            Let’s Get Started 🚀
          </Link>
        </div>
      </div>

      {/* Swiper Section */}
      <div className="max-w-6xl mx-auto px-4 my-10">
        <Swiper
          navigation
          modules={[Navigation, Autoplay]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop={true}
          slidesPerView={1}
          spaceBetween={20}
        >
          {OfferListing.length > 0 &&
            OfferListing.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  style={{
                    background: `url(${listing.imageUrls[0]}) center/cover no-repeat`,
                  }}
                  className="h-[400px] sm:h-[500px] rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.2)] transform hover:scale-[1.02] transition-all duration-500"
                >
                  <div className="h-full w-full bg-black/40 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
                    <h3 className="text-3xl sm:text-4xl font-semibold text-white bg-black/40 px-6 py-2 rounded-lg">
                      {listing.name}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      {/* Listing Sections */}
      <div className="max-w-7xl mx-auto p-6 sm:p-10 flex flex-col gap-10">
        {OfferListing.length > 0 && (
          <ListingSection
            title="🔥 Recent Offers"
            listings={OfferListing}
            link="/search?offer=true"
            linkText="Show More Offers"
          />
        )}

        {rentListing.length > 0 && (
          <ListingSection
            title="🏠 Latest Rent Options"
            listings={rentListing}
            link="/search?type=rent"
            linkText="Explore More Rentals"
          />
        )}

        {saleListing.length > 0 && (
          <ListingSection
            title="💎 Featured Sale Listings"
            listings={saleListing}
            link="/search?type=sale"
            linkText="See All Sales"
          />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black/40 text-gray-400 py-6 mt-16 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 flex justify-center items-center text-sm">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-blue-400">
              Bidyanshu Developers
            </span>
            . All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

// ✅ Reusable Listing Section Component
const ListingSection = ({ title, listings, link, linkText }) => (
  <div className="animate-slideUp">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-3xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        {title}
      </h2>
      <Link
        to={link}
        className="text-sm text-blue-400 hover:underline hover:text-purple-400 transition duration-300"
      >
        {linkText}
      </Link>
    </div>
    <div className="flex flex-wrap gap-4 justify-center">
      {listings.map((listing) => (
        <ListingItem
          key={listing._id}
          listing={listing}
          className="transform hover:scale-105 transition-all duration-300"
        />
      ))}
    </div>
  </div>
);

export default Home;
