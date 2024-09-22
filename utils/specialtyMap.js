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

const specialtyOptions = [
    { value: 'Primary Care & General Medicine', label: 'Primary Care & General Medicine' },
    { value: 'OB-GYN', label: 'OB-GYN' },
    { value: 'Pediatrics', label: 'Pediatrics' },
    { value: 'Cardiology', label: 'Cardiology' },
    { value: 'Ophthalmology', label: 'Ophthalmology' },
    { value: 'Dermatology', label: 'Dermatology' },
    { value: 'Neurology', label: 'Neurology' },
    { value: 'Internal Medicine', label: 'Internal Medicine' },
    { value: 'Endocrinology', label: 'Endocrinology' },
    { value: 'Gastroenterology', label: 'Gastroenterology' },
    { value: 'Hematology', label: 'Hematology' },
    { value: 'Pulmonology', label: 'Pulmonology' },
    { value: 'General Surgery', label: 'General Surgery' },
    { value: 'Orthopedics', label: 'Orthopedics' },
    { value: 'Pedia Surgery', label: 'Pediatric Surgery' },
    { value: 'Pediatric Cardiology', label: 'Pediatric Cardiology' },
];


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
export { specialtyMap, reverseSpecialtyMap, getSpecialtyDisplayName, getSpecialtyCode, specialtyOptions };
