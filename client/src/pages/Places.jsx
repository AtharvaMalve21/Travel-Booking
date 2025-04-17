import React, { useContext, useEffect } from "react";
import NavPlace from "../components/NavPlace";
import { PlaceContext } from "../context/PlaceContext.jsx";
import { UserContext } from "../context/UserContext.jsx";
import axios from "axios";
import { Link } from "react-router-dom";

import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const Places = () => {
  const { isLoggedIn } = useContext(UserContext);
  const { places, setPlaces } = useContext(PlaceContext);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const fetchPlacesDetails = async () => {
    try {
      const { data } = await axios.get(URI + "/api/places", {
        withCredentials: true,
      });

      if (data.success) {
        setPlaces(data.data);
      }
    } catch (err) {
      console.log(err.response?.data.message);
    }
  };

  useEffect(() => {
    fetchPlacesDetails();
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavPlace />
      {places.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {places.map((place) => (
            <Link
              to={`/places/${place._id}`}
              key={place._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                src={`${URI}/${
                  place.photos[Math.floor(Math.random() * place.photos.length)]
                }`}
                alt={place.title}
                className="h-52 w-full object-cover"
              />
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  {place.title}
                </h2>
                <p className="text-gray-600 text-sm">{place.description}</p>

                <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                  <MapPinIcon className="w-5 h-5 text-blue-500" />
                  <span>{place.address}</span>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <img
                    src={`${URI}/${place.owner.profilePic}`}
                    alt={place.owner.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {place.owner.name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <EnvelopeIcon className="w-4 h-4" />
                      {place.owner.email}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <PhoneIcon className="w-4 h-4" />
                      {place.owner.phone}
                    </div>
                  </div>
                </div>

                {/* Price bottom-right */}
                <div className="pt-4 text-right">
                  <span className="text-xl font-semibold text-green-600">
                    ${place.price}
                  </span>
                  <span className="text-sm text-gray-500"> /night</span>
                </div>
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

export default Places;
