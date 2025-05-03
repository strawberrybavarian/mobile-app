/**
 * Masks an email address to show only first and last character before the @ symbol
 * @param {string} email - The email address to mask
 * @returns {string} - The masked email address
 */
export const maskEmail = (email) => {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return email;
  }

  const [localPart, domain] = email.split('@');
  
  if (localPart.length <= 2) {
    // If local part is too short, just mask the middle if possible
    return localPart.length === 1 
      ? `${localPart}@${domain}` 
      : `${localPart[0]}*@${domain}`;
  }
  
  // Get first and last characters of local part
  const firstChar = localPart[0];
  const lastChar = localPart[localPart.length - 1];
  
  // Create asterisks for middle characters
  const asterisks = '*'.repeat(localPart.length - 2);
  
  return `${firstChar}${asterisks}${lastChar}@${domain}`;
};