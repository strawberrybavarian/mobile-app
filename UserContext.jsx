import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { ip } from './ContentExport';
import { navigate } from './RootNavigation';
import { storeData, getData, deleteData } from './components/storageUtility';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Set up token in axios headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  // Helper to clear all auth data
  const clearAuthData = async () => {
    try {
      await storeData("authToken", "");
      await storeData("userId", "");
      await storeData("userRole", "");
      
      setUser(null);
      setRole(null);
      setToken(null);
      
      delete axios.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Clear all auth data
      await deleteData("authToken");
      await deleteData("userId");
      await deleteData("userRole");
      
      // Remove auth header
      delete axios.defaults.headers.common['Authorization'];
      
      // Reset state
      setUser(null);
      setRole(null);
      setToken(null);
      
      console.log("Logout complete - all auth data cleared");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  };
  
  // Proper login function that stores token
  const login = async (userData, userRole, authToken) => {
    try {
      console.log("Storing auth credentials...");
      
      // Store ALL required data
      await storeData("authToken", authToken);
      await storeData("userId", userData._id);
      await storeData("userRole", userRole);
      
      // Verify storage worked by reading back
      const storedToken = await getData("authToken");
      const storedId = await getData("userId");
      const storedRole = await getData("userRole");
      
      if (!storedToken || !storedId || !storedRole) {
        console.error("Failed to store credentials properly");
        return false;
      }
      
      // Set axios default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      
      // Update context state
      setUser(userData);
      setRole(userRole);
      setToken(authToken);
      
      console.log("Login successful - auth data stored");
      return true;
    } catch (error) {
      console.error("Login storage error:", error);
      return false;
    }
  };

  // Set up axios interceptors
  useEffect(() => {
    axios.defaults.withCredentials = true;

    // Add request interceptor to add token to every request
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        // Always get the latest token from storage for each request
        const storedToken = await getData('authToken');
        if (storedToken) {
          config.headers.Authorization = `Bearer ${storedToken}`;
        }
        
        // Always ensure withCredentials is set
        config.withCredentials = true;
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for handling 401s
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error.response &&
          error.response.status === 401 &&
          !error.config.url.includes('/api/verify-token') && 
          !error.config.url.includes('/createappointment') && 
          !error.config._isRetry
        ) {
          console.log("401 error detected - attempting token refresh before logout");
          
          try {
            const storedToken = await getData('authToken');
            
            if (storedToken) {
              console.log("Found stored token, attempting retry");
              error.config._isRetry = true;
              error.config.headers['Authorization'] = `Bearer ${storedToken}`;
              return axios(error.config);
            } else {
              console.log("No stored token, proceeding with logout");
              logout();
            }
          } catch (refreshErr) {
            console.log("Token refresh failed:", refreshErr);
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Check for existing session
  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        console.log("Checking for stored authentication data...");
        
        // Get ALL auth data at once
        const storedToken = await getData("authToken");
        const userId = await getData("userId");
        const storedRole = await getData("userRole");
        
        // Debug what we found
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
        
        // Set token in axios defaults
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        try {
          // Verify token with server
          console.log("Verifying token with server...");
          const response = await axios.get(`${ip.address}/api/verify-token`);
          
          if (response.data && (response.data.user || response.data.valid)) {
            console.log("Server verified token as valid");
            
            // Get user data either from response or from storage
            const userData = response.data.user || { _id: userId };
            
            // Set the auth state
            setUser(userData);
            setRole(storedRole);
            setToken(storedToken);
            
            console.log(`Successfully restored session as ${storedRole}`);
          } else {
            console.log("Server rejected token");
            await logout();
          }
        } catch (verifyError) {
          console.error("Token verification failed:", verifyError.message);
          
          // Only clear if error is auth-related
          if (verifyError.response && verifyError.response.status === 401) {
            console.log("Clearing invalid session data");
            await logout();
          } else {
            // For network errors, keep the session
            console.log("Network error, keeping stored credentials");
            setUser({ _id: userId });
            setRole(storedRole);
            setToken(storedToken);
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

  // Debug output
  console.log("UserContext state:", { 
    isAuthenticated: !!user, 
    userExists: !!user, 
    roleExists: !!role,
    tokenExists: !!token,
    user: user ? (user._id ? `${user._id.substring(0,6)}...` : 'No ID') : null
  });

  return (
    <UserContext.Provider value={{ 
      user, 
      role, 
      login,
      logout,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;