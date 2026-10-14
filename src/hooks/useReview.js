import { useState } from "react";
import { api } from "../data/api";

export function useReview(token) {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  const submitReview = async () => {
    if (!review.trim()) return false;
    await api.createReview({ rating, text: review.trim() }, token);
    setReview("");
    setRating(5);
    return true;
  };

  return { rating, setRating, review, setReview, submitReview };
}
