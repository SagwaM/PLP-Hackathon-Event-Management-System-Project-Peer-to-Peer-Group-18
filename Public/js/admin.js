document.addEventListener('DOMContentLoaded', () => {
    const eventTable = document.getElementById('eventTable');
    const eventForm = document.getElementById('eventForm');
    const eventModal = new bootstrap.Modal(document.getElementById('eventModal'));
    let isEdit = false;
    let currentEventId = null;
  
    // Fetch events and display them in the table
    const fetchEvents = async () => {
      const res = await fetch('/api/events');
      const events = await res.json();
      eventTable.innerHTML = '';
      events.forEach((event) => {
        eventTable.innerHTML += `
          <tr>
            <td>${event.id}</td>
            <td>${event.title}</td>
            <td>${event.description}</td>
            <td>${event.date}</td>
            <td>
              <button class="btn btn-primary btn-sm edit-btn" data-id="${event.id}" data-title="${event.title}" data-description="${event.description}" data-date="${event.date}">Edit</button>
              <button class="btn btn-danger btn-sm delete-btn" data-id="${event.id}">Delete</button>
            </td>
          </tr>
        `;
      });
  
      // Attach event listeners to buttons
      document.querySelectorAll('.edit-btn').forEach((button) => {
        button.addEventListener('click', handleEditEvent);
      });
  
      document.querySelectorAll('.delete-btn').forEach((button) => {
        button.addEventListener('click', handleDeleteEvent);
      });
    };
  
    // Handle Add/Edit Event form submission
    eventForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
      const date = document.getElementById('date').value;
  
      if (isEdit) {
        // Edit event
        await fetch(`/api/events/${currentEventId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, date }),
        });
      } else {
        // Add new event
        await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, date }),
        });
      }
  
      fetchEvents();
      eventModal.hide();
      eventForm.reset();
      isEdit = false;
    });
  
    // Handle edit event
    const handleEditEvent = (e) => {
      const button = e.target;
      currentEventId = button.getAttribute('data-id');
      document.getElementById('title').value = button.getAttribute('data-title');
      document.getElementById('description').value = button.getAttribute('data-description');
      document.getElementById('date').value = button.getAttribute('data-date');
      isEdit = true;
      eventModal.show();
    };
  
    // Handle delete event
    const handleDeleteEvent = async (e) => {
      const eventId = e.target.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this event?')) {
        await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
        fetchEvents();
      }
    };
  
    // Initial fetch
    fetchEvents();
  });
  