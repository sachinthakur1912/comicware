const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    yearOfPublication: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0, // Optional field, default to 0 if no discount is applied
    },
    numberOfPages: {
      type: Number,
      required: true,
    },
    condition: {
      type: String,
      enum: ["new", "used"], // The condition can only be 'new' or 'used'
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: "", // Optional description field
    },
  },
  {
    timestamps: true, // This will automatically add createdAt and updatedAt timestamps
  }
);

// Export the Book model
module.exports = mongoose.model("Book", bookSchema);
