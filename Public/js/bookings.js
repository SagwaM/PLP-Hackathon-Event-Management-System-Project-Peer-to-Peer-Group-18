// Function to fetch and display all events
function fetchEvents() {
    fetch('http://localhost:3000/api/events')
        .then(response => response.json())
        .then(events => {
            const eventList = document.getElementById('event-list');
            eventList.innerHTML = ''; // Clear the event list

            events.forEach(event => {
                const eventRow = document.createElement('tr');
                eventRow.setAttribute('data-event-id', event.id); // Store event ID
                eventRow.innerHTML = `
                    <td>${event.title}</td>
                    <td>${event.event_date}</td>
                    <td>${event.location}</td>
                    <td>${event.description}</td>
                    <td>${event.max_participants}</td>
                    <td>${event.price}</td>
                    <td><img src="${event.image_url}" alt="${event.title}" width="50"></td>
                    <td>
                        <button class="book-btn" onclick="bookEvent(${event.id})">Book</button>
                    </td>
                `;
                eventList.appendChild(eventRow);
            });
        })
        .catch(error => console.error('Error fetching events:', error));
}

// Function to book an event
function bookEvent(eventId) {
    // Get event data from the event list
    fetch(`http://localhost:3000/api/events/${eventId}`)
        .then(response => response.json())
        .then(event => {
            // Store the booked event in local storage
            let bookings = JSON.parse(localStorage.getItem('myBookings')) || [];
            // Check if event is already booked
            if (bookings.some(booking => booking.id === event.id)) {
                alert(`You have already booked this event: ${event.title}`);
                return;
            }

            bookings.push(event);
            localStorage.setItem('myBookings', JSON.stringify(bookings));

            // Show confirmation message
            alert(`You have successfully booked: ${event.title}`);

            // Update My Bookings section
            updateBookings();
        })
        .catch(error => console.error('Error booking event:', error));
}

// Function to update the "My Bookings" section
function updateBookings() {
    const bookingsContainer = document.getElementById('my-bookings');
    if (!bookingsContainer) return; // Ensure the container exists
    bookingsContainer.innerHTML = ''; // Clear current bookings

    const bookings = JSON.parse(localStorage.getItem('myBookings')) || [];
    if (bookings.length === 0) {
        bookingsContainer.innerHTML = '<p>No bookings yet.</p>';
        return;
    }

    bookings.forEach(booking => {
        const bookingElement = document.createElement('div');
        bookingElement.className = 'booking';
        bookingElement.innerHTML = `
            <h4>${booking.title}</h4>
            <p>Date: ${booking.event_date}</p>
            <p>Location: ${booking.location}</p>
            <button onclick="cancelBooking(${booking.id})">Cancel Booking</button>
        `;
        bookingsContainer.appendChild(bookingElement);
    });
}

// Function to cancel a booking
function cancelBooking(eventId) {
    let bookings = JSON.parse(localStorage.getItem('myBookings')) || [];
    bookings = bookings.filter(booking => booking.id !== eventId);
    localStorage.setItem('myBookings', JSON.stringify(bookings));

    alert('Booking canceled successfully!');
    updateBookings();
}

// Initialize the event and bookings display
document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();
    updateBookings();
});
