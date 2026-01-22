
export const getBaseUrl = () => {
  const isProd = import.meta.env.PROD;
  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "";

  if (isProd) {
    // If running on CloudFront, we still return "" but the user 
    // MUST configure CloudFront Behaviors to route /api to EC2.
    return "";
  }
  return "http://localhost:5000";
};
