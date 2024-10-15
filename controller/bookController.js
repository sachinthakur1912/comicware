const Book = require("../model/bookModel"); // Adjust the path as necessary

const Joi = require("joi"); // Import Joi

// Define the validation schema
const comicBookSchema = Joi.object({
  name: Joi.string().required(),
  author: Joi.string().required(),
  yearOfPublication: Joi.number()
    .integer()
    .min(1000)
    .max(new Date().getFullYear())
    .required(),
  price: Joi.number().positive().required(),
  numberOfPages: Joi.number().integer().positive().required(),
  condition: Joi.string().valid("new", "used").required(),
  description: Joi.string().allow(""), // Description is optional
});

// Controller to create a comic book
exports.createComicBook = async (req, res) => {
  try {
    // Validate the request body
    const { error } = comicBookSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      name,
      author,
      yearOfPublication,
      price,
      numberOfPages,
      condition,
      description,
    } = req.body;

    // Create a new comic book
    const newComic = await Book.create({
      name,
      author,
      yearOfPublication,
      price,
      numberOfPages,
      condition,
      description,
    });

    // Return success response
    return res.status(201).json({
      message: "Comic book created successfully",
      data: newComic,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Controller to edit a comic book

// Define the validation schema for editing a comic book
const editComicBookSchema = Joi.object({
  name: Joi.string().optional(),
  author: Joi.string().optional(),
  yearOfPublication: Joi.number()
    .integer()
    .min(1000)
    .max(new Date().getFullYear())
    .optional(),
  price: Joi.number().positive().optional(),
  numberOfPages: Joi.number().integer().positive().optional(),
  condition: Joi.string().valid("new", "used").optional(),
  description: Joi.string().allow("").optional(),
});

// Updated editComicBook function with validation
exports.editComicBook = async (req, res) => {
  try {
    const {
      name,
      author,
      yearOfPublication,
      price,
      numberOfPages,
      condition,
      description,
    } = req.body;
    const { comicId } = req.params;

    // Check if comicId is provided
    if (!comicId) {
      return res.status(400).json({ message: "Comic book not found" });
    }

    // Validate the request body
    const { error } = editComicBookSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if at least one field is provided for update
    if (
      !name &&
      !author &&
      !yearOfPublication &&
      !price &&
      !numberOfPages &&
      !condition &&
      !description
    ) {
      return res
        .status(400)
        .json({ message: "Please provide at least one field to update" });
    }

    // Update the comic book
    const updatedComic = await Book.findByIdAndUpdate(
      comicId,
      {
        name,
        author,
        yearOfPublication,
        price,
        numberOfPages,
        condition,
        description,
      },
      { new: true }
    );

    // Check if comic book was found and updated
    if (!updatedComic) {
      return res.status(404).json({ message: "Comic book not found" });
    }

    // Return success response
    return res.status(200).json({
      message: "Comic book updated successfully",
      data: updatedComic,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Controller to delete a comic book
exports.deleteComicBook = async (req, res) => {
  try {
    const { comicId } = req.params;

    // Check if comicId is provided
    if (!comicId) {
      return res.status(400).json({ message: "Comic book ID not provided" });
    }

    // Delete the comic book
    const deletedComic = await Book.findByIdAndDelete(comicId);

    // Check if comic book was found and deleted
    if (!deletedComic) {
      return res.status(404).json({ message: "Comic book not found" });
    }

    // Return success response
    return res.status(200).json({
      message: "Comic book deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// Controller to get full details of a comic book
exports.getComicBookDetails = async (req, res) => {
  try {
    const { comicId } = req.params;

    // Check if comicId is provided
    if (!comicId) {
      return res.status(400).json({ message: "Comic book ID not provided" });
    }

    // Fetch the comic book details
    const comicBook = await Book.findById(comicId);

    // Check if comic book was found
    if (!comicBook) {
      return res.status(404).json({ message: "Comic book not found" });
    }

    // Return success response
    return res.status(200).json({
      message: "Comic book details retrieved successfully",
      data: comicBook,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// Controller to fetch inventory list with pagination, filtering, and sorting
exports.getInventoryList = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "name",
      order = "asc",
      ...filters
    } = req.query;

    // Build the query object for filtering
    const query = {};
    if (filters.author) query.author = filters.author;
    if (filters.yearOfPublication)
      query.yearOfPublication = filters.yearOfPublication;
    if (filters.price) query.price = { $lte: filters.price };
    if (filters.condition) query.condition = filters.condition;

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch the comic books with pagination, filtering, and sorting
    const comics = await Book.find(query)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get the total count of documents matching the query
    const total = await Book.countDocuments(query);

    // Return success response
    return res.status(200).json({
      message: "Inventory list retrieved successfully",
      data: comics,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
