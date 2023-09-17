const mongoose = require("mongoose");
const validator = require("validator");

const TourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide title"],
      minlength: [3, "Enter a valid title"],
      maxlength: [50, "Enter a valid title"],
      match: [/^[A-Za-z\s]+$/, "Enter a valid title"],
    },
    price: {
      type: Number,
      required: [true, "Please provide tour price"],
      min: [500, "Price must be greater than 500"],
      match: [/^\d+(,\d{3})*(\.\d{2})?$/, "Enter a valid price"],
    },
    description: {
      type: String,
      required: [true, "Please provide tour description"],
      maxlength: [1000, "Description can not be more than 1000 characters"],
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    city: {
      type: String,
      required: [true, "Please provide tour city"],
      match: [/^[A-Za-z\s]+$/, "Enter a valid city"],
    },
    vendor: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide tour vendor"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      required: [true, "Please provide tour duration"],
      default: 1,
      min: [1, "Duration must be greater than 0"],
      max: [5, "Duration  cannot be greater than 5"],
      match: [/^[1-9]\d{0,2}$/, "Enter a valid duration"],
    },
    availableDays: {
      type: [String],
      required: [true, "Please provide available days"],
      enum: {
        values: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        message: "Enter a valid day",
      },
    },
    meetingPoint: {
      type: String,
      required: [true, "Please provide a meeting point"],
    },
    timeSlots: {
      type: [
        {
          start: {
            type: String,
            required: [true, "Please provide start time"],
            match: [
              /^([01]\d|2[0-3]):([0-5]\d)$/,
              "Enter a valid start time in 24-hour format (HH:mm)",
            ],
          },
          end: {
            type: String,
            required: [true, "Please provide end time"],
            match: [
              /^([01]\d|2[0-3]):([0-5]\d)$/,
              "Enter a valid end time in 24-hour format (HH:mm)",
            ],
          },
        },
      ],
      required: [true, "Please provide time slots"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

TourSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "tour",
  justOne: false,
});

TourSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ tour: this._id });
});

module.exports = mongoose.model("Tour", TourSchema);
