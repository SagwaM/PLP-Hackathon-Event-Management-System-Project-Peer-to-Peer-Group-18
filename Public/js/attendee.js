// Fetch and display events
async function loadEvents() {
  try {
      const res = await fetch('/api/events');
      const events = await res.json();
      const categoryFilter = document.getElementById('category-filter');
      const eventList = document.getElementById('event-list');
      
      // Clear previous events and categories
      eventList.innerHTML = '';
      categoryFilter.innerHTML = '<option value="">All Categories</option>'; // Reset categories

      // Assuming your API has a list of categories
      const categories = await fetch('/api/categories');
      const categoryData = await categories.json();
      categoryData.forEach(category => {
          const option = document.createElement('option');
          option.value = category.name;
          option.textContent = category.name;
          categoryFilter.appendChild(option);
      });

      // Render events
      events.forEach(event => {
          const eventCard = document.createElement('div');
          eventCard.classList.add('event-card');
          eventCard.innerHTML = `
              <h3>${event.title}</h3>
              <p>${event.description}</p>
              <p><strong>Date:</strong> ${event.event_date}</p>
              <button>Register</button>
          `;
          eventList.appendChild(eventCard);
      });
  } catch (error) {
      console.error('Error loading events:', error);
  }
}

// Filter events based on category or search term
function filterEvents() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const selectedCategory = document.getElementById('category-filter').value;
  const eventCards = document.querySelectorAll('.event-card');
  
  eventCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const description = card.querySelector('p').textContent.toLowerCase();
      const categoryMatch = selectedCategory ? card.classList.contains(selectedCategory) : true;
      const searchMatch = title.includes(searchTerm) || description.includes(searchTerm);
      
      if (categoryMatch && searchMatch) {
          card.style.display = 'block';
      } else {
          card.style.display = 'none';
      }
  });
}

// Fetch and display registered events
async function loadRegisteredEvents() {
  try {
      const res = await fetch('/api/attendee/registered-events');
      const events = await res.json();
      const registeredEventsSection = document.getElementById('registered-events');
      
      // Clear previous events
      registeredEventsSection.innerHTML = '';

      if (events.length === 0) {
          registeredEventsSection.innerHTML = '<p>No upcoming events you are registered for.</p>';
          return;
      }

      events.forEach(event => {
          const eventCard = document.createElement('div');
          eventCard.classList.add('event-card');
          eventCard.innerHTML = `
              <h3>${event.title}</h3>
              <p><strong>Date:</strong> ${event.event_date}</p>
              <p><strong>Location:</strong> ${event.location}</p>
              <p><strong>Payment Status:</strong> ${event.payment_status}</p>
              <button onclick="cancelRegistration(${event.registration_id})">Cancel Registration</button>
          `;
          registeredEventsSection.appendChild(eventCard);
      });
  } catch (error) {
      console.error('Error loading registered events:', error);
  }
}

// Cancel registration for an event
async function cancelRegistration(registrationId) {
  if (confirm("Are you sure you want to cancel your registration for this event?")) {
      try {
          const res = await fetch(`/api/attendee/cancel-registration/${registrationId}`, {
              method: 'DELETE'
          });
          const result = await res.json();
          if (result.success) {
              alert("Registration canceled successfully.");
              loadRegisteredEvents(); // Reload events after cancellation
          } else {
              alert("Failed to cancel registration.");
          }
      } catch (error) {
          console.error('Error canceling registration:', error);
      }
  }
}

// attendee.js
document.addEventListener('DOMContentLoaded', async function() {
  const response = await fetch('/attendee/bookings');
  const bookings = await response.json();
  
  const eventsContainer = document.getElementById('upcoming-events');
  bookings.forEach(booking => {
    const eventDiv = document.createElement('div');
    eventDiv.classList.add('event-card');
    eventDiv.innerHTML = `
      <h4>${booking.title}</h4>
      <p>Date: ${booking.event_date}</p>
      <p>Location: ${booking.location}</p>
      <p>Payment Status: ${booking.payment_status}</p>
      <button class="btn btn-danger" onclick="cancelBooking(${booking.bookings_id})">Cancel Booking</button>
    `;
    eventsContainer.appendChild(eventDiv);
  });
});

async function cancelBooking(bookingId) {
  const response = await fetch(`/attendee/bookings/${bookingId}`, { method: 'DELETE' });
  if (response.ok) {
    location.reload(); // Reload the page to reflect the change
  }
}

// Load categories and events for registration
async function loadCategories() {
  const response = await fetch('/attendee/categories');
  const categories = await response.json();
  const categorySelect = document.getElementById('category-filter');
  categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.categories_id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
  });
}

loadCategories();

document.getElementById("addAttendeeForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = document.getElementById("attendeeName").value;
  const email = document.getElementById("attendeeEmail").value;
  const eventId = document.getElementById("eventId").value;

  try {
      // Send attendee data to the backend
      const response = await fetch('/api/attendees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, eventId })
      });

      if (response.ok) {
          alert("Attendee added successfully!");
          fetchAttendees(); // Refresh attendee list
          document.getElementById("addAttendeeForm").reset();
      } else {
          alert("Failed to add attendee.");
      }
  } catch (error) {
      console.error("Error adding attendee:", error);
  }
});

// Fetch and display attendees
async function fetchAttendees() {
  try {
      const response = await fetch('/api/attendees');
      const attendees = await response.json();

      const tableBody = document.getElementById("attendeeTableBody");
      tableBody.innerHTML = ""; // Clear existing rows

      attendees.forEach(attendee => {
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${attendee.name}</td>
              <td>${attendee.email}</td>
              <td>${attendee.eventName}</td>
              <td>
                  <button onclick="deleteAttendee('${attendee.id}')">Delete</button>
              </td>
          `;
          tableBody.appendChild(row);
      });
  } catch (error) {
      console.error("Error fetching attendees:", error);
  }
}

// Delete attendee
async function deleteAttendee(id) {
  try {
      const response = await fetch(`/api/attendees/${id}`, {
          method: 'DELETE'
      });

      if (response.ok) {
          alert("Attendee deleted successfully!");
          fetchAttendees(); // Refresh attendee list
      } else {
          alert("Failed to delete attendee.");
      }
  } catch (error) {
      console.error("Error deleting attendee:", error);
  }
}

// Fetch attendees on page load
fetchAttendees();

// Call loadRegisteredEvents when the page is ready
document.addEventListener('DOMContentLoaded', loadRegisteredEvents);

