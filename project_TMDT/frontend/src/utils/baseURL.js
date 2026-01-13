
export const getBaseUrl = () => {
    // In production (Docker), use relative path - nginx will proxy
    // In development (npm run dev), connect directly to backend
    if (import.meta.env.PROD) {
      return "";
    }
    return "http://localhost:5000";
  };
   