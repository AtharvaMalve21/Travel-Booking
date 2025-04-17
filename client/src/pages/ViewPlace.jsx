import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext.jsx";
import { ChevronLeft, ChevronRight, MapPin, Pencil, Trash } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import BookingWidget from "../components/BookingWidget.jsx";

const CustomNextArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 right-3 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full transition"
    onClick={onClick}
  >
    <ChevronRight className="w-6 h-6" />
  </button>
);

const CustomPrevArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 left-3 transform -translate-y-1/2 z-10 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full transition"
    onClick={onClick}
  >
    <ChevronLeft className="w-6 h-6" />
  </button>
);

const ViewPlace = () => {
  const { id } = useParams();
  const { isLoggedIn } = useContext(UserContext);
  const [place, setPlace] = useState(null);
  const URI = import.meta.env.VITE_BACKEND_URI;
  const navigate = useNavigate();

  const fetchPlaceDetails = async () => {
    try {
      const { data } = await axios.get(`${URI}/api/places/${id}`, {
        withCredentials: true,
      });

      if (data.success) {
        setPlace(data.data);
      }
    } catch (err) {
      console.log(err.response?.data.message);
    }
  };

  useEffect(() => {
    fetchPlaceDetails();
  }, [isLoggedIn]);

  if (!place) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading place details...
      </div>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    appendDots: (dots) => (
      <div
        style={{ bottom: "10px" }}
        className="absolute w-full flex justify-center z-10"
      >
        <ul className="flex space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 bg-white/40 rounded-full hover:bg-white transition duration-300 cursor-pointer" />
    ),
  };

  const deletePlace = async () => {
    try {
      const { data } = await axios.delete(URI + `/api/places/${id}`, {
        withCredentials: true,
      });

      if (data.success) {
        navigate("/places");
        toast.success(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-90px)] py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        {/* Title and Actions */}
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{place.title}</h1>
          <div className="flex gap-3">
            <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition">
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={deletePlace}
              className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
            >
              <Trash className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center gap-2 text-gray-500 mb-4">
          <MapPin className="w-5 h-5" />
          <p>{place.address}</p>
        </div>

        {/* Image Slider */}
        <div className="relative mb-6 rounded-xl overflow-hidden">
          <Slider {...sliderSettings}>
            {place.photos?.map((photo, index) => (
              <div key={index}>
                <img
                  src={`${URI}/${photo}`}
                  alt={`Place ${index + 1}`}
                  className="object-cover w-full h-96 rounded-xl"
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Owner Info */}
        <div className="flex items-center gap-4 mb-6 p-4 border rounded-xl bg-gray-50">
          <img
            src={`${URI}/${place.owner.profilePic}`}
            alt="Owner"
            className="w-14 h-14 rounded-full object-cover border"
          />
          <div>
            <p className="text-lg font-semibold text-gray-800">
              {place.owner.name}
            </p>
            <p className="text-gray-500 text-sm">{place.owner.email}</p>
          </div>
        </div>

        {/* Main Content with Booking */}
        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          {/* Details */}
          <div className="flex-1 space-y-3 text-gray-700">
            <p>
              <strong>Description:</strong> {place.description}
            </p>
            <p>
              <strong>Extra Info:</strong> {place.extraInfo}
            </p>
            <p>
              <strong>Check-in:</strong> {place.checkIn}:00
            </p>
            <p>
              <strong>Check-out:</strong> {place.checkOut}:00
            </p>
            <p>
              <strong>Max Guests:</strong> {place.maxGuests}
            </p>
            <div>
              <p className="font-semibold">Perks:</p>
              <ul className="list-disc list-inside">
                {place.perks.map((perk, i) => (
                  <li key={i}>{perk}</li>
                ))}
              </ul>
            </div>
            <div className="text-xl font-semibold text-green-600">
              ${place.price}
              <span className="text-sm text-gray-500"> /night</span>
            </div>
          </div>

          {/* Booking Widget */}
          <div className="lg:w-1/3 w-full">
            <BookingWidget price={place?.price} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPlace;
