/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { PlaceContext } from "../context/PlaceContext";
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserContext } from "../context/UserContext";

const Home = () => {
  const { places, setPlaces } = useContext(PlaceContext);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const { isLoggedIn } = useContext(UserContext);

  const [tourType, setTourType] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [budget, setBudget] = useState("");

  const fetchPlaceDetails = async () => {
    try {
      const { data } = await axios.get(URI);
      if (data.success) {
        setPlaces(data.data);
      }
    } catch (err) {
      console.log(err.response?.data.message);
    }
  };

  const fetchFilteredPlaces = async () => {
    if (!tourType) {
      toast.error("Please select a tour type.");
      return;
    }

    try {
      const { data } = await axios.get(`${URI}/api/places/filter`, {
        params: { tourType },
        withCredentials: true,
      });

      if (data.success) {
        setPlaces(data.data);
      } else {
        toast.error(data.message || "No places found.");
      }
    } catch (err) {
      toast.error(err.response?.data.message || "Failed to fetch places");
    }
  };

  useEffect(() => {
    fetchPlaceDetails();
  }, [isLoggedIn]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Filter Section */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
        <div>
          <label className="text-sm font-medium text-gray-700">Tour Type</label>
          <select
            value={tourType}
            onChange={(ev) => setTourType(ev.target.value)}
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Tour Type</option>
            <option value="Kashmir Tours">Kashmir Tours</option>
            <option value="Manali Tours">Manali Tours</option>
            <option value="Ladakh Tours">Ladakh Tours</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Check In</label>
          <input
            type="date"
            value={checkIn}
            onChange={(ev) => setCheckIn(ev.target.value)}
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Check Out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(ev) => setCheckOut(ev.target.value)}
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Max Guests
          </label>
          <input
            type="number"
            value={maxGuests}
            onChange={(ev) => setMaxGuests(ev.target.value)}
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2"
            placeholder="e.g. 4"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Budget</label>
          <input
            type="number"
            value={budget}
            onChange={(ev) => setBudget(ev.target.value)}
            className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2"
            placeholder="e.g. ₹30,000"
          />
        </div>

        <div>
          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-300"
            onClick={fetchFilteredPlaces}
          >
            Search
          </button>
        </div>
      </div>

      {/* Places Grid */}
      {places.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <Link
              to={`/places/${place._id}`}
              key={place._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 group overflow-hidden"
            >
              <img
                src={`${URI}/${place.photos[0]}`}
                alt={place.title}
                className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <div className="p-4">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={`${URI}/${place.owner.profilePic}`}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <div className="font-semibold text-gray-700">
                      {place.owner.name}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                      {place.owner.email}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <PhoneIcon className="w-4 h-4" />
                      {place.owner.phone}
                    </div>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-gray-800 mb-1">
                  {place.tourType}
                </h2>

                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <MapPinIcon className="w-5 h-5 text-red-500 mr-1" />
                  {place.title} {place.address}
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {place.description}
                </p>
              </div>
              <div className="px-4 pb-4 text-right">
                <span className="text-xl font-semibold text-green-600">
                  ₹{place.price}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10 text-lg">
          No Places found!
        </div>
      )}
    </div>
  );
};

export default Home;
