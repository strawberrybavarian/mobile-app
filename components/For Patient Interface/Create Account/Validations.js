function capitalizeWords(text) {
    return text.replace(/\b[a-z]/g, char => char.toUpperCase());
}

export const validateFirstName = (text) => {
    text = text.trim();
    if (!text){
        return "First Name is required";
    }
    const regex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
    if (!regex.test(text)){
        return "First Name must be at least 2 characters long and contain only letters.";
    }

    return null; // Return null if validation passes
}

export const validateMiddleInitial = (text) => {
    text = text.trim();
    if (!text){
        return null;
    }

    const regex = /^[a-zA-Z]$/;
    if (!regex.test(text)){
        return "Middle Initial must be 1 character long and contain only letters.";
    }

    return null; // Return null if validation passes
}

export const validateLastName = (text) => {
    text = text.trim();
    if (!text){
        return "Last Name is required";
    }
    const regex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
    if (!regex.test(text)){
        return "Last Name must be at least 2 characters long and contain only letters.";
    }

    return null; // Return null if validation passes
}

export const validateContactNumber = (text) => {
    text = text.trim();
    if (!text){
        return "Contact number is required.";
    }
    const regex = /^09\d{9}$/;
    if (!regex.test(text)){
        return "Contact number must be 11 digits long and begin with 09.";
    }

    return null; // Return null if validation passes
}

export const validateDob = (dob) => {
    if (!dob) {
        return "Date of birth is required.";
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const selectedYear = dob.getFullYear();
    const selectedMonth = dob.getMonth() + 1; // Months are 0-indexed in JS
    const selectedDay = dob.getDate();

    // Check if the selected year is in the future or the current year
    if (selectedYear > currentYear) {
        return "Invalid date of birth.";
    }

    // Calculate the person's age
    const age = currentYear - selectedYear;

    // Check if the person is under 18
    if (age < 18 || (age === 18 && selectedMonth > currentDate.getMonth() + 1) || 
        (age === 18 && selectedMonth === currentDate.getMonth() + 1 && selectedDay > currentDay)) {
        return "You must be at least 18 years old.";
    }

    return null; // Return null if validation passes
};


export const validateGender = (text) => {
    if (!text){
        return "Gender is required";
    }

    return null; // Return null if validation passes
}

export const validateAddress = (text) => {
    if (!text){
        return "Address is required";
    }

    return null; // Return null if validation passes
}

export const validateEmail = ( text) => {
    text = text.trim();
    if (!text){
        return "Email is required";
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(text)){
        return "Invalid email format.";
    }
    return null; // Return null if validation passes
}

export const validatePassword = (text) => {
    text = text.trim();
    if (!text){
        return "Password is required";
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


