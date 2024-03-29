const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide review title"],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, "Please provide review text"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: true,
    },
  },
  { timestamps: true }
);
ReviewSchema.index({ tour: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (tourId) {
  const result = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: { $divide: ["$rating", 1] } },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model("Tour").findOneAndUpdate(
      { _id: tourId },
      {
        averageRating: parseFloat(result[0]?.averageRating.toFixed(1)) || 0,
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.tour);
});

ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.tour);
});

module.exports = mongoose.model("Review", ReviewSchema);
