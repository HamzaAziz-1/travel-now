const Review = require('../models/Review');
const Tour = require('../models/Tour');
const Order = require('../models/Order')
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

const createReview = async (req, res) => {
  const { tour: tourId } = req.body;
  
  const isValidTour = await Tour.findOne({ _id: tourId });

  if (!isValidTour) {
    throw new CustomError.NotFoundError(`No tour with id : ${tourId}`);
  }
  const isOrder = await Order.findOne({ user: req.user.userId,"orderItems.tour":tourId,status:"paid" });
  if (!isOrder) {
     throw new CustomError.BadRequestError(
       "You haven't booked this tour."
     );
  }

  const alreadySubmitted = await Review.findOne({
    tour: tourId,
    user: req.user.userId,
  });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      'Already submitted review for this tour'
    );
  }
  const isOrderCompleted = await Order.find({
    "orderItems.tour": tourId,
    user: req.user.userId,
    status: "completed",
  });
  if (!isOrderCompleted) {
    throw new CustomError.BadRequestError(
      "Your Tour is not completed yet!"
    );
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: 'tour',
    select: 'city price',
  });

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  res.status(StatusCodes.OK).json({ review });
};
const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};
const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  checkPermissions(req.user, review.user);
  await review.deleteOne();
  res.status(StatusCodes.OK).json({ msg: 'Success! Review removed' });
};

const getSingleTourReviews = async (req, res) => {
  const { id: tourId } = req.params;
  const reviews = await Review.find({ tour: tourId }).populate('user','name image');
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleTourReviews,
};
