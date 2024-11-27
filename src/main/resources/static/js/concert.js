"use strict";

// Observer to run multiple functions at the same time
class Observer {
  constructor() {
    this.storage = [];
  }

  subscribe(fn) {
    this.storage.push(fn);
  }

  unsubscribe(fn) {
    this.storage = this.storage.filter(item => item !== fn);
  }

  broadcast(...data) {
    this.storage.forEach(item => item(...data));
  }
}

// Hall class is responsible for creating row nodes and handling click event on it
class Hall {
  constructor(element) {
    this.space = element;
    this.set = []; // Array of rows of all seats
  }

  fill(rowLength, setLength) {
    for (let i = 0; i < setLength; i++) {
      const row = [];

      for (let j = 0; j < rowLength; j++) {
        row[j] = new Seat();
      }

      this.set[i] = row;
    }
  }

  createNodes() {
    this.set.forEach(createRow.bind(this));

    function createRow(row, index) {
      const rowElement = document.createElement("div");
      rowElement.className = "seats__row";
      rowElement.dataset.index = index;

      row.forEach((seat, index) => {
        seat.createNode(index, Number(rowElement.dataset.index));
        rowElement.appendChild(seat.element);
      });

      this.space.appendChild(rowElement);
    }

    this.space.addEventListener("click", this.handleClick.bind(this));
  }

  handleClick({ target, currentTarget }) {
    while (target !== currentTarget) {
      if (target.classList.contains("seats__item")) {
        const rowIndex = target.parentNode.dataset.index;
        const seatIndex = target.dataset.index;
        const currentHash = String(rowIndex + seatIndex);
        const currentSeat = this.set[rowIndex][seatIndex];

        currentSeat.toggleSelection();
        updateObserver.broadcast(currentHash, currentSeat);
      }

      target = target.parentNode;
    }
  }
}

// Seat class creates the seat nodes
class Seat {
  constructor() {
    this.element = null;
    this.numberElement = null;
    this.number = null;
    this.row = null;
    this.availible = true;
  }

  createNode(index, row) {
    this.element = document.createElement("div");
    this.numberElement = document.createElement("span");

    this.element.className = "seats__item";
    this.numberElement.className = "seats__item-num";

    this.number = index + 1;
    this.row = row + 1;

    this.element.dataset.index = index;
    this.element.dataset.row = row;
    this.numberElement.textContent = this.number;
    this.element.appendChild(this.numberElement);
  }

  toggleSelection() {
    this.element.classList.toggle("seats__item_selected");
    this.availible = !this.availible;
  }
}

// Counter updates the total price
class Counter {
  constructor(element) {
    this.element = element;
    this.storage = new Map();
    this.total = 0;
    this.price = 18;
    this.currency = "$";
  }

  add(key, value) {
    this.storage.set(key, value);
    this.total += this.price;
  }

  remove(key) {
    this.storage.delete(key);
    this.total -= this.price;
  }

  has(key) {
    return this.storage.has(key);
  }

  toggleSum(hash, seat) {
    this.has(hash) ? this.remove(hash) : this.add(hash, seat);
  }

  updateSum() {
    const amount = this.storage.size;
    const word = amount > 1 ? "tickets" : "ticket";
    const sentence = `${amount} ${word} for ${this.total}${this.currency}`;

    this.element.textContent = amount > 0 ? sentence : "";
  }

  isEmpty() {
    return this.storage.size === 0;
  }
}

class Button {
  constructor(element) {
    this.element = element;
  }

  toggle() {
    this.element.disabled = counter.isEmpty();
  }
}

// Fetch current seat statuses when the page loads
function fetchSeats() {
  fetch("/seats/concert")
      .then(response => response.json())
      .then(updatedSeats => {
        updatedSeats.forEach(seat => {
          // Query the seat element using data-index and data-row attributes
          const seatElement = document.querySelector(`.seats__item[data-index="${seat.seatNumber - 1}"][data-row="${seat.rowNumber - 1}"]`);

          // Check if the seat is reserved (from the backend response)
          if (seat.isReserved) {
            seatElement.classList.add("seats__item_booked");
            seatElement.style.backgroundColor = "red"; // Change to red if booked
            seatElement.classList.remove("seats__item_selected");
          } else {
            seatElement.classList.remove("seats__item_booked");
            seatElement.classList.add("seats__item_selected");
            seatElement.style.backgroundColor = ""; // Reset if not booked
          }
        });
      })
      .catch(error => {
        console.error("Error fetching seats:", error);
      });
}

// Add event listener to the Buy button
document.querySelector(".button").addEventListener("click", () => {
  if (!counter.isEmpty()) {
    const selectedSeats = [];
    document.querySelectorAll(".seats__item_selected").forEach(seat => {
      const row = parseInt(seat.parentElement.dataset.index, 10) + 1; // Convert to 1-based index
      const number = parseInt(seat.dataset.index, 10) + 1; // Convert to 1-based index
      selectedSeats.push({ row, number });
    });

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    // Send reservation request to the backend
    fetch("/seats/reserve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seats: selectedSeats,
        eventType: "concert", // Replace with dynamic event type if needed
      }),
    })
        .then(response => {
          if (!response.ok) {
            return response.text().then(error => {
              throw new Error(error);
            });
          }
          return response.json(); // Get updated seat list
        })
        .then(updatedSeats => {
          swal({
            title: "Success!",
            text: `You have successfully booked ${counter.storage.size} tickets for a total of ${counter.total}${counter.currency}.`,
            icon: "success",
            button: "OK",
          }).then(() => {
            // Update seat availability and change color to red for reserved seats
            updatedSeats.forEach(seat => {
              const seatElement = document.querySelector(`.seats__item[data-index="${seat.seatNumber - 1}"][data-row="${seat.rowNumber - 1}"]`);

              if (seat.isReserved) {
                seatElement.classList.remove("seats__item_selected");
                seatElement.classList.add("seats__item_booked");
                seatElement.style.backgroundColor = "red"; // Change color to red for booked seats
              } else {
                seatElement.classList.remove("seats__item_booked");
                seatElement.classList.add("seats__item_selected");
                seatElement.style.backgroundColor = ""; // Reset color for available seats
              }
            });

            // Reset counter and UI after booking
            counter.storage.clear();
            counter.total = 0;
            counter.updateSum();
            button.toggle();
          });
        })
        .catch(error => {
          console.error("Error:", error);
          alert(error.message || "Failed to reserve seats.");
        });
  }
});

const updateObserver = new Observer();
const counter = new Counter(document.querySelector(".info-box__price"));
const cinema = new Hall(document.querySelector(".seats"));
const button = new Button(document.querySelector(".button"));

cinema.fill(14, 9);
cinema.createNodes();
updateObserver.subscribe(counter.toggleSum.bind(counter));
updateObserver.subscribe(counter.updateSum.bind(counter));
updateObserver.subscribe(button.toggle.bind(button));

// Fetch current seat statuses when the page loads
fetchSeats();
