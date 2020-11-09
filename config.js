const port = 3002;
const baseURL = `http://localhost:${port}`;

module.exports = {
  // The secret for the encryption of the jsonwebtoken
  JWTsecret: 'mysecret',

  baseURL: baseURL,
  port: port,

  // The credentials and information for OAuth2
  oauth2Credentials: {
    client_id: "428407383068-nec4si48ja9r4pahl3ohp4rtq3cc8v7m.apps.googleusercontent.com",
    project_id: "t-contact-294623 ", // The name of your project
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "bhdFRmNBMRdiO4BUozBvedZC",
    redirect_uris: [
      `${baseURL}/auth_callback`
    ],
    scopes: [
      'https://www.googleapis.com/auth/youtube.readonly'
    ]
  }
};