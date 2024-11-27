package com.partyhunter.ph;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByEventType(String eventType);
    // Use exact field names from the Seat entity
    Optional<Seat> findByRowNumberAndSeatNumberAndEventType(int rowNumber, int seatNumber, String eventType);
}
