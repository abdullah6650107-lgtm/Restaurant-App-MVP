const express = require("express");
const Reservation = require("../models/Reservation");
const { protect, managerOnly } = require("../middleware/auth");
const { getMyReservations, getAllReservations, createReservation, updateReservationStatus } = require("../controllers/reservationController");

const router = express.Router();
router.post("/", protect, createReservation);
router.get("/my", protect, getMyReservations);
router.get("/", protect, getAllReservations);
router.patch("/:id", protect, managerOnly, updateReservationStatus);
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ error: "Reservation not found." });
    if (req.user.role !== "manager" && reservation.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You cannot cancel this reservation." });
    }
    if (req.user.role !== "manager" && reservation.status !== "pending") {
      return res.status(400).json({ error: "Only pending reservations can be cancelled." });
    }
    await reservation.deleteOne();
    return res.json({ success: true });
  } catch (error) { return next(error); }
});
module.exports = router;
