import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { ip } from './ContentExport';
import { storeData, getData, deleteData } from './components/storageUtility';
import { updatePassword } from 'firebase/auth';
import * as Notifications from 'expo-notifications';
import { storeUserData, clearUserData } from './utils/userDataStorage';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // Helper to clear all auth data
  const clearAuthData = async () => {
    try {
      await deleteData("authToken");
      await deleteData("userId");
      await deleteData("userRole");
      
      delete axios.defaults.headers.common['Authorization'];
      
      setUser(null);
      setRole(null);
      setToken(null);
      
      console.log("Auth data cleared");
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  };

  // Enhanced logout function with server call
  const logout = async () => {
    try {
      console.log("Starting logout process...");
      
      // First try to tell the server to log out
      try {
        console.log("Calling server logout endpoint...");
        await axios.post(`${ip.address}/api/logout`, {}, {
          withCredentials: true
        });
        console.log("Server logout successful");
      } catch (serverError) {
        // Just log the error, but continue with client-side logout
        console.warn("Server logout failed:", serverError.message);
        console.log("Continuing with client-side logout");
      }
      
      // Always clear client-side auth data, even if server call fails
      await clearAuthData();
      
      // Reset notification counts
      updateUnreadNotificationsCount(0);
      
      // Clear notification badge on app icon
      await Notifications.setBadgeCountAsync(0);
      
      console.log("Logout complete - all auth data cleared");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      
      // Make a final attempt to clear data
      try {
        await clearAuthData();
      } catch (e) {
        console.error("Fatal error during logout cleanup:", e);
      }
      
      return false;
    }
  };

  // Setup axios interceptors
  useEffect(() => {
    // Add request interceptor to add token to each request
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        // Always get fresh token from storage
        const storedToken = await getData("authToken");
        if (storedToken) {
          config.headers.Authorization = `Bearer ${storedToken}`;
          
          // Add these headers to help the backend session middleware
          const userId = await getData("userId");
          const userRole = await getData("userRole");
          if (userId) config.headers['user-id'] = userId;
          if (userRole) config.headers['user-role'] = userRole;
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Don't handle auth errors for these endpoints
        const skipUrls = ['/api/verify-token', '/createappointment', '/api/verify-email-otp', '/login', '/signin', '/signup'];
        const shouldSkip = error.config && skipUrls.some(url => error.config.url.includes(url));
        
        if (error.response?.status === 401 && !shouldSkip && !error.config._isRetry) {
          console.log("401 error detected, attempting token refresh");
          
          try {
            error.config._isRetry = true;
            const storedToken = await getData("authToken");
            
            if (storedToken) {
              // Try again with the token
              error.config.headers.Authorization = `Bearer ${storedToken}`;
              return axios(error.config);
            } else {
              console.log("No token available for retry, logging out");
              await logout();
            }
          } catch (refreshError) {
            console.error("Error during token refresh:", refreshError);
            await logout();
          }
        }
        
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Check for existing token on app load
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        console.log("Checking for stored authentication data...");
        
        // Get ALL required auth data
        const storedToken = await getData("authToken");
        const userId = await getData("userId");
        const userRole = await getData("userRole");
        
        if (storedToken && userId && userRole) {
          try {
            // Try to validate token and fetch user from backend
            const response = await axios.post(`${ip.address}/api/verify-token`, {
              token: storedToken,
              userId,
              userRole
            });
            if (response.data.valid) {
              console.log("Token is valid, session restored");
              
              // Set axios default headers
              axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
              
              // Update app state
              setToken(storedToken);
              setRole(userRole);
              
              // Fetch user data
              let userData;
              if (userRole === 'Doctor') {
                const doctorResponse = await axios.get(`${ip.address}/api/doctor/one/${userId}`);
                userData = doctorResponse.data.doctor;
              } else {
                const patientResponse = await axios.get(`${ip.address}/api/patient/api/onepatient/${userId}`);
                userData = patientResponse.data.thePatient;
              }
              
              setUser(userData);
              
              // Fetch unread notification count
              try {
                const notificationsResponse = await axios.get(
                  `${ip.address}/api/${userRole.toLowerCase()}/notifications/unread-count/${userId}`
                );
                
                if (notificationsResponse.data && typeof notificationsResponse.data.count === 'number') {
                  updateUnreadNotificationsCount(notificationsResponse.data.count);
                }
              } catch (notificationError) {
                console.error("Error fetching notification count:", notificationError);
              }
              
              return;
            }
          } catch (err) {
            // If backend fails, try to restore user from storage
            const storedUser = await getData("user");
            if (storedUser) {
              setUser(JSON.parse(storedUser));
              setToken(storedToken);
              setRole(userRole);
              setLoading(false);
              console.log("Restored user from local storage (offline mode)");
              return;
            }
          }
        }
        
        // If we reach here, no valid session exists
        console.log("No valid session found");
        await clearAuthData();
      } catch (error) {
        console.error("Error restoring session:", error);
        await clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  // Proper login function that stores token
  const login = async (userData, userRole, authToken) => {
    try {
      console.log("Storing auth credentials...");
      
      // Store user data for background tasks
      await storeUserData(userData);

      // Store token in secure storage
      await storeData("authToken", authToken);
      
      // Store user ID and role for backup
      await storeData("userId", userData._id);
      await storeData("userRole", userRole);

      // Store user data in secure storage
      await storeData("user", JSON.stringify(userData));
      
      // Verify storage worked
      const storedToken = await getData("authToken");
      const storedId = await getData("userId");
      const storedRole = await getData("userRole");
      
      if (!storedToken || !storedId || !storedRole) {
        console.error("Failed to store credentials properly");
        return false;
      }
      
      // Set in app state
      setUser(userData);
      setRole(userRole);
      setToken(authToken);
      
      // Set in axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      
      console.log("Login successful, auth data stored");
      return true;
    } catch (error) {
      console.error("Error during login:", error);
      return false;
    }
  };

  // Add this method to update the unread count
  const updateUnreadNotificationsCount = (count) => {
    setUnreadNotificationsCount(count);
  };

  // Debug output
  console.log("UserContext state:", { 
    isAuthenticated: !!user, 
    tokenExists: !!token,
    roleExists: !!role,
    userExists: !!user,
    user: user ? user._id : null
  });

  return (
    <UserContext.Provider value={{ 
      user, 
      role, 
      isAuthenticated: !!user,
      loading,
      login,
      logout,
      unreadNotificationsCount,
      updateUnreadNotificationsCount,
      // Add an updateUser method
      updateUser: (updatedUserData) => {
        setUser(prev => ({...prev, ...updatedUserData}));
      },
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;