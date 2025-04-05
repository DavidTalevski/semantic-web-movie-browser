// src/utils/movieUtils.js

// Ensure safe number conversion from Neo4j integer objects
export const safeNumber = (num) => {
    return typeof num === 'object' && num !== null ? num.low || num.high || 'N/A' : num || 'N/A';
  };
  
  // Format numbers with commas
  export const formatNumber = (num) => {
    const number = safeNumber(num);
    return typeof number === 'number' ? number.toLocaleString() : number;
  };
  
  // Format large numbers (e.g., 1.8K, 2.5M)
  export const formatCompactNumber = (num) => {
    const number = safeNumber(num);
    return typeof number === 'number'
      ? Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(number)
      : 'N/A';
  };
  
  // Format runtime into 'Xh Ym'
  export const formatRuntime = (runtime) => {
    if (!runtime) return 'N/A';
    const minutes = parseInt(runtime, 10);
    return minutes > 0 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes} min`;
  };
  
  // Enhance poster URL by modifying resolution parameters
  export const enhancePosterUrl = (url) => {
    if (!url) return null;
    return url.replace(/_V1_.*\.jpg/, '_V1_UX512_.jpg');
  };
  