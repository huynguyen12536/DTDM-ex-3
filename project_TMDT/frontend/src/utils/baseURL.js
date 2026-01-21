
export const getBaseUrl = () => {
  if (import.meta.env.PROD) {
    return "";
  }
  return "http://localhost:5000";
};
