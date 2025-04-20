import React, { useContext } from "react";
import NavPlace from "../components/NavPlace";
import { UserContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const MyProfile = () => {
  const { user, setIsLoggedIn, setUser, userBooking } = useContext(UserContext);

  const URI = import.meta.env.VITE_BACKEND_URI;
  const navigate = useNavigate();

  const logoutUserAccount = async () => {
    try {
      const { data } = await axios.get(URI + "/api/auth/logout", {
        withCredentials: true,
      });

      if (data.success) {
        setIsLoggedIn(false);
        setUser(null);
        toast.success(data.message);
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data.message);
    }
  };

  return (
    <div className="bg-gray-50">
      <NavPlace />
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-8 text-center">
          <img
            src={`${URI}/${user?.profilePic}`}
            alt="Profile"
            className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-blue-500 shadow-md mb-4"
          />
          <p>{user?.role}</p>
          <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
          <p className="text-gray-600 text-sm mt-1">{user?.email}</p>
          <div className="flex justify-center gap-2 mt-2">
            <span className="text-gray-500 text-sm">{user?.gender}</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500 text-sm">{user?.phone}</span>
          </div>
          <div>
            <span className="text-gray-500 text-sm">
              Total bookings: {userBooking.length}
            </span>
            
          </div>

          <div className="mt-4 flex justify-center">
            {user?.isAccountVerified ? (
              <div className="flex items-center text-green-600 text-sm font-medium gap-1">
                <CheckIcon />
                Verified Account
              </div>
            ) : (
              <div className="flex items-center text-gray-400 text-sm font-medium gap-1">
                <CheckIcon />
                Not Verified
              </div>
            )}
          </div>

          <button
            onClick={logoutUserAccount}
            className="mt-6 flex items-center justify-center gap-2 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

// ✅ Icons
const CheckIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
    />
  </svg>
);
