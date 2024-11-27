package com.partyhunter.ph;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/seats")
public class SeatController {

    @Autowired
    private SeatRepository seatRepository;

    // Fetch all seats for an event
    @GetMapping("/{eventType}")
    public List<Seat> getSeats(@PathVariable String eventType) {
        return seatRepository.findByEventType(eventType);
    }

    // Reserve seats
    @PostMapping("/reserve")
    public ResponseEntity<List<Seat>> reserveSeats(@RequestBody SeatReservationRequest request, HttpSession session) {
        // Check if the user is logged in
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        // Loop through each seat request
        for (SeatRequest seatRequest : request.getSeats()) {
            Optional<Seat> existingSeat = seatRepository.findByRowNumberAndSeatNumberAndEventType(
                    seatRequest.getRow(), seatRequest.getNumber(), request.getEventType());

            if (existingSeat.isPresent() && existingSeat.get().getIsReserved()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(null); // You can send an error message back if needed
            }

            // Reserve the seat
            Seat seat = existingSeat.orElse(new Seat());
            seat.setRowNumber(seatRequest.getRow());
            seat.setSeatNumber(seatRequest.getNumber());
            seat.setEventType(request.getEventType());
            seat.setReserved(true);
            seat.setUser(user);  // Associate with the logged-in user

            seatRepository.save(seat); // Save the seat to the database
        }

        // Fetch the updated list of seats
        List<Seat> updatedSeats = seatRepository.findByEventType(request.getEventType());
        return ResponseEntity.ok(updatedSeats); // Return the updated seat list
    }

    // DTO classes for request body
    public static class SeatReservationRequest {
        private String eventType;
        private List<SeatRequest> seats;

        public String getEventType() {
            return eventType;
        }

        public void setEventType(String eventType) {
            this.eventType = eventType;
        }

        public List<SeatRequest> getSeats() {
            return seats;
        }

        public void setSeats(List<SeatRequest> seats) {
            this.seats = seats;
        }
    }

    public static class SeatRequest {
        private int row;
        private int number;

        public int getRow() {
            return row;
        }

        public void setRow(int row) {
            this.row = row;
        }

        public int getNumber() {
            return number;
        }

        public void setNumber(int number) {
            this.number = number;
        }
    }
}
