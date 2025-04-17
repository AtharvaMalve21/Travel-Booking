import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import Places from "./pages/Places.jsx";
import MyBooking from "./pages/MyBooking.jsx";
import MyAccomodations from "./pages/MyAccomodations.jsx";
import ViewPlace from "./pages/ViewPlace.jsx";
import AccomodationsForm from "./pages/AccomodationsForm.jsx";
import ViewBooking from "./pages/ViewBooking.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/places" element={<Places />} />
        <Route path="/places/:id" element={<ViewPlace />} />
        <Route path="/account/profile" element={<MyProfile />} />
        <Route path="/account/bookings" element={<MyBooking />} />
        <Route path="/account/places" element={<MyAccomodations />} />
        <Route path="/account/places/new" element={<AccomodationsForm />} />
        <Route path="/account/bookings/:id" element={<ViewBooking />} />
      </Route>
    </Routes>
  );
};

export default App;
