const Place = require("../models/placesModel");
const User = require("../models/userModel");

exports.addNewPlace = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found. Login Again.",
      });
    }

    const {
      title,
      address,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    } = req.body;

    if (
      !title ||
      !address ||
      !description ||
      !perks ||
      !extraInfo ||
      !checkIn ||
      !checkOut ||
      !maxGuests ||
      !price
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const photos = req.files?.map((file) => file.path);

    if (!photos) {
      return res.status(400).json({
        success: false,
        message: "Please add one photo",
      });
    }

    const place = await Place.create({
      title,
      address,
      description,
      photos,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
      owner: userId,
    });

    return res.status(201).json({
      success: true,
      data: place,
      message: "New Place added!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getPlaces = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found. Login Again.",
      });
    }

    const places = await Place.find({ owner: userId }).populate("owner");

    return res.status(200).json({
      success: true,
      data: places,
      message: "Places data fetched.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.viewPlace = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found. Login Again.",
      });
    }

    const { id } = req.params;
    const place = await Place.findById(id).populate("owner");
    if (!place) {
      return res.status(404).json({
        success: false,
        message: "No Place found. Please add a new one.",
      });
    }
    return res.status(200).json({
      success: true,
      data: place,
      message: "Fetched place data!",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updatePlace = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found. Login Again.",
      });
    }

    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: "No Place found. Please add a new one.",
      });
    }

    //check if the user is authorized to update this place

    if (place.owner._id.toString() !== userId.toString()) {
      return res.status(401).json({
        success: false,
        message: "User is not authorized to update this place.",
      });
    }

    const {
      title,
      address,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    } = req.body;

    const photos = req.file?.path;

    place.title = title || place.title;
    place.address = address || place.address;
    place.description = description || place.description;
    place.photos = photos || place.photos;
    place.perks = perks || place.perks;
    place.extraInfo = extraInfo || place.extraInfo;
    place.checkIn = checkIn || place.checkIn;
    place.checkOut = checkOut || place.checkOut;
    place.maxGuests = maxGuests || place.maxGuests;

    await place.save();

    return res.status(200).json({
      success: true,
      data: place,
      message: "Place updated.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deletePlace = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No User found. Login Again.",
      });
    }

    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({
        success: false,
        message: "No Place found. Please add a new one.",
      });
    }

    //check if the user is authorized to delete this place

    if (place.owner._id.toString() !== userId.toString()) {
      return res.status(401).json({
        success: false,
        message: "User is not authorized to delete this place.",
      });
    }

    await place.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Place deleted.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
