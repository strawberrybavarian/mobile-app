import { createRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

// Create a navigation reference
export const navigationRef = createRef<NavigationContainerRef<any>>();

// Function to get the navigation reference
export function getNavigationRef() {
  return navigationRef;
}

// Helper function to navigate
export function navigate(name: string, params?: object) {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
}