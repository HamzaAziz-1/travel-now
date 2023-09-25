const Tour = require("../models/Tour");
// const Order = require("../models/Order");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const createTour = async (req, res) => {
  const { timeSlots } = req.body;
  for (let i = 0; i < timeSlots.length; i++) {
    const startTime = new Date(`1970-01-01T${timeSlots[i].start}:00`);
    const endTime = new Date(`1970-01-01T${timeSlots[i].end}:00`);
    const diff = endTime - startTime;
    if (diff < 0) {
      return res
        .status(400)
        .json({ msg: "End time must be greater than start time" });
    }
    if (diff < 2 * 60 * 60 * 1000) {
      return res.status(400).json({ msg: "Duration must be at least 2 hours" });
    }
  }

  req.body.vendor = req.user.userId;
  const tour = await Tour.create(req.body);
  res.status(StatusCodes.CREATED).json({ tour });
};

const getAllTours = async (req, res) => {
  const page = parseInt(req.query.page);
  const tours = await Tour.find({})
    .skip(page * 8)
    .limit(8);

  res.status(StatusCodes.OK).json({ tours });
};

const getVerifiedTours = async (req, res) => {
  const page = parseInt(req.query.page);
  const pageSize = 8;
  const skip = (page - 1) * pageSize;

  try {
    const tours = await Tour.find({ verified: true })
      .skip(skip)
      .limit(pageSize)
      .populate("reviews");

    res.status(StatusCodes.OK).json({ tours });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};


const getSingleTour = async (req, res) => {
  const { id: tourId } = req.params;

  const tour = await Tour.findOne({ _id: tourId }).populate("reviews").limit(8);
  if (!tour) {
    throw new CustomError.NotFoundError(`No tour with id : ${tourId}`);
  }

  res.status(StatusCodes.OK).json({ tour });
};

const getToursByVendor = async (req, res) => {
  const { id: vendorId } = req.params;
  const tours = await Tour.find({ vendor: vendorId }).populate("reviews");
  if (!tours) {
    throw new CustomError.NotFoundError(`No tour with id : ${vendor}`);
  }
  res.status(StatusCodes.OK).json({ tours });
};
const updateTour = async (req, res) => {
  const { id: tourId } = req.params;

  const tour = await Tour.findOneAndUpdate({ _id: tourId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    throw new CustomError.NotFoundError(`No tour with id : ${tourId}`);
  }

  res.status(StatusCodes.OK).json({ tour });
};

const deleteTour = async (req, res) => {
  const { id: tourId } = req.params;

  const tour = await Tour.findOne({ _id: tourId });

  if (!tour) {
    throw new CustomError.NotFoundError(`No tour with id : ${tourId}`);
  }

  await tour.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Success! Tour removed." });
};


const uploadImages = async (req, res) => {
  const uploadedImages = req.files;

  if (!uploadedImages || uploadedImages.length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "No images uploaded" });
  }

  // Ensure there are at least 1 and at most 4 images
  if (uploadedImages.length > 4) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Upload between 1 to 4 images" });
  }

  const imageUrls = [];

  try {
    for (const image of uploadedImages) {
      // Check file size (maximum 2 MB)
      if (image.size > 2 * 1024 * 1024) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ msg: "File size exceeds 2 MB limit" });
      }

      const result = await cloudinary.uploader.upload(image.path, {
        use_filename: true,
        folder: "file-upload",
      });

      imageUrls.push(result.secure_url);
    }

    return res.status(StatusCodes.OK).json({ images: imageUrls });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: `Failed to upload images: ${error.message}` });
  }
};

const verifyTour = async (req, res) => {
  const { id: tourId } = req.params;
  const tour = await Tour.findOne({ _id: tourId });

  if (!tour) {
    throw new CustomError.NotFoundError(`No tour with id : ${tourId}`);
  }

  tour.verified = !tour.verified;
  await tour.save();
  res.status(StatusCodes.OK).json({ tour });
};

const featureTour = async (req, res) => {
  const { id: tourId } = req.params;
  const tour = await Tour.findOne({ _id: tourId });

  if (!tour) {
    throw new CustomError.NotFoundError(`No tour with id : ${tourId}`);
  }

  tour.featured = !tour.featured;
  await tour.save();
  res.status(StatusCodes.OK).json({ tour });
};

// get tour by search
const getTourBySearch = async (req, res) => {
  // here 'i' means case sensitive
  const city = new RegExp(req.query.city, "i");
  // const distance = parseInt(req.query.distance);
  // const maxGroupSize = parseInt(req.query.maxGroupSize);

  try {
    // gte means greater than equal
    const tours = await Tour.find({
      city,
      verified: true,
    }).populate("reviews");

    res.status(200).json({
      success: true,
      message: "Successful",
      data: tours,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "not found",
    });
  }
};

// get featured tour
const getFeaturedTour = async (req, res) => {
  try {
    const tours = await Tour.find({ featured: true })
      .populate("reviews")
      .limit(8);

    res.status(200).json({
      success: true,
      message: "Successful",
      tours,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "not found",
    });
  }
};

// get tour counts
const getTourCount = async (req, res) => {
  try {
    const tours = await Tour.find({});
    const tourCount = tours.length;
    res.status(200).json({ success: true, data: tourCount });
  } catch (err) {
    res.status(500).json({ success: false, message: "failed to fetch" });
  }
};

const getAvailableTimeSlots = async (req, res) => {
  const { id: tourId } = req.params;

  const tour = await Tour.findOne({ _id: tourId });

  if (!tour) {
    throw new CustomError.NotFoundError(`No tour with id : ${tourId}`);
  }

  // Query the Order model for paid orders with the tour's ID
  const paidOrders = await Order.find({
    "orderItems.tour": tourId,
    status: "paid",
  });

  // Extract the booked time slots
  const bookedTimeSlots = new Set();

  for (const order of paidOrders) {
    for (const orderItem of order.orderItems) {
      if (orderItem.tour.toString() === tourId) {
        for (const timeSlot of orderItem.timeSlots) {
          bookedTimeSlots.add(JSON.stringify(timeSlot));
        }
      }
    }
  }

  // Create a new tour object with available days and time slots
  const availableDays = [];
  const availableTimeSlots = [];

  for (const day of tour.availableDays) {
    const timeSlots = tour.timeSlots.filter((timeSlot) => {
      return (
        !bookedTimeSlots.has(JSON.stringify(timeSlot)) &&
        timeSlot.start !== "" &&
        timeSlot.end !== ""
      );
    });

    if (timeSlots.length > 0) {
      availableDays.push(day);
      availableTimeSlots.push(timeSlots);
    }
  }

  const availableTour = {
    ...tour.toObject(),
    availableDays,
    timeSlots: availableTimeSlots,
  };

  res.status(StatusCodes.OK).json({ tour: availableTour });
};

module.exports = {
  createTour,
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour,
  uploadImages,
  getTourBySearch,
  getFeaturedTour,
  getTourCount,
  getToursByVendor,
  verifyTour,
  getVerifiedTours,
  featureTour,
  getAvailableTimeSlots,
};
