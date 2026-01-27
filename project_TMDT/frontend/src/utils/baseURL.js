
export const getBaseUrl = () => {
  // Always use VITE_API_URL if defined (for both dev and production)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback for local development
  return "http://localhost:5000";
};
