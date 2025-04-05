// Add this improved logout function to your UserContext.js

import { removeData, clearAllData } from './components/storageUtility';
import axios from 'axios';
import { ip } from './ContentExport';

export const logout = async () => {
  try {
    // Get stored user data for request headers
    const userId = await getData('userId');
    const userRole = await getData('userRole');
    const token = await getData('token');

    // Configure headers for the logout request
    const config = {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'User-Id': userId || '',
        'User-Role': userRole || ''
      },
      withCredentials: true
    };

    // Make the API call to server for logout
    await axios.post(`${ip.address}/api/logout`, {}, config);
    
    // Clear ALL local storage data regardless of API response
    await clearAllData();

    // Clear memory state
    setUser(null);
    
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if the API call fails, clear the local storage anyway
    // This ensures the user is logged out on the client side
    try {
      await clearAllData();
      setUser(null);
      return true;
    } catch (storageError) {
      console.error('Error clearing storage during logout:', storageError);
      return false;
    }
  }
};