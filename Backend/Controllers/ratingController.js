import { addRatingModel, getRatingsModel } from "../Models/ratingModel.js";


export const getRatings = async (req, res) => {
  const { user_id, appointment_id } = req.query;

  try {
    const ratings = await getRatingsModel({ user_id, appointment_id });
    res.status(200).json({ success: true, data: ratings });
  } catch (error) {
    console.error("Fetch ratings error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch ratings" });
  }
};

export const addRating = async (req, res) => {
  const { user_id, appointment_id, rating, comments } = req.body;

  try {
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    await addRatingModel({ user_id, appointment_id, rating, comments });
    res.status(201).json({ success: true, message: "Rating submitted successfully" });
  } catch (error) {
    console.error("Rating error:", error);
    res.status(500).json({ success: false, message: "Failed to submit rating" });
  }
};
