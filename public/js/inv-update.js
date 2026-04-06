const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("button")
      updateBtn.removeAttribute("disabled")
    })


function validateInventoryForm() {
    let isValid = true;
    
    // Clear all error messages
    document.getElementById('classificationError').style.display = 'none';
    document.getElementById('makeError').style.display = 'none';
    document.getElementById('modelError').style.display = 'none';
    document.getElementById('yearError').style.display = 'none';
    document.getElementById('descriptionError').style.display = 'none';
    document.getElementById('imageError').style.display = 'none';
    document.getElementById('thumbnailError').style.display = 'none';
    document.getElementById('priceError').style.display = 'none';
    document.getElementById('milesError').style.display = 'none';
    document.getElementById('colorError').style.display = 'none';
    
    // Classification validation
    const classification = document.getElementById('classificationSelect').value.trim();
    if (!classification) {
        document.getElementById('classificationError').textContent = 'Classification is required.';
        document.getElementById('classificationError').style.display = 'block';
        isValid = false;
    }
    
    // Make validation
    const make = document.getElementById('inv_make').value.trim();
    if (!make) {
        document.getElementById('makeError').textContent = 'Make is required.';
        document.getElementById('makeError').style.display = 'block';
        isValid = false;
    } else if (make.length < 3) {
        document.getElementById('makeError').textContent = 'Make must be at least 3 characters.';
        document.getElementById('makeError').style.display = 'block';
        isValid = false;
    }
    
    // Model validation
    const model = document.getElementById('inv_model').value.trim();
    if (!model) {
        document.getElementById('modelError').textContent = 'Model is required.';
        document.getElementById('modelError').style.display = 'block';
        isValid = false;
    } else if (model.length < 3) {
        document.getElementById('modelError').textContent = 'Model must be at least 3 characters.';
        document.getElementById('modelError').style.display = 'block';
        isValid = false;
    }
    
    // Year validation
    const year = parseInt(document.getElementById('inv_year').value);
    if (!year || isNaN(year)) {
        document.getElementById('yearError').textContent = 'Year is required.';
        document.getElementById('yearError').style.display = 'block';
        isValid = false;
    } else if (year < 1900 || year > 2099) {
        document.getElementById('yearError').textContent = 'Year must be between 1900 and 2099.';
        document.getElementById('yearError').style.display = 'block';
        isValid = false;
    }
    
    // Description validation
    const description = document.getElementById('inv_description').value.trim();
    if (!description) {
        document.getElementById('descriptionError').textContent = 'Description is required.';
        document.getElementById('descriptionError').style.display = 'block';
        isValid = false;
    } else if (description.length < 10) {
        document.getElementById('descriptionError').textContent = 'Description must be at least 10 characters.';
        document.getElementById('descriptionError').style.display = 'block';
        isValid = false;
    }
    
    // Image validation
    const image = document.getElementById('inv_image').value.trim();
    if (!image) {
        document.getElementById('imageError').textContent = 'Image path is required.';
        document.getElementById('imageError').style.display = 'block';
        isValid = false;
    }
    
    // Thumbnail validation
    const thumbnail = document.getElementById('inv_thumbnail').value.trim();
    if (!thumbnail) {
        document.getElementById('thumbnailError').textContent = 'Thumbnail path is required.';
        document.getElementById('thumbnailError').style.display = 'block';
        isValid = false;
    }
    
    // Price validation
    const price = parseFloat(document.getElementById('inv_price').value);
    if (!price || isNaN(price) || price < 0) {
        document.getElementById('priceError').textContent = 'Price must be a valid number.';
        document.getElementById('priceError').style.display = 'block';
        isValid = false;
    }
    
    // Miles validation
    const miles = parseInt(document.getElementById('inv_miles').value);
    if (!miles && miles !== 0 || isNaN(miles) || miles < 0) {
        document.getElementById('milesError').textContent = 'Miles must be a valid number.';
        document.getElementById('milesError').style.display = 'block';
        isValid = false;
    }
    
    // Color validation
    const color = document.getElementById('inv_color').value.trim();
    if (!color) {
        document.getElementById('colorError').textContent = 'Color is required.';
        document.getElementById('colorError').style.display = 'block';
        isValid = false;
    } else if (color.length < 3) {
        document.getElementById('colorError').textContent = 'Color must be at least 3 characters.';
        document.getElementById('colorError').style.display = 'block';
        isValid = false;
    }
    
    return isValid;
}
