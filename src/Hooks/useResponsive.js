import { useWindowDimensions } from 'react-native';
import { useMemo } from 'react';

// Define breakpoints similar to Material UI
const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

export default function useResponsive(query, key, start, end) {
  const { width } = useWindowDimensions();
  
  // Calculate the result based on current dimensions
  const result = useMemo(() => {
    const currentWidth = width;
    
    // Helper functions to match MUI breakpoint behavior
    const up = (breakpoint) => currentWidth >= breakpoints[breakpoint];
    const down = (breakpoint) => currentWidth < breakpoints[breakpoint];
    const between = (startPoint, endPoint) => 
      currentWidth >= breakpoints[startPoint] && currentWidth < breakpoints[endPoint];
    const only = (breakpoint) => {
      const keys = Object.keys(breakpoints);
      const currentIndex = keys.indexOf(breakpoint);
      const nextBreakpoint = keys[currentIndex + 1];
      
      return between(breakpoint, nextBreakpoint || 'infinity');
    };
    
    if (query === 'up') {
      return up(key);
    }
    
    if (query === 'down') {
      return down(key);
    }
    
    if (query === 'between') {
      return between(start, end);
    }
    
    if (query === 'only') {
      return only(key);
    }
    
    return null;
  }, [width, query, key, start, end]);
  
  return result;
}