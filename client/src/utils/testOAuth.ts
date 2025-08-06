// Test OAuth configuration
export const oauthConfig = {
  development: {
    backendURL: "http://localhost:5000",
    frontendURL: "http://localhost:5173",
  },
  production: {
    backendURL: "https://proview-backend-five.vercel.app",
    frontendURL: "https://proview-7pk6.vercel.app",
  },
};

export const getOAuthURL = () => {
  const config =
    process.env.NODE_ENV === "production"
      ? oauthConfig.production
      : oauthConfig.development;

  return `${config.backendURL}/auth/google`;
};

export const testOAuthConfig = () => {
  console.log("OAuth Configuration Test:");
  console.log("Environment:", process.env.NODE_ENV || "development");
  console.log("OAuth URL:", getOAuthURL());
  console.log(
    "Google Client ID:",
    "537329570439-t80tu2moo19r307ga33jct2bubtaf9ra.apps.googleusercontent.com"
  );
  console.log("Redirect URIs configured:", [
    "https://proview-backend-five.vercel.app/auth/google/callback",
    "http://localhost:5000/auth/google/callback",
  ]);
};
