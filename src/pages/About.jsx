import React from "react";
import { Link } from "react-router-dom";
import { FaUserShield, FaHome, FaEnvelope, FaHandshake } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 text-slate-700">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <h1 className="text-4xl lg:text-6xl font-extrabold text-center text-slate-800 mb-10">
          About <span className="text-blue-600">🅱🄴state</span>
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16 text-lg">
          VidEstate is your trusted partner in finding, listing, and selling
          properties with ease. Our mission is to simplify the real estate
          experience by offering powerful tools for users and property owners.
          🚀
        </p>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2">
            <FaUserShield className="text-blue-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Secure Authentication
            </h3>
            <p className="text-gray-500 text-sm">
              Sign up with email and enjoy full login/logout facilities. Only
              authenticated users can post listings for maximum trust & safety.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2">
            <FaHome className="text-green-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Property Listings</h3>
            <p className="text-gray-500 text-sm">
              Create and manage estate listings for sale or rent. Share detailed
              images and descriptions to attract the right buyers and tenants.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2">
            <FaEnvelope className="text-red-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Direct Messaging</h3>
            <p className="text-gray-500 text-sm">
              Communicate with other users via email to negotiate deals, share
              opinions, and build trust while selling or buying property.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2">
            <FaHandshake className="text-purple-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Trusted Community</h3>
            <p className="text-gray-500 text-sm">
              Connect with genuine buyers and sellers in a safe, transparent
              community built for property enthusiasts and professionals.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-4">
            Ready to find your dream property?
          </h2>
          <p className="text-gray-600 mb-6">
            Start exploring listings or create your own to connect with
            potential buyers and sellers today.
          </p>
          <Link
            to="/search"
            className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Explore Listings
          </Link>
        </div>
      </div>
      <footer className="bg-slate-800 text-gray-300 py-4 mt-16">
        <div className="max-w-6xl mx-auto px-4 flex justify-center items-center text-sm">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-white">
              BidyanshuDevelopers
            </span>
            . All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
