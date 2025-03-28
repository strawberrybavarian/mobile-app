import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { ip } from './ContentExport';
import { storeData, getData, deleteData } from './components/storageUtility';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Logout function
  const logout = async () => {
    try {
      // Clear all auth data
      await clearAuthData();
      console.log("Logout complete - all auth data cleared");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
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
        const storedRole = await getData("userRole");
        
        console.log("Auth data check:", {
          hasToken: !!storedToken,
          hasUserId: !!userId, 
          hasRole: !!storedRole
        });
        
        if (!storedToken || !userId || !storedRole) {
          console.log("Incomplete auth data in storage");
          setLoading(false);
          return;
        }
        
        // Set token in axios headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        try {
          // Verify token with backend
          console.log("Verifying token with server...");
          const response = await axios.get(`${ip.address}/api/verify-token`);
          
          if (response.data && (response.data.user || response.data.valid)) {
            console.log("Token verified successfully");
            
            // Get user data from response or create minimal user object
            const userData = response.data.user || { _id: userId };
            
            // Update app state
            setUser(userData);
            setRole(storedRole);
            setToken(storedToken);
            
            console.log(`Successfully restored session as ${storedRole}`);
          } else {
            console.log("Server rejected token");
            await clearAuthData();
          }
        } catch (verifyError) {
          console.error("Token verification failed:", verifyError.message);
          
          // For network errors, keep stored credentials
          if (!verifyError.response) {
            console.log("Network error, keeping stored credentials");
            setUser({ _id: userId });
            setRole(storedRole);
            setToken(storedToken);
          } else if (verifyError.response.status === 401) {
            console.log("Token expired or invalid, clearing auth data");
            await clearAuthData();
          }
        }
      } catch (error) {
        console.error("Session restoration error:", error);
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
      
      // Store token in secure storage
      await storeData("authToken", authToken);
      
      // Store user ID and role for backup
      await storeData("userId", userData._id);
      await storeData("userRole", userRole);
      
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
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;