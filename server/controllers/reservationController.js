const mongoose = require("mongoose");
const Reservation = require("../models/Reservation");
const Table = require("../models/Table");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function getMyReservations(req, res, next) {
  try {
    const reservations = await Reservation.find({ customer: req.user._id }).populate("customer", "name email").populate("table", "tableNumber capacity location").sort({ reservationDate: 1 });
    return res.json({ reservations });
  } catch (error) {
    return next(error);
  }
}

async function getAllReservations(req, res, next) {
  try {
    const query = req.user.role === "manager" ? {} : { customer: req.user._id };
    const reservations = await Reservation.find(query).populate("customer", "name email").populate("table", "tableNumber capacity location").sort({ reservationDate: 1 });
    return res.json({ reservations });
  } catch (error) {
    return next(error);
  }
}

async function createReservation(req, res, next) {
  try {
    const { tableId, date, time, partySize, notes, name } = req.body;

    if (tableId && !isValidObjectId(String(tableId))) {
      return res.status(400).json({ error: "A valid table ID is required." });
    }

    if (!date || !time) {
      return res.status(400).json({ error: "Reservation date and time are required." });
    }

    const partyCount = Number(partySize);
    if (!Number.isInteger(partyCount) || partyCount < 1) {
      return res.status(400).json({ error: "Party size must be at least 1." });
    }

    const tables = tableId
      ? [await Table.findById(tableId)]
      : await Table.find({ isAvailable: true, capacity: { $gte: partyCount } }).sort({ capacity: 1, tableNumber: 1 });
    if (!tables.length || !tables[0]) return res.status(404).json({ error: "No suitable table was found." });

    const reservationDate = new Date(`${date}T${time}:00`);
    if (Number.isNaN(reservationDate.getTime())) {
      return res.status(400).json({ error: "Invalid reservation date/time." });
    }

    const start = new Date(reservationDate);
    const end = new Date(start.getTime() + 90 * 60 * 1000);

    let table = null;
    for (const candidate of tables) {
      if (partyCount > candidate.capacity) continue;
      const conflict = await Reservation.findOne({
        table: candidate._id,
        status: { $ne: "declined" },
        reservationDate: { $lt: end, $gt: new Date(start.getTime() - 90 * 60 * 1000) },
      });
      if (!conflict) { table = candidate; break; }
    }

    if (!table) {
      return res.status(409).json({ error: "That table is already booked for the requested time slot." });
    }

    const reservation = await Reservation.create({
      customer: req.user._id,
      customerName: name ? String(name).trim() : req.user.name,
      table: table._id,
      reservationDate,
      partySize: partyCount,
      notes: notes ? String(notes).trim() : "",
      status: "pending",
    });

    const populated = await Reservation.findById(reservation._id).populate("table", "tableNumber capacity location");
    return res.status(201).json({ reservation: populated });
  } catch (error) {
    return next(error);
  }
}

async function updateReservationStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid reservation ID." });
    }

    if (!status || !["accepted", "declined"].includes(status)) {
      return res.status(400).json({ error: "Status must be accepted or declined." });
    }

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found." });
    }

    reservation.status = status;
    await reservation.save();
    return res.json({ reservation });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getMyReservations,
  getAllReservations,
  createReservation,
  updateReservationStatus,
};
