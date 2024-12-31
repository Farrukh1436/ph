package com.partyhunter.ph;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SeatBookingService {

    @Autowired
    private SeatRepository seatRepository;

    public int getBookedSeatsByUser(Long userId) {
        return seatRepository.countByUserId(userId);
    }
}

