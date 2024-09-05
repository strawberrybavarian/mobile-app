// specialtyMap.js

const specialtyMap = {
    PrimaryCare: 'Primary Care & General Medicine',
    Obgyn: 'OB-GYN',
    Pedia: 'Pediatrics',
    Cardio: 'Cardiology',
    Opthal: 'Ophthalmology',
    Derma: 'Dermatology',
    Neuro: 'Neurology',
    InternalMed: 'Internal Medicine',
};

// Generate the reverse mapping object
const reverseSpecialtyMap = Object.fromEntries(
    Object.entries(specialtyMap).map(([key, value]) => [value, key])
);

// Function to get the display name from the specialty code
const getSpecialtyDisplayName = (specialty) => {
    return specialtyMap[specialty] || 'Unknown Specialty';
};

// Function to get the specialty code from the display name
const getSpecialtyCode = (displayName) => {
    return reverseSpecialtyMap[displayName] || 'Unknown Code';
};

// Export the functions and the mapping objects
export { specialtyMap, reverseSpecialtyMap, getSpecialtyDisplayName, getSpecialtyCode };
