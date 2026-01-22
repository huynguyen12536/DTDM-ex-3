
export const getBaseUrl = () => {
  console.log("Current Mode (PROD):", import.meta.env.PROD);
  if (import.meta.env.PROD) {
    return "";
  }
  return "http://localhost:5000";
};
