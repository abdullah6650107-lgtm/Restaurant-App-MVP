import { useCallback, useState } from "react";
import { api } from "../data/api";

export function useReservations() {
  const [reservations, setReservations] = useState([]);

  const addReservation = useCallback(async (reservation, token) => {
    if (!token) throw new Error("Please log in before making a reservation.");
    const { reservation: savedReservation } = await api.createReservation(
      reservation,
      token
    );
    setReservations((current) => [savedReservation, ...current]);
    return savedReservation;
  }, []);

  const cancelReservation = useCallback(async (reservationId, token) => {
    await api.cancelReservation(reservationId, token);
    setReservations((current) =>
      current.filter((reservation) => reservation.id !== reservationId)
    );
  }, []);

  return { reservations, setReservations, addReservation, cancelReservation };
}
