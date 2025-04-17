import React, { useContext, useEffect } from "react";
import axios from "axios";
import { PlaceContext } from "../context/PlaceContext";
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const Home = () => {
  const { places, setPlaces } = useContext(PlaceContext);
  const URI = import.meta.env.VITE_BACKEND_URI;

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

  useEffect(() => {
    fetchPlaceDetails();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {places.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <Link
              to={`/places/${place._id}`}
              key={place._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 group overflow-hidden"
            >
              {/* Place Image */}
              <img
                src={`${URI}/${place.photos[0]}`}
                alt={place.title}
                className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Content */}
              <div className="p-4">
                {/* Owner Info */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={`${URI}/${place.owner.profilePic}`}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <div className="flex items-center gap-1 font-semibold text-gray-700">
                      <span>{place.owner.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                      <span>{place.owner.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <PhoneIcon className="w-4 h-4" />
                      {place.owner.phone}
                    </div>
                  </div>
                </div>

                {/* Place Info */}
                <h2 className="text-lg font-bold text-gray-800 mb-1">
                  {place.title}
                </h2>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <MapPinIcon className="w-5 h-5 text-red-500 mr-1" />
                  {place.address}
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {place.description}
                </p>
              </div>
              <div className="px-4 pb-4 text-right">
                <span className="text-xl font-semibold text-green-600">
                  ${place.price}
                </span>
                <span className="text-sm text-gray-500"> /night</span>
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
