export const authConfig = {
  /*
    |--------------------------------------------------------------------------
    | Public Paths
    |--------------------------------------------------------------------------
    |
    | Define the routes that do not require user authentication. Users can
    | access these paths without being logged in.
    |
    */
  publicPaths: [
    "/login",
    "/registration",
    "/forget-password",
    "/reset-password",
  ],

  /*
    |--------------------------------------------------------------------------
    | Email-based authentication toggle
    |--------------------------------------------------------------------------
    |
    | Flag to enable/disable email-based login
    |
    */
  emailAuthEnabled: true,

  /*
    |--------------------------------------------------------------------------
    | Session Configuration
    |--------------------------------------------------------------------------
    |
    | The settings for managing user sessions. Includes the cookie used to
    | store session tokens and its behavior such as lifespan, scope, and
    | security.
    |
    */
  session: {
    maxAge: 60 * 60 * 24, // 1 day
    httpOnly: true, // Prevent JavaScript access; HTTP only for security
    sameSite: "lax" as const, // Restrict cookies to same-site requests by default
    secure: process.env.NODE_ENV === "production", // Only send cookies over HTTPS in production
    path: "/", // Cookie is accessible site-wide
  },

  /*
    |--------------------------------------------------------------------------
    | JSON Web Token (JWT) Configuration
    |--------------------------------------------------------------------------
    |
    | Settings for managing JWTs, including the secret key used for signing,
    | the token expiration time, and whether encryption is enabled.
    |
    */
  jwt: {
    cookieName: "_access_token",
    refreshCookieName: "_refresh_token",
    secret: process.env.JWT_SECRET || "default_secret_7d", // Secret key for signing and verifying JWTs
    refreshSecret:
      process.env.JWT_REFRESH_TOKEN_SECRET || "default_refresh_secret_7d", // Secret key for signing and verifying JWTs refresh
    expiry: "7d", // Token validity duration (7 days)
    refreshExpiry: "7d", // Token validity duration (7 days)
    encryption: true, // Enable encryption for additional security
  },

  /*
    |--------------------------------------------------------------------------
    | Password Policy
    |--------------------------------------------------------------------------
    |
    | Define the rules for user passwords. Set requirements for length and
    | inclusion of specific character types like uppercase letters, numbers,
    | and symbols.
    |
    */
  passwordPolicy: {
    minLength: 6, // Minimum password length
    requireUppercase: false, // Require at least one uppercase letter
    requireLowercase: false, // Require at least one lowercase letter
    requireNumber: false, // Require at least one number
    requireSymbol: false, // Require at least one special symbol
  },

  /*
    |--------------------------------------------------------------------------
    | Multi-Factor Authentication (MFA) Configuration
    |--------------------------------------------------------------------------
    |
    | Enable and configure MFA for added security. Specify the provider to
    | use and any necessary API keys for SMS-based authentication.
    |
    */
  mfa: {
    enabled: false, // Enable or disable MFA
    provider: "authenticator", // MFA provider: "authenticator", "sms", or "email"
    smsProviderApiKey: process.env.SMS_API_KEY || "", // API key for SMS provider
  },

  /*
    |--------------------------------------------------------------------------
    | Authentication Redirects
    |--------------------------------------------------------------------------
    |
    | Paths for redirection during authentication workflows, such as where
    | users are sent after login or when unauthorized access is detected.
    |
    */
  authRedirects: {
    login: "/login", // Redirect path for the login page
    profile: "/profile", // Redirect path after successful login
    dashboard: "/manage", // Redirect path after successful login
    forbidden: "/403", // Redirect path for unauthorized access attempts
  },
};
