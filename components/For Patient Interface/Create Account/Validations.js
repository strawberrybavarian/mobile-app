function capitalizeWords(text) {
    return text.replace(/\b[a-z]/g, char => char.toUpperCase());
}

export const createFieldValidator = (initialValue = '') => {
  return {
    value: initialValue,
    touched: false,
    error: null,
    setValue: function(newValue) {
      this.value = newValue;
      return this;
    },
    setTouched: function(isTouched = true) {
      this.touched = isTouched;
      return this;
    },
    setError: function(errorMessage) {
      this.error = errorMessage;
      return this;
    },
    reset: function() {
      this.value = initialValue;
      this.touched = false;
      this.error = null;
      return this;
    }
  };
};

// Update firstName validation
export const validateFirstName = (text) => {
  if (!text || text.trim() === '') {
    return "First name is required.";
  }
  
  // Check if name contains only letters, spaces, and en dashes
  if (!/^[a-zA-Z\s\–]+$/.test(text)) {
    return "First name should contain only letters and en dashes.";
  }
  
  return null;
};

export const validateMiddleInitial = (text) => {
    text = text.trim(); // Removes any leading or trailing whitespace
    if (!text) {
        return null; // If the input is empty, validation passes (optional field)
    }

    const regex = /^[a-zA-Z]$/; // Regex ensures only one letter (uppercase or lowercase)
    if (!regex.test(text)) {
        return "Middle Initial must be 1 character long and contain only letters."; // Error message if validation fails
    }

    return null; // Validation passes
};

// Update lastName validation
export const validateLastName = (text) => {
  if (!text || text.trim() === '') {
    return "Last name is required.";
  }

  if (text.length < 2) {
    return "Last name must be at least 2 characters long.";
  }
  
  // Check if name contains only letters, spaces, and en dashes
  if (!/^[a-zA-Z\s\–]+$/.test(text)) {
    return "Last name should contain only letters and en dashes.";
  }
  
  return null;
};

// Update contactNumber validation
export const validateContactNumber = (text) => {
  if (!text || text.trim() === '') {
    return "Contact number is required.";
  }
  
  // Check if the contact number is valid (adjust regex as needed for your region)
  if (!/^[0-9+\s-]{7,15}$/.test(text.trim())) {
    return "Please enter a valid contact number.";
  }
  
  return null;
};

export const validateDob = (dob) => {
    if (!dob) {
        return "Date of birth is required.";
    }

    // const currentDate = new Date();
    // const currentYear = currentDate.getFullYear();
    // const selectedYear = dob.getFullYear();
    // const selectedMonth = dob.getMonth() + 1; // Months are 0-indexed in JS
    // const selectedDay = dob.getDate();

    // // Check if the selected year is in the future or the current year
    // if (selectedYear > currentYear) {
    //     return "Invalid date of birth.";
    // }

    // // Calculate the person's age
    // const age = currentYear - selectedYear;

    // // Check if the person is under 18
    // if (age < 18 || (age === 18 && selectedMonth > currentDate.getMonth() + 1) || 
    //     (age === 18 && selectedMonth === currentDate.getMonth() + 1 && selectedDay > currentDay)) {
    //     return "You must be at least 18 years old.";
    // }

    return null; // Return null if validation passes
};

export const validateGender = (text) => {
    if (!text){
        return "Gender is required.";
    }

    return null; // Return null if validation passes
}

export const validateAddress = (text) => {
    if (!text){
        return "Address is required.";
    }

    return null; // Return null if validation passes
};

export const validateEmail = ( text) => {
    text = text.trim();
    if (!text){
        return "Email is required";
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(text)){
        return "Invalid email format.";
    }
    return null;
}

export const validatePassword = (text) => {
    text = text.trim();
    if (!text){
        return "Password is required.";
    }
    if (text.length < 8){
        return "Password must be at least 8 characters long.";
    }
    if (!/[a-z]/.test(text) || !/[A-Z]/.test(text) || !/[0-9]/.test(text) || !/[^a-zA-Z0-9]/.test(text)){
        return "Password must contain at least one lowercase letter, one uppercase letter, and one number.";
    }

    return null; // Return null if validation passes
}

export const validateConfirmPassword = (password, confirmPassword) => {
    confirmPassword = confirmPassword.trim();
    if (!confirmPassword){
        return "Confirm Password is required.";
    }
    if (password !== confirmPassword){
        return "Passwords do not match.";
    }

    return null; // Return null if validation passes
}

export const validateSpecialty = (text) => {
    if (!text) {
        return "Specialty is required.";
    }

    return null; // Return null if validation passes

}

export const validateLicenseNo = (text) => {
    if (!text) {
        return "License number is required.";
    }

    return null; // Return null if validation passes

}

export const validateRegion = (region) => {
  if (!region || !region.value) {
    return "Region is required.";
  }
  return null;
};

export const validateProvince = (province, regionLabel) => {
  // Province is only required when region is not NCR
  if (regionLabel !== 'NCR' && (!province || !province.value)) {
    return "Province is required.";
  }
  return null;
};

export const validateCity = (city) => {
  if (!city || !city.value) {
    return "City is required.";
  }
  return null;
};

export const validateBarangay = (barangay) => {
  if (!barangay || !barangay.value) {
    return "Barangay is required.";
  }
  return null;
};

// Update street validation
export const validateStreet = (text) => {
  if (!text || text.trim() === '') {
    return "Street address is required.";
  }
  return null;
};

// Update zipCode validation
export const validateZipCode = (text) => {
  if (!text || text.trim() === '') {
    return "ZIP code is required.";
  }
  
  // ZIP codes in Philippines are typically 4 digits
  if (!/^\d{4}$/.test(text.trim())) {
    return "Please enter a valid 4-digit ZIP code.";
  }
  
  return null;
};

// Add this new validation function for nationality
export const validateNationality = (text) => {
  if (!text || text.trim() === '') {
    return "Nationality is required.";
  }
  
  // Check if nationality contains only letters, spaces, and hyphens
  if (!/^[a-zA-Z\s\-]+$/.test(text)) {
    return "Nationality should contain only letters, spaces, and hyphens.";
  }
  
  return null;
};


