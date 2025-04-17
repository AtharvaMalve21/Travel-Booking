import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const BookingWidget = ({ price }) => {

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showContactFields, setShowContactFields] = useState(false);

  

  const { id } = useParams();
  const URI = import.meta.env.VITE_BACKEND_URI;
  const navigate = useNavigate();

  const toggleContactFields = () => setShowContactFields((prev) => !prev);

  const checkInDate = checkIn ? new Date(checkIn) : null;
  const checkOutDate = checkOut ? new Date(checkOut) : null;

  const numberOfNights =
    checkInDate && checkOutDate
      ? Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
      : 0;

  const totalAmount = numberOfNights > 0 ? numberOfNights * price * maxGuests : 0;

  const addBooking = async (e) => {
    e.preventDefault();

    if (numberOfNights <= 0) {
      return toast.error("Check-out must be after check-in.");
    }

    try {
      const { data } = await axios.post(
        URI + `/api/booking/${id}`,
        { checkIn, checkOut, maxGuests, name, email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/account/bookings");
      }
    } catch (err) {
      toast.error(err.response?.data.message);
    }
  };

  return (
    <div className="bg-white border rounded-2xl shadow-lg p-5 w-full max-w-sm ml-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Your Booking</h2>

      <form onSubmit={addBooking} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Guests</label>
          <input
            type="number"
            min="1"
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
            required
          />
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={toggleContactFields}
            className="text-sm text-blue-600 hover:underline"
          >
            {showContactFields ? "Hide Contact Info" : "Add Contact Info"}
          </button>
        </div>

        {showContactFields && (
          <>
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                required
              />
            </div>
          </>
        )}

        {numberOfNights > 0 && (
          <div className="text-right text-gray-700">
            <span className="text-lg font-semibold text-green-600">
              ${totalAmount}
            </span>{" "}
            <span className="text-sm">total for {numberOfNights} nights</span>
          </div>
        )}

        {showContactFields && (
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Book Now
          </button>
        )}
      </form>
    </div>
  );
};

export default BookingWidget;
