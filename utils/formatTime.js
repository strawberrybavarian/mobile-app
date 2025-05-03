// Fix time formatting to prevent duplicate AM/PM issues

export const formatTime = (timeString) => {
  if (!timeString) return '';
  
  try {
    // STEP 1: Clean any duplicate AM/PM markers
    if (typeof timeString === 'string') {
      // Remove ALL instances of AM/PM to prevent duplication
      const timeWithoutAmPm = timeString.replace(/\s*(AM|PM)/gi, '').trim();
      
      // Check if it's already in 24-hour format
      if (/^\d{1,2}:\d{2}$/.test(timeWithoutAmPm)) {
        const [hours, minutes] = timeWithoutAmPm.split(':').map(num => parseInt(num));
        
        // Format as 12-hour with proper AM/PM
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHour = hours % 12 || 12;
        const displayMinute = minutes < 10 ? `0${minutes}` : minutes;
        
        return `${displayHour}:${displayMinute} ${period}`;
      }
    }
    
    // STEP 2: Continue with existing logic for other formats
    // Handle time objects with hour and minute properties
    if (typeof timeString === 'object' && timeString.hour !== undefined) {
      const { hour, minute } = timeString;
      const hours = parseInt(hour);
      const mins = parseInt(minute || 0);
      
      // Format 12-hour time with AM/PM
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHour = hours % 12 || 12; // Convert 0 to 12
      const displayMinute = mins < 10 ? `0${mins}` : mins;
      
      return `${displayHour}:${displayMinute} ${period}`;
    }
    
    // Handle string formats or numbers
    if (typeof timeString === 'string' || typeof timeString === 'number') {
      // Remove ALL existing AM/PM markers first
      let cleanTime = String(timeString).replace(/\s*(AM|PM)/gi, '').trim();
      
      // Parse the time components
      let [hours, minutes] = cleanTime.split(':').map(num => parseInt(num));
      
      // Default to 0 if parsing fails
      hours = isNaN(hours) ? 0 : hours;
      minutes = isNaN(minutes) ? 0 : minutes;
      
      // Format 12-hour time with AM/PM
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHour = hours % 12 || 12;
      const displayMinute = minutes < 10 ? `0${minutes}` : minutes;
      
      return `${displayHour}:${displayMinute} ${period}`;
    }
  } catch (error) {
    console.error("Time formatting error:", error);
    return 'Invalid time';
  }
  
  return timeString;
};