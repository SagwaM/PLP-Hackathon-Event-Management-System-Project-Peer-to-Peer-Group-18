document.getElementById("add-event-form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const date = document.getElementById("date").value;
  
    if (!title || !description || !date) {
      alert("All fields are required!");
      return;
    }
  
    const eventDate = new Date(date);
    const today = new Date();
    if (eventDate < today) {
      alert("Event date cannot be in the past!");
      return;
    }
  
    // Submit form data
    fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, date }),
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message || 'Event added successfully!');
        window.location.href = 'index.html';
      })
      .catch(err => console.error('Error adding event:', err));
  });


