document.getElementById('category-filter').addEventListener('change', function () {
    const category = this.value;
    const url = category
        ? `http://localhost:3000/api/events?category=${encodeURIComponent(category)}`
        : 'http://localhost:3000/api/events';

    fetch(url)
        .then(response => response.json())
        .then(renderEvents);
});
