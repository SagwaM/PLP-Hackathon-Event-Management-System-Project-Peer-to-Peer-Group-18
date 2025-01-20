// Handle Add Category Form Submission
$('#addCategoryForm').submit(function (event) {
    event.preventDefault();
  
    const categoryName = $('#categoryName').val().trim();
    if (!categoryName) {
      alert('Category name is required');
      return;
    }
  
    $.ajax({
      url: '/api/categories/create-category', // Endpoint for creating categories
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ categoryName }),
      success: function (response) {
        alert('Category added successfully!');
        $('#addCategoryModal').modal('hide'); // Close the modal
        $('#categoryName').val(''); // Clear the input
        loadCategories(); // Reload the categories dropdown
      },
      error: function () {
        alert('Error adding category');
      }
    });
  });
  
  // Load categories and populate dropdown
  function loadCategories() {
    $.ajax({
      url: '/api/categories/get-categories', // Endpoint for fetching categories
      method: 'GET',
      success: function (categories) {
        const categoryDropdown = $('#eventCategory');
        categoryDropdown.empty();
        categoryDropdown.append('<option value="" disabled selected>Select Category</option>');
        categories.forEach(category => {
          categoryDropdown.append(`<option value="${category.id}">${category.name}</option>`);
        });
      },
      error: function () {
        alert('Error loading categories');
      }
    });
  }
  
  // Call loadCategories on page load
  $(document).ready(function () {
    loadCategories();
  });
  