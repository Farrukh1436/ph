package com.partyhunter.ph;

import jakarta.persistence.*;
import org.antlr.v4.runtime.misc.NotNull;

@Entity
@Table(name = "seats")
public class Seat
{


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @NotNull
    @Column(name = "`row_number`")  // Escaping row_number to avoid syntax error
    private int rowNumber; // Ensure this field matches the query method
    @NotNull
    private int seatNumber;
    private boolean isReserved;
    @NotNull
    private String eventType;
    private String reservedBy;  // Optional: User reference

    @ManyToOne
    private User user;  // Null if not booked

    @Override
    public String toString() {
        return "Seat{" +
                "id=" + id +
                ", rowNumber=" + rowNumber +
                ", seatNumber=" + seatNumber +
                ", isReserved=" + isReserved +
                ", eventType='" + eventType + '\'' +
                ", reservedBy='" + reservedBy + '\'' +
                ", user=" + user +
                '}';
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getRowNumber() {
        return rowNumber;
    }

    public void setRowNumber(int rowNumber) {
        this.rowNumber = rowNumber;
    }

    public int getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(int seatNumber) {
        this.seatNumber = seatNumber;
    }

    public boolean getIsReserved() {
        return isReserved;
    }

    public void setReserved(boolean reserved) {
        isReserved = reserved;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getReservedBy() {
        return reservedBy;
    }

    public void setReservedBy(String reservedBy) {
        this.reservedBy = reservedBy;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
    // Getters and Setters

}