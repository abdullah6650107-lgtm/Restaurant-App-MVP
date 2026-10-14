const Review = require("../models/Review");
async function createReview(req, res, next) {
  try {
    const rating = Number(req.body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be an integer from 1 to 5." });
    }
    const review = await Review.create({ customer: req.user._id, rating, text: req.body.text ? String(req.body.text).trim() : "" });
    return res.status(201).json({ review });
  } catch (error) { return next(error); }
}
module.exports = { createReview };
