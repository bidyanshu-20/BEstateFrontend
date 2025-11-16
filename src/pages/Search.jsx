import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem.jsx";
import '../App.css'
const Search = () => {
  const navigate = useNavigate();
  const [sidebardata, setsidebardata] = useState({
    searchTern: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setloading] = useState(false);
  const [Listings, setListings] = useState([]);
  const [showMore, setshowMore] = useState(false);

  console.log(Listings);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTernFromUrl = urlParams.get("searchTern");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    if (
      searchTernFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setsidebardata({
        searchTern: searchTernFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setloading(true);
      setshowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 9) {
        setshowMore(true);
      }
      setListings(data);
      setloading(false);
    };

    fetchListings(); 
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setsidebardata({ ...sidebardata, type: e.target.id });
    }
    if (e.target.id === "searchTern") {
      setsidebardata({ ...sidebardata, searchTern: e.target.value });
    }
    if (
      e.target.id == "parking" ||
      e.target.id == "furnished" ||
      e.target.id == "offer"
    ) {
      setsidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setsidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("type", sidebardata.type);
    urlParams.set("searchTern", sidebardata.searchTern);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOflistingss = Listings.length;
    const startIndex = numberOflistingss;
    const urlparams = new URLSearchParams(location.search);
    urlparams.set("startIndex", startIndex);
    const searchQuery = urlparams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setshowMore(false);
    }
    setListings([...Listings, ...data]);
  };

  // console.log(sidebardata);

  return (
    <div className="flex flex-col md:flex-row">
      {/* LEFT SIDE */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex  items-center gap-2 ">
            <label className="whitespace-nowrap" htmlFor="">
              Search Tern:
            </label>
            <input
              type="text"
              id="searchTern"
              name="searchTern"
              placeholder="Search here..."
              className="border rounded-lg p-3 w-full outline-none"
              value={sidebardata.searchTern}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label>Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-4"
                onChange={handleChange}
                checked={sidebardata.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-4"
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-4"
                onChange={handleChange}
                checked={sidebardata.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-4"
                onChange={handleChange}
                checked={sidebardata.offer === "offer"}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label>Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-4"
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-4"
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <label>SOrt By:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              className="outline-none border rounded p-1"
              id="sort_order"
            >
              <option value="regularPrice_desc">Price High To low</option>
              <option value="regularPrice_asc">Price Low to High</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          {/* <button className="outline-none uppercase border-1 rounded p-1 border-zinc-800 hover:scale">
            Search
          </button> */}
          <button class="button-85" role="button">Search Here</button>
        </form>
      </div>

      {/* RIGHT SIDE  */}
      <div className="">
        <h1 className="text-2xl font-semibold border-b p-3">
          Listing Results:
        </h1>
        <div className="p-7 flex flex-col gap-4">
          {!loading && Listings.length === 0 && (
            <p className="text-xl text-slate-800 m-auto">No Listings Found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 m-auto">Loading....</p>
          )}

          {!loading &&
            Listings &&
            Listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-500 hover:underline p-7"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
