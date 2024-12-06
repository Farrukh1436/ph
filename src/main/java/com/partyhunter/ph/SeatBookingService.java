package com.partyhunter.ph;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SeatBookingService {

    @Autowired
    private SeatRepository seatBookingRepository;

    public int getBookedSeatsByUser(Long userId) {
        return seatBookingRepository.countByUserId(userId);
    }
}

