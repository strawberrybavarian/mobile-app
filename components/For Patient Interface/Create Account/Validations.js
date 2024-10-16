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

export const validateDob = (selectedDay, selectedMonth, selectedYear, currentYear) => {
    if (!selectedDay || !selectedMonth || !selectedYear) {
        return "Date of birth is required.";
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed in JS
    const currentDay = currentDate.getDate();

    // Check if the selected year is in the future or the current year
    if (selectedYear >= currentYear) {
        return "Invalid date of birth.";
    }

    // Calculate the person's age
    const age = currentYear - selectedYear;

    // Check if the person is under 18
    if (age < 18 || (age === 18 && selectedMonth > currentMonth) || 
        (age === 18 && selectedMonth === currentMonth && selectedDay > currentDay)) {
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

// const validateFirstName = (text) => {
  //   //const capitalized = capitalizeWords(text);
  //   if (!text) {
  //     setfirstnameError("First name cannot be empty.");
  //   } else {
  //     setfirstnameError("");
  //   }
  //   //text.trim();
  //   setFirstName(text);
  // };

  // const validateLastName = (text) => {
  //   //onst capitalized = capitalizeWords(text);
  //   if (!text) {
  //     setlastnameError("Last name cannot be empty.");
  //   } else {
  //     setlastnameError("");
  //   }
  //   setLastName(text);
  // };

  // const validateMiddleInitial = (text) => {
  //   const trimmedInitial = text.trim().replace('.', '');
  //   setMiddleInitial(trimmedInitial.toUpperCase());
  // };

  // const validateEmail = (text) => {
  //   //const lowercased = text.trim().toLowerCase();
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //   if (!emailRegex.test(text)) {
  //     setEmailError("Email format invalid. Example of valid format: xyz@abc.com");
  //   } else {
  //     setEmailError("");
  //   }
  //   setEmail(text);
  // };

  // const validateContactNumber = (text) => {
  //   //const trimmed = text.trim();
  //   const contactNumberRegex = /^09\d{9}$/;

  //   if (!text) {
  //     setContactNumberError("Contact number cannot be empty.");
  //   } else if (!contactNumberRegex.test(text)) {
  //     setContactNumberError("Contact number must start with 09 and contain 11 digits.");
  //   } else {
  //     setContactNumberError("");
  //   }
  //   setContactNumber(text);
  // };
  

  // const validatePassword = (text) => {
  //   const trimmed = text.trim();
  //   if (trimmed.length < 8) {
  //     setPasswordError("Password must be at least 8 characters");
  //   } else {
  //     setPasswordError("");
  //   }
  //   setPassword(trimmed);
  // };

  // const validateConfirmPassword = (text) => {
  //   const trimmed = text.trim();
  //   if (password !== trimmed) {
  //     setConfirmPasswordError("Passwords do not match");
  //   } else {
  //     setConfirmPasswordError("");
  //   }
  //   setConfirmPassword(trimmed);
  // };

  // const validateGender = (value) => {
  //   if (!value) {
  //     setGenderError("Please select a gender.");
  //   } else {
  //     setGenderError("");
  //   }
  //   setGender(value);
  // };

//   const validateEmail = (text) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const trimtext = text.trim(); // Remove leading and trailing whitespaces
//     //const lowerCaseText = trimtext.toLowerCase(); // Convert the input to lowercase
  
//     if (!trimtext) {
//       setEmailError("Email cannot be empty");
//     } else if (!emailRegex.test(trimtext)) {
//       setEmailError("Email format invalid. Example of valid format: xyz@abc.com");
//     } else {
//       setEmailError("");
//     }
//     setEmail(trimtext); // Set the lowercase email
//   };
  
//   const validatePassword = (text) => {
//     if (!text || text.length < 8) {
//       setPasswordError("Password must be at least 8 characters");
//     } else {
//       setPasswordError("");
//     }
//     setPassword(text);
//   };

//   const validateRole = (value) => {
//     if (!value) {
//       setRoleError("Please select a role");
//     } else {
//       setRoleError("");
//     }
//     setRole(value);
//   };