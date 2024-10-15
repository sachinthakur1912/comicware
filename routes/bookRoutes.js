const express = require("express");
const router = express.Router();

// Import controller functions
const {
  createComicBook,
  editComicBook,
  deleteComicBook,
  getComicBookDetails,
  getInventoryList,
} = require("../controller/bookController");

// Route to create a new comic book
router.post("/create", createComicBook);

// Routes to get, delete, and edit comic book details by comicId
router
  .route("/:comicId")
  .get(getComicBookDetails) // Get details of a specific comic book
  .delete(deleteComicBook) // Delete a specific comic book
  .put(editComicBook); // Edit a specific comic book

// Route to get the inventory list of comic books
router.get("/inventory", getInventoryList);

module.exports = router;
