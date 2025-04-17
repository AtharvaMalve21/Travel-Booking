import React, { useContext, useEffect } from "react";
import NavPlace from "../components/NavPlace";
import { UserContext } from "../context/UserContext.jsx";
import { BookingContext } from "../context/BookingContext.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  UserIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarDaysIcon,
  UsersIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline"; 

const MyBooking = () => {
  const { isLoggedIn } = useContext(UserContext);
  const { bookings, setBookings } = useContext(BookingContext);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const fetchBookingDetails = async () => {
    try {
      const { data } = await axios.get(URI + "/api/booking", {
        withCredentials: true,
      });
      if (data.success) {
        setBookings(data.data);
      }
    } catch (err) {
      console.log(err.response?.data.message);
    }
  };



  useEffect(() => {
    fetchBookingDetails();
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen">
      <NavPlace />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Places You've Booked
        </h2>

        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookings.map((booking) => (
              <Link
                to={`/account/bookings/${booking._id}`}
                key={booking._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
              >
                {/* Place image */}
                <img
                  src={`${URI}/${booking.placeId.photos[0]}`}
                  alt="Place"
                  className="w-full h-64 object-cover"
                />

                {/* Booking details */}
                <div className="p-4 space-y-3">
                  {/* Address */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPinIcon className="h-5 w-5 text-red-500" />
                    <span className="font-medium">
                      {booking.placeId.address}
                    </span>
                  </div>

                  {/* Owner Info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={`${URI}/${booking.owner.profilePic}`}
                      alt="User"
                      className="h-10 w-10 rounded-full object-cover border-2 border-gray-300"
                    />
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-gray-800 font-medium">
                        <UserIcon className="h-4 w-4 text-blue-500" />
                        {booking.owner.name}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <EnvelopeIcon className="h-4 w-4 text-green-500" />
                        {booking.owner.email}
                      </div>
                    </div>
                  </div>

                  <hr className="my-2" />

                  {/* Booking For */}
                  <div>
                    <p className="text-sm text-gray-500">Booking For:</p>
                    <p className="font-medium text-gray-800">{booking.name}</p>
                    <p className="text-gray-600 text-sm">{booking.email}</p>
                  </div>

                  {/* Dates */}
                  <div className="flex flex-col gap-1 text-gray-700 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarDaysIcon className="h-5 w-5 text-yellow-600" />
                      <span>
                        <strong>Check-In:</strong>{" "}
                        {new Date(booking.checkIn).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDaysIcon className="h-5 w-5 text-yellow-600" />
                      <span>
                        <strong>Check-Out:</strong>{" "}
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Guests and Price */}
                  <div className="flex items-center justify-between text-sm mt-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <UsersIcon className="h-5 w-5 text-indigo-500" />
                      <span>{booking.maxGuests} Guest(s)</span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-green-600">
                      <CurrencyDollarIcon className="h-5 w-5" />
                      <span>₹{booking.totalPrice}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 text-lg">
            No Bookings Found
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooking;
