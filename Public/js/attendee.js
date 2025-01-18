document.addEventListener('DOMContentLoaded', () => {
    const eventContainer = document.getElementById('eventContainer');
    const eventDetailsModal = new bootstrap.Modal(document.getElementById('eventDetailsModal'));
    const eventTitle = document.getElementById('eventTitle');
    const eventDescription = document.getElementById('eventDescription');
    const eventDate = document.getElementById('eventDate');
    const bookEventBtn = document.getElementById('bookEventBtn');
    const pagination = document.getElementById('pagination');
    let currentPage = 1;
    const eventsPerPage = 5;
  
    // Fetch events and display them with pagination
    const fetchEvents = async () => {
      const res = await fetch('/api/events');
      const events = await res.json();
      renderEvents(events);
      renderPagination(events.length);
    };
  
    // Render events for the current page
    const renderEvents = (events) => {
      eventContainer.innerHTML = '';
      const start = (currentPage - 1) * eventsPerPage;
      const end = start + eventsPerPage;
      const paginatedEvents = events.slice(start, end);
  
      paginatedEvents.forEach((event) => {
        eventContainer.innerHTML += `
          <div class="col-md-4 mb-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">${event.title}</h5>
                <p class="card-text">${event.description.substring(0, 50)}...</p>
                <p class="card-text"><strong>Date:</strong> ${event.date}</p>
                <button class="btn btn-primary btn-sm view-btn" data-id="${event.id}" data-title="${event.title}" data-description="${event.description}" data-date="${event.date}">View Details</button>
              </div>
            </div>
          </div>
        `;
      });
  
      // Attach event listeners to view buttons
      document.querySelectorAll('.view-btn').forEach((button) => {
        button.addEventListener('click', handleViewEvent);
      });
    };
  
    // Render pagination buttons
    const renderPagination = (totalEvents) => {
      const totalPages = Math.ceil(totalEvents / eventsPerPage);
      pagination.innerHTML = '';
      for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
          <li class="page-item ${i === currentPage ? 'active' : ''}">
            <button class="page-link">${i}</button>
          </li>
        `;
      }
  
      // Attach event listeners to pagination buttons
      document.querySelectorAll('.page-link').forEach((button, index) => {
        button.addEventListener('click', () => {
          currentPage = index + 1;
          fetchEvents();
        });
      });
    };
  
    // Handle view event details
    const handleViewEvent = (e) => {
      const button = e.target;
      eventTitle.textContent = button.getAttribute('data-title');
      eventDescription.textContent = button.getAttribute('data-description');
      eventDate.textContent = button.getAttribute('data-date');
      bookEventBtn.setAttribute('data-id', button.getAttribute('data-id'));
      eventDetailsModal.show();
    };
  
    // Handle book event
    bookEventBtn.addEventListener('click', async () => {
      const eventId = bookEventBtn.getAttribute('data-id');
      const attendeeName = prompt('Enter your name:');
      const attendeeEmail = prompt('Enter your email:');
      if (attendeeName && attendeeEmail) {
        await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId, attendeeName, attendeeEmail }),
        });
        alert('Booking successful!');
        eventDetailsModal.hide();
      }
    });
  
    // Initial fetch
    fetchEvents();
  });
  