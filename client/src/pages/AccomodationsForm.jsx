import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const perksList = [
  { label: "Wifi", icon: "📶", name: "wifi" },
  { label: "Free Parking Spot", icon: "🅿️", name: "parking" },
  { label: "TV", icon: "📺", name: "tv" },
  { label: "Radio", icon: "📻", name: "radio" },
  { label: "Pets Allowed", icon: "🐶", name: "pets" },
  { label: "Private Entrance", icon: "🚪", name: "entrance" },
];

const AccommodationsForm = () => {
  const [tourType, setTourType] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [photos, setPhotos] = useState([]);
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [price, setPrice] = useState("");

  const URI = import.meta.env.VITE_BACKEND_URI;
  const navigate = useNavigate();

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    setPreviewPhotos(files.map((file) => URL.createObjectURL(file)));
  };

  const handlePerkToggle = (perk) => {
    setPerks((prev) =>
      prev.includes(perk) ? prev.filter((p) => p !== perk) : [...prev, perk]
    );
  };

  const addNewPlace = async (ev) => {
    ev.preventDefault();
    try {
      const formData = new FormData();
      formData.append("tourType", tourType);
      formData.append("additionalDetails", additionalDetails);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("address", address);
      photos.forEach((photo) => formData.append("photos", photo));
      formData.append("perks", JSON.stringify(perks));
      formData.append("extraInfo", extraInfo);
      formData.append("checkIn", checkIn);
      formData.append("checkOut", checkOut);
      formData.append("maxGuests", maxGuests);
      formData.append("price", price);

      const { data } = await axios.post(
        URI + "/api/places",

        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/account/places");
      }
    } catch (err) {
      toast.error(err.response?.data.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md mt-8 space-y-8">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        Your Place, Your Rules – Let’s Get Started!
      </h2>

      <form onSubmit={addNewPlace} className="space-y-6">
        {/* Tour Type  */}
        <div>
          <label
            htmlFor="tourType"
            className="block text-lg font-medium text-gray-700"
          >
            Tour Type
          </label>
          <input
            type="text"
            id="tourType"
            placeholder="e.g. Kashmir Tours"
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            value={tourType}
            onChange={(ev) => setTourType(ev.target.value)}
          />
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-lg font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="e.g. Cozy Beachfront Villa"
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-lg font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Brief description of the property"
            rows={3}
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring focus:border-blue-400"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
          />
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-lg font-medium text-gray-700"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            placeholder="Complete address of the property"
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            value={address}
            onChange={(ev) => setAddress(ev.target.value)}
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Photos{" "}
            <span className="text-sm text-gray-500">
              (Upload multiple images)
            </span>
          </label>
          <input
            type="file"
            multiple
            onChange={handlePhotoUpload}
            className="hidden"
            id="upload"
          />
          <label
            htmlFor="upload"
            className="inline-flex items-center gap-2 cursor-pointer px-3 py-3 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
            Upload Photos
          </label>

          <div className="mt-4 grid grid-cols-3 gap-4">
            {previewPhotos.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Preview ${index}`}
                className="h-24 w-full object-cover rounded-md border"
              />
            ))}
          </div>
        </div>

        {/* Perks */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Perks
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {perksList.map((perk) => (
              <label
                key={perk.name}
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${
                  perks.includes(perk.name)
                    ? "bg-blue-100 border-blue-400"
                    : "border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={perks.includes(perk.name)}
                  onChange={() => handlePerkToggle(perk.name)}
                  className="accent-blue-600"
                />
                <span className="text-lg">{perk.icon}</span>
                <span>{perk.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Details  */}

        <div>
          <label
            htmlFor="additionalDetails"
            className="block text-lg font-medium text-gray-700"
          >
            Amenities
          </label>
          <textarea
            id="additionalDetails"
            placeholder="amenities"
            rows={3}
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring focus:border-blue-400"
            value={additionalDetails}
            onChange={(ev) => setAdditionalDetails(ev.target.value)}
          />
        </div>

        {/* Extra Info */}
        <div>
          <label
            htmlFor="info"
            className="block text-lg font-medium text-gray-700"
          >
            Extra Info{" "}
            <span className="text-sm text-gray-500">(house rules, etc.)</span>
          </label>
          <input
            type="text"
            id="info"
            placeholder="No loud music after 10PM"
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            value={extraInfo}
            onChange={(ev) => setExtraInfo(ev.target.value)}
          />
        </div>

        {/* Check-In / Check-Out */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="checkIn"
              className="block text-lg font-medium text-gray-700"
            >
              Check-In Time{" "}
              <span className="text-sm text-gray-500">(24h format)</span>
            </label>
            <input
              type="number"
              id="checkIn"
              placeholder="e.g. 12"
              min="0"
              max="23"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="checkOut"
              className="block text-lg font-medium text-gray-700"
            >
              Check-Out Time{" "}
              <span className="text-sm text-gray-500">(24h format)</span>
            </label>
            <input
              type="number"
              id="checkOut"
              placeholder="e.g. 14"
              min="0"
              max="23"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
        </div>

        {/* Guests */}
        <div>
          <label
            htmlFor="maxGuests"
            className="block text-lg font-medium text-gray-700"
          >
            Max Guests
          </label>
          <input
            type="number"
            id="maxGuests"
            placeholder="e.g. 4"
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            value={maxGuests}
            onChange={(ev) => setMaxGuests(ev.target.value)}
          />
        </div>

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-lg font-medium text-gray-700"
          >
            Price{" "}
            <span className="text-sm text-gray-500">(per night in ₹)</span>
          </label>
          <input
            type="number"
            id="price"
            placeholder="e.g. 120"
            min="1"
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            value={price}
            onChange={(ev) => setPrice(ev.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all text-lg font-medium"
        >
          + Add Accommodation
        </button>
      </form>
    </div>
  );
};

export default AccommodationsForm;
