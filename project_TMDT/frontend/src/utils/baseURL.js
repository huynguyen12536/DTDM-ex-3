
export const getBaseUrl = () => {
  // Always use VITE_API_URL if defined
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In production (Docker/CloudFront), use relative paths to hit the proxy
  if (import.meta.env.PROD) {
    return "";
  }

  // Fallback for local development
  return "http://localhost:5000";
};
